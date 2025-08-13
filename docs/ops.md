# Operations Guide

## Vercel Cron
Configure a Vercel Cron job to call `/api/cron/email-sync?secret=YOUR_SECRET` every 5-10 minutes in production. Set `CRON_SECRET` in environment variables and ensure the job uses `GET`.

## Supabase Storage
Create two buckets in Supabase Storage:
- `public-assets`
- `doctor-docs`

Apply the RLS policies from `supabase/migrations/20240927_m3.sql` and set `public-assets` as public if needed. `doctor-docs` objects should include metadata `{ "owner_id": "<user_id>" }` on upload.

## Zoom & Wallet Credentials
Obtain Zoom Server-to-Server OAuth credentials from the Zoom Marketplace (Account ID, Client ID, Client Secret). For Apple Wallet, generate a Pass Type ID certificate and `.p8` key from the Apple Developer portal. For Google Wallet, create a service account and download the credentials JSON.
