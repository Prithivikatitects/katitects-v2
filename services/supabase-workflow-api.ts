import { supabase } from "./supabaseClient";

// Map workflow IDs to Supabase edge functions
const workflowMapping = {
  // Sketch To Furnish
  "0294186c-79bf-47a6-9dee-d250fc046623": "sketch-to-furnish",
  // Style Transfer (Refurnishing)
  "6fcda97d-c356-4233-b1e9-de42140cd57b": "styly-transfer",
  // Select & Modify (Masking)
  "f9b235f4-62c0-48e3-9c5a-7453429f3725": "sketch-to-furnish", // Uses sketch-to-furnish with mask
  // Render Enhancer
  "9a4dcc71-7d71-4067-8d18-6b9e08882135": "render-enhancer",
};

// Map workflow modes to edge functions
const modeMapping = {
  interior: "sketch-to-furnish",
  exterior: "exterior-ai",
  enhancement: "render-enhancer",
};

/**
 * Main function that replaces runComfyDeployWorkflow
 * Maintains exact same interface as ComfyDeploy
 */
export const runComfyDeployWorkflow = async (
  deploymentId: string,
  inputs: any,
  onProgress?: (progress: number, status?: string) => void
) => {
  try {
    // Map deployment ID to edge function
    let edgeFunctionName =
      workflowMapping[deploymentId as keyof typeof workflowMapping];

    // If not found by ID, try by mode
    if (!edgeFunctionName && inputs.mode) {
      edgeFunctionName = modeMapping[inputs.mode as keyof typeof modeMapping];
    }

    // Special case: if style image is provided, use styly-transfer
    if (inputs.input_styleimage) {
      edgeFunctionName = "styly-transfer";
    }

    // Default to sketch-to-furnish if nothing matches
    if (!edgeFunctionName) {
      edgeFunctionName = "sketch-to-furnish";
    }

    console.log("Using edge function:", edgeFunctionName);
    console.log("Input data:", {
      deploymentId,
      edgeFunction: edgeFunctionName,
      hasImage: !!inputs.input_image,
      hasStyleImage: !!inputs.input_styleimage,
      hasMask: !!inputs.input_mask,
    });

    // Get auth token
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError || !session) {
      throw new Error("Authentication required");
    }

    console.log(session, "session data");

    // Prepare request body - keep exact same structure
    const requestBody: any = {
      input_image: inputs.input_image,
      positive: inputs.positive || "",
      input_checkpoint: inputs.input_checkpoint,
      workflow_id: deploymentId,
      version: inputs.version || "1.0",
      batch_number: inputs.batch_number || inputs.batch_size || 1,
    };

    console.log("Request body:", requestBody);
    console.log(inputs, "Full inputs");

    // Add optional fields if present
    if (inputs.input_styleimage) {
      requestBody.input_styleimage = inputs.input_styleimage;
    }
    if (inputs.input_mask) {
      requestBody.input_mask = inputs.input_mask;
    }

    // Call Supabase edge function
    const { data, error } = await supabase.functions.invoke(edgeFunctionName, {
      body: requestBody,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to call edge function");
    }

    if (!data || !data.runId) {
      throw new Error("No run ID received from edge function");
    }

    const runId = data.runId;
    const externalJobId = data.external_job_id;
    console.log(`Run created with ID: ${runId}, External ID: ${externalJobId}`);

    // Poll for results - mimicking ComfyDeploy behavior
    let pollAttempts = 0;
    const maxAttempts = 60; // 3 minutes max (3 seconds * 60)

    while (pollAttempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      pollAttempts++;

      try {
        console.log(
          `Polling attempt ${pollAttempts}/${maxAttempts} for job ${runId}`
        );

        // Call job-status endpoint
        const { data: statusData, error: statusError } =
          await supabase.functions.invoke("job-status", {
            body: {
              job_id: runId,
              external_job_id: externalJobId,
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

        if (statusData.status === "failed") {
          throw new Error(statusData.error || "Generation failed");
        }

        if (statusError) {
          console.warn("Status check error:", statusError);
          continue; // Keep polling
        }

        console.log("Job status:", statusData);

        if (statusData.status === "completed" && statusData.result) {
          // Success - return in ComfyDeploy format
          console.log("Workflow completed successfully");

          // Return outputs in the exact format expected
          return [
            {
              data: {
                images: [
                  {
                    url: statusData.result.url,
                  },
                ],
              },
            },
          ];
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Generation failed");
        }

        // Update progress
        const progress =
          statusData.progress || (pollAttempts / maxAttempts) * 100;
        if (onProgress) {
          onProgress(progress / 100, statusData.status);
        }
      } catch (pollError) {
        console.warn("Polling error (will retry):", pollError);
      }
    }

    // If we get here, polling timed out
    throw new Error("Generation timed out. Please try again.");
  } catch (error: any) {
    console.error("Error in supabaseWorkflowApi:", error);

    // Format error message to match ComfyDeploy error format
    if (error.message?.includes("Insufficient credits")) {
      throw new Error(
        "Insufficient credits. Please purchase more credits to continue."
      );
    } else if (error.message?.includes("Unauthorized")) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.message?.includes("required")) {
      throw new Error(`Invalid workflow configuration: ${error.message}`);
    } else {
      throw new Error(`Workflow failed: ${error.message || "Unknown error"}`);
    }
  }
};

// Credit consumption function
export const consumeCredits = async (
  userId: string | undefined,
  requiredCredits: number
) => {
  if (!userId) {
    throw new Error("User ID is required to consume credits");
  }

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits_remaining")
    .eq("id", userId)
    .single();

  if (!profile || profile.credits_remaining < requiredCredits) {
    throw new Error("Insufficient credits");
  }

  // Update credits
  const { data, error: updateError } = await supabase
    .from("profiles")
    .update({
      credits_remaining: profile.credits_remaining - requiredCredits,
      // credits_remaining: 100,
      updated_at: new Date(),
    })
    .eq("id", userId)
    .select();

  if (updateError) {
    console.error("Error updating credits:", updateError);
    throw new Error("Failed to update credits");
  }

  return data;
};

// Get public URL helper
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
