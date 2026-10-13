import { json, preflight } from "../_shared/http.ts";
import { requireAdmin } from "../_shared/supabase.ts";
Deno.serve(async (req) => {
  const pre = preflight(req); if (pre) return pre;
  try {
    const { admin } = await requireAdmin(req);
    // Never expose this function to anonymous visitors. requireAdmin checks auth UUID.
    const { data, error } = await admin.from("seller_submissions")
      .select("id,seller_name,seller_email,seller_phone,brand,model,variant,condition,asking_price,description,photo_paths,proof_path,status,created_at")
      .eq("status","pending").order("created_at",{ascending:false}).limit(100);
    if (error) throw new Error("Could not load submissions. Verify schema column names.");
    return json({ submissions:data || [] });
  } catch (e) {
    const text = e instanceof Error ? e.message : "Request failed.";
    const status = text.startsWith("Forbidden") ? 403 : (text.includes("Authentication") ? 401 : 500);
    return json({ error:text },status);
  }
});
