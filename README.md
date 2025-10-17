FWC HRMS – Next.js 15 + TailwindCSS + Firebase

Stack
- Next.js App Router
- TailwindCSS (FWC theme)
- Firebase Auth + Firestore (roles)
- Axios placeholder API layer

Getting Started
1. Install deps: `npm install`
2. Configure `.env.local` with Firebase keys (NEXT_PUBLIC_FIREBASE_*)
3. Dev server: `npm run dev`

Project Structure
- `src/app/` – Pages and route groups (auth, dashboard/*, ai-services)
- `src/components/` – Reusable UI: Navbar, Sidebar, Card, Table, Modal, Loader (`ui.tsx`)
- `src/lib/` – `firebase.ts`, `auth.ts` (context + role), `api.ts` (placeholders)
- `public/` – Static assets
- `tailwind.config.ts` – FWC colors and animations

Notes
- Roles: admin, hr, manager, employee, candidate stored in Firestore `users/{uid}`
- After login/signup, users are redirected to `/dashboard/{role}`
- Department management at `dashboard/admin/departments` with mock CRUD
