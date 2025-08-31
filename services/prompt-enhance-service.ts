import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentResult,
} from "@google/generative-ai";

// Helper function for blob to base64 conversion
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);

export const enhancePrompt = async (
  currentPrompt: string = "",
  imageData: string | null = null,
  style: string = "",
  mode: "interior" | "facade" = "interior",
  maskImage: string | null = null
): Promise<string> => {
  try {
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
    });

    const inputs: (
      | string
      | { inlineData: { data: string; mimeType: string } }
    )[] = [];

    // Base prompt
    let promptBase = maskImage
      ? `Focus EXCLUSIVELY on the RED AREAS in the mask image. These red regions show specific elements to be replaced. `
      : `Analyze the entire image. `;

    if (currentPrompt) {
      promptBase += `Consider the user's prompt "${currentPrompt}" while `;
    }

    // Detailed instruction
    const instruction = maskImage
      ? `Provide EXACTLY 3-4 specific keywords describing ONLY what should replace the red masked area. Your response must:
    1. ONLY describe the exact object/element in the red region (e.g., if a table is masked, only describe the table)
    2. Match the ${style || "modern"} style aesthetic
    3. Include specific materials and finishes
    4. Be extremely concise
    
    Format: ONLY return 3-4 comma-separated keywords like 'oval marble dining table, brass-finished base, cream-veined surface'`
      : `Return ONLY a comma-separated list of descriptive tags (no introductory text or explanations) that includes:
    - Primary ${style || "modern"} style elements
    - ${
      mode === "interior" ? "Room type and purpose" : "Facade characteristics"
    }
    - ${
      mode === "interior" ? "Furniture and fixtures" : "Architectural features"
    }
    - Materials and textures
    - Color palette
    - Lighting elements
    - Atmosphere and mood
    
    Example format: ${
      mode === "interior"
        ? "luxurious modern, spacious living room, leather sectional sofa, marble accent wall, warm lighting, sophisticated atmosphere"
        : "modern facade, reflective glass panels, steel framework, grand entrance, ambient lighting, imposing presence"
    }`;

    inputs.push(promptBase + instruction);

    // Add images if provided
    if (imageData || maskImage) {
      try {
        if (imageData) {
          const response = await fetch(imageData);
          const blob = await response.blob();
          const base64Data = await blobToBase64(blob);
          inputs.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          });
        }

        if (maskImage) {
          const response = await fetch(maskImage);
          const blob = await response.blob();
          const base64Data = await blobToBase64(blob);
          inputs.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          });
        }
      } catch (error) {
        console.warn("Failed to process image(s) for Gemini:", error);
      }
    }

    if (maskImage) {
      inputs.push(
        "The second image is a mask where RED areas indicate specific elements to be replaced. Focus ONLY on describing what should replace these exact red areas - nothing else."
      );
    }

    const result: GenerateContentResult = await model.generateContent(inputs);
    let enhancedPrompt: string = await result.response.text();

    if (maskImage) {
      enhancedPrompt = enhancedPrompt
        .replace(/^.*?(?=[\w-]+(?:,|$))/i, "")
        .split(",")
        .slice(0, 5)
        .join(",");
    }

    let cleanedPrompt = enhancedPrompt
      .replace(/^.*?(\w+(?:,|$))/i, "$1")
      .replace(/^["']|["']$/g, "")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s+/g, " ")
      .replace(/\.$/, "")
      .replace(
        /^here'?s?\s+(?:an?\s+)?(?:enhanced\s+)?(?:architectural\s+)?(?:prompt\s*:?\s*)?/i,
        ""
      )
      .trim();

    if (currentPrompt) {
      const keyTerms = currentPrompt.toLowerCase().split(/[\s,]+/);
      const importantTerms = keyTerms.filter(
        (term) =>
          term.length > 3 && !["and", "the", "with", "for"].includes(term)
      );

      importantTerms.forEach((term) => {
        if (!cleanedPrompt.toLowerCase().includes(term)) {
          cleanedPrompt = `${term}, ${cleanedPrompt}`;
        }
      });
    }

    return cleanedPrompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    throw new Error("Failed to enhance prompt");
  }
};
