import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
export function serviceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Server environment is missing Supabase credentials.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function userClient(req: Request) {
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const auth = req.headers.get("Authorization");
  if (!url || !anon || !auth) throw new Error("Authentication required.");
  return createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false, autoRefreshToken: false } });
}
export async function requireAdmin(req: Request) {
  const sb = userClient(req);
  const { data: userData, error: userError } = await sb.auth.getUser();
  if (userError || !userData.user) throw new Error("Authentication required.");
  const admin = serviceClient();
  // SCHEMA CONTRACT: admin_users.user_id must contain the Supabase Auth UUID.
  const { data, error } = await admin.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (error) throw new Error("Could not verify admin authorization. Check admin_users schema.");
  if (!data) throw new Error("Forbidden: this account is not an authorized admin.");
  return { admin, user: userData.user };
}
