// supabaseClient.ts
import {
  createClient,
  SupabaseClient,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      debug: false,
    },
    db: {
      schema: "public",
    },
  }
);

// Define Profile type (adjust fields to match your DB schema)
export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  username: string;
  email: string;
  subscription_tier: string | null;
  credits_remaining: number;
  subscription_start: string | null;
  subscription_end: string | null;
  subscription_status: string | null;
  lemon_subscription_id: string | null;
  updated_at?: string;
}

// -------------------- Subscription-related queries --------------------

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error }: PostgrestSingleResponse<Profile> = await supabase
    .from("profiles")
    .select(
      `
      id,
      name,
      avatar_url,
      username,
      email,
      subscription_tier,
      credits_remaining,
      subscription_start,
      subscription_end,
      subscription_status,
      lemon_subscription_id
    `
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile[] | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data as Profile[];
};

export const consumeCredits = async (
  userId: string,
  amount: number
): Promise<Profile[] | null> => {
  // First get current credits
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits_remaining")
    .eq("id", userId)
    .single<{ credits_remaining: number }>();

  if (fetchError) {
    console.error("Error fetching credits:", fetchError);
    throw new Error("Failed to check credits");
  }

  // Example: disabled insufficient credits check
  // if (!profile || profile.credits_remaining < amount) {
  //   throw new Error("Insufficient credits");
  // }

  // Update credits (currently hardcoded to 100)
  const { data, error: updateError } = await supabase
    .from("profiles")
    .update({
      credits_remaining: 100,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select();

  if (updateError) {
    console.error("Error updating credits:", updateError);
    throw new Error("Failed to update credits");
  }

  return data as Profile[];
};

// -------------------- Auth Helpers --------------------

const refreshSession = async (): Promise<boolean> => {
  const { error } = await supabase.auth.refreshSession();
  return !error;
};

export const supabaseApiCall = async <T>(
  apiCall: () => Promise<T>
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.message === "JWT expired") {
      const refreshed = await refreshSession();
      if (refreshed) {
        return await apiCall();
      }
    }
    throw error;
  }
};

export const logRequestDetails = async (endpoint: string): Promise<void> => {
  const { data } = await supabase.auth.getSession();
  console.log(`Request to ${endpoint}, session:`, data.session?.access_token);
};

export const getApiKey = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session?.access_token || null;
};

// -------------------- Storage Helper --------------------

export const getPublicUrl = (
  bucketName: string,
  filePath: string,
  options: Record<string, any> = {}
): string | null => {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath, options);

    return data?.publicUrl || null;
  } catch (error) {
    console.error("Error getting public URL:", error);
    return null;
  }
};
