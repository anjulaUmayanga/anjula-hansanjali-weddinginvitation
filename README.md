# Kasun & Nethmi Wedding Invitation

Luxury mobile-first wedding invitation — Next.js, TypeScript, Tailwind.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Guest links (simple slugs)

Guests live in `src/data/guests.json` with three formats:

| Type | Slug example | Display name |
|------|--------------|--------------|
| One person | `/g/anjula` | **Mr. Anjula** |
| Couple | `/g/anjula-hansa` | **Mr. & Mrs. Anjula & Hansa** |
| Family | `/g/jayasiri-family` | **Family of Jayasiri** |

### Sample guests

- http://localhost:3000/g/anjula → Mr. Anjula  
- http://localhost:3000/g/anjula-hansa → Mr. & Mrs. Anjula & Hansa  
- http://localhost:3000/g/jayasiri-family → Family of Jayasiri  
- http://localhost:3000/g/kasun → Mr. Kasun  
- http://localhost:3000/g/dilshan-amaya → Mr. & Mrs. Dilshan & Amaya  
- http://localhost:3000/g/perera-family → Family of Perera  

### Add a guest

```json
{
  "sachini": { "type": "one", "name": "Sachini", "maxGuests": 1 },
  "ruwan-amal": { "type": "two", "name": "Ruwan & Amal", "maxGuests": 2 },
  "silva-family": { "type": "family", "name": "Silva", "maxGuests": 4 }
}
```

Optional query (no JSON entry): `/?g=Anjula&t=one` or `/?g=Anjula%20%26%20Hansa&t=two`

## Photos

All under `public/photos/`:

| File | Used as |
|------|---------|
| `maincover.jpg` | Hero cover background |
| `couple2.jpg` … `couple5.jpg` | Gallery + story |
| `couple6.jpg` | Gallery (add when ready) |

To add more gallery photos, append paths in `src/data/config.ts` → `photos.gallery`.

## Theme

Light ivory + soft blush, with **light maroon accents** (never heavy maroon). Names use Great Vibes cursive with vine flourishes.

## RSVP (Supabase)

1. In the Supabase dashboard, open **SQL Editor** and run `supabase/schema.sql`.
2. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. Add both to `.env` (local) and to Vercel environment variables.
4. Restart `npm run dev`.

RSVPs are stored in the `rsvps` table. A guest who submits again on the same `/g/slug` link updates their reply. Public wishes are rows with `public_wish = true` and a message. Admin: `/admin`.

## Env / Admin

See `.env.example`.
