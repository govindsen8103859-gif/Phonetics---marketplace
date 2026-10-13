export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "https://govindsen8103859-gif.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
export function preflight(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const allowed = Deno.env.get("ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  if (allowed && origin && origin !== allowed) return json({ error: "Origin not allowed" }, 403);
  return null;
}
export function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().replace(/[<>]/g, "").slice(0, max) : "";
}
export function validEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}
export function safeJson(req: Request) {
  return req.json().catch(() => null);
}
export function safeFilename(name: string) {
  const ext = name.toLowerCase().match(/\.(jpg|jpeg|png|webp|pdf)$/)?.[1];
  return `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : (ext || "bin")}`;
}
