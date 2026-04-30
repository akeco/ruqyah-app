import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing Supabase URL (SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL)");
}

export const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey || "");

export const supabaseAnon = createClient(supabaseUrl, anonKey || serviceRoleKey || "");
