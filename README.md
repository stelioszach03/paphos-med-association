# Ιατρικός Σύλλογος Πάφου «Ασκληπιός» — Starter (Next.js + Supabase)

Έτοιμος σκελετός: Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth/RLS/Storage) + i18n (EL/EN/RU/ZH) + βασικό CMS & φόρμα εγγραφής.

## 1) Προαπαιτούμενα
- Node 18+
- Λογαριασμός στο Supabase (project)
- (προαιρετικά) Vercel account για deploy

## 2) Ρύθμιση Supabase
1. Δημιούργησε νέο Project.
2. Αντέγραψε **Project URL** και **anon public key** (Settings → API).
3. Άνοιξε **SQL Editor** και τρέξε το περιεχόμενο του `supabase/database.sql` (δημιουργεί tables, RLS, policies, storage buckets).
4. Πρόσθεσε τον εαυτό σου σαν **Super Admin**:
   ```sql
   insert into public.admin_users(user_id, role)
   values ('<YOUR_AUTH_USER_UUID>', 'super_admin');
   ```
   Το `YOUR_AUTH_USER_UUID` θα εμφανιστεί μετά που θα συνδεθείς μια φορά στην εφαρμογή.

## 3) Περιβάλλον
Αντέγραψε `.env.example` σε `.env.local` και συμπλήρωσε:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (μόνο για server routes, μην το βάλεις σε client)
```

## 4) Εκκίνηση
```bash
pnpm i   # ή npm i / yarn
pnpm dev # http://localhost:3000 -> θα ανακατευθύνει σε /el
```

## 5) Ρόλοι & Πρόσβαση
- **/el/(auth)/login**: Supabase email link/password (ανάλογα με ρυθμίσεις).
- **/el/admin**: Μόνο για Admin/Super Admin (ελεγχόμενο από db).
- **/el/doctor**: Συνδεδεμένο μέλος.
- **/el/join**: Δημόσια φόρμα αίτησης (αποθηκεύει σε `applications`).

## 6) Επόμενα Milestones
- CRUD UI για Άρθρα/Ανακοινώσεις/Εκδηλώσεις (admin).
- Έλεγχος & έγκριση αιτήσεων, δημιουργία `memberships`.
- Έκδοση ψηφιακής κάρτας (Apple Wallet/Google Wallet) και QR verification endpoint.
- Zoom Meeting SDK + ICS invitations.
- Email inbox (IMAP) μέσα στο Admin + Dockerized mail stack ή managed relay.
- A11y audit (WCAG 2.2 AA), monitoring (Sentry), SEO schema.

> Σημ.: Ο σκελετός είναι “production-minded” (RLS, policies, i18n). Θα επεκταθεί με UI/flows.
