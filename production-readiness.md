# Production readiness gate — do not skip

This package is a hardened deployment candidate, not certified production-ready. The existing Supabase schema/policies were not available for inspection when it was generated. No real customer data should be accepted until every blocking item below is complete.

## Required schema contract to verify/adapt
- `admin_users.user_id` stores the authorized Supabase Auth UUID. If not, update `_shared/supabase.ts` to use the real UUID column.
- `seller_submissions` fields currently expected: `id`, `seller_name`, `seller_email`, `seller_phone`, `brand`, `model`, `variant`, `condition`, `asking_price`, `description`, `photo_paths`, `proof_path`, `status`, `created_at`; admin review additionally expects `admin_note`, `reviewed_by`, `reviewed_at`.
- `buyer_requests` fields currently expected: `buyer_name`, `buyer_email`, `buyer_phone`, `phone_interest`, `message`, `status`, `created_at`.
- `public_phone_listings` must be a safe view that exposes only approved and active public fields. It must not include seller contact data, asking price, proof paths, admin notes or private storage paths.
- `submit-seller` temporarily stores both unreviewed photos and proof files in private `seller-proofs`; after schema review, implement an authorized approval workflow that copies only approved photos to public `phone-photos` and creates/updates `phone_listings`.
- The admin review function intentionally does **not** automatically publish to `phone_listings`, because guessing its schema could leak private data or publish the wrong record.

## Deployment checklist
1. Inspect schema with `inspect_existing_schema.sql`; do not drop/rename existing objects.
2. Confirm RLS enabled on all private tables.
3. Make anonymous direct reads of `seller_submissions`, `buyer_requests`, and `admin_users` fail.
4. Create a safe `public_phone_listings` view after checking actual columns and confirm only approved/active rows are visible.
5. Verify storage buckets. `seller-proofs` must be private. New uploads must not be public.
6. Set Edge Function secrets using Supabase's secret settings/CLI: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ALLOWED_ORIGIN`. Service-role key must remain server-side only.
7. Configure `ALLOWED_ORIGIN` to the exact published site origin, e.g. `https://govindsen8103859-gif.github.io` (confirm current deployment URL).
8. Deploy functions and test with dummy records.
9. Add rate limiting and bot protection/CAPTCHA before public launch; CORS is not authentication or abuse protection.
10. Complete admin UUID mapping and test both authorized and unauthorized accounts.
11. Complete approve/reject/publish workflow including approved-photo promotion and public listing record creation.
12. Test email notifications separately; no email sending is implemented in this package.
13. Test on Android, desktop, and private browser session.
14. Review legal pages, privacy notice, support contact, moderation rules, data retention, and deletion process before launch.

## Important behavior
- Browser submits to Edge Functions rather than inserting private rows directly.
- Service role is referenced only in Edge Function server code and must be configured as a server secret.
- Client-side checks are for usability; backend validation is authoritative.
- The Edge Function code has not been deployed against your actual project schema, so it may return a generic error until field names are reconciled.
