# Phonetics — production-hardening candidate

**Find your next phone. Love the price.**

Responsive marketplace starter with a premium navy/white/gold storefront, searchable phone catalogue, seller submission form, buyer enquiry form, and an initial private admin console.

## Honest status

This ZIP is **not yet safe to call production-ready**. Your current Supabase table columns, relationships, RLS policies, bucket settings, and email templates were not independently verified at generation time. The included backend functions use a documented schema contract and must be reconciled with the existing schema before deployment. The admin review function marks review status but deliberately does not publish a listing automatically until the `phone_listings` schema and approved-photo workflow are verified.

## Files
- `index.html`, `styles.css`, `app.js`: storefront
- `admin.html`, `admin.js`: admin sign-in and pending submission console
- `config.js`: browser-safe project config only
- `supabase/functions/`: Edge Function starter code
- `supabase/verification/`: read-only schema inspection and release gate

## Existing resources
- Existing repository: `https://github.com/govindsen8103859-gif/phonetics-official`
- Expected Pages address: `https://govindsen8103859-gif.github.io/phonetics-official/`
- Supabase project URL and publishable key were carried forward from the owner-provided project information. Verify them in Supabase before deployment.

## Android deployment outline
1. Extract this ZIP.
2. Upload the extracted files and folders to the root of your existing `phonetics-official` GitHub repository. Do not create another repo.
3. Commit changes and verify GitHub Pages deployment.
4. Run `supabase/verification/inspect_existing_schema.sql` in Supabase SQL Editor.
5. Read `supabase/verification/production-readiness.md` and reconcile the schema contract before deploying Edge Functions.
6. Set Edge Function secrets in Supabase server-side settings. Never paste the service-role key into GitHub, `config.js`, or browser JavaScript.
7. Deploy the functions using Supabase CLI or the Supabase dashboard if supported for your project.
8. Test with dummy data and unauthorized sessions before any real use.

## Edge Function names
- `submit-seller`
- `submit-buyer`
- `admin-list-submissions`
- `admin-review-submission`

## Security notes
- A public/publishable key is not a secret, but it does not make database policies secure.
- `SUPABASE_SERVICE_ROLE_KEY` must exist only in server-side Edge Function secrets.
- Admin access checks `auth.uid()` against `admin_users.user_id`; adapt this to the actual UUID column.
- `public_phone_listings` must be a safe public view. Do not point the public site directly at a private table with `select(*)`.
- Seller uploads are held in private `seller-proofs` until a reviewed promotion workflow is implemented.
- No email notifications are implemented/enabled here. Configure and test them separately.
- Add rate limiting and bot protection before public launch.
