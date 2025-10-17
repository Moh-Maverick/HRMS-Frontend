FWC HRMS – Test Accounts (Local Only)

Important
- These credentials are for LOCAL TESTING ONLY. Do NOT deploy these to production or commit real secrets.
- You can create these users via the app at `/auth/signup` or directly in Firebase Authentication.

How to create test users quickly
1) Run the app: `npm run dev` → open `http://localhost:3000`.
2) Go to `/auth/signup` for each account below and create it with the specified role.
3) After signup, verify Firestore contains `users/{uid}` with `{ email, role }`.

Test accounts

- Admin
  - Email: admin@test.com
  - Password: Test@1234
  - Role: admin
  - Expected redirect: `/dashboard/admin`

- HR
  - Email: hr@test.com
  - Password: Test@1234
  - Role: hr
  - Expected redirect: `/dashboard/hr`

- Manager
  - Email: manager@test.com
  - Password: Test@1234
  - Role: manager
  - Expected redirect: `/dashboard/manager`

- Employee
  - Email: employee@test.com
  - Password: Test@1234
  - Role: employee
  - Expected redirect: `/dashboard/employee`

- Candidate
  - Email: candidate@test.com
  - Password: Test@1234
  - Role: candidate
  - Expected redirect: `/dashboard/candidate`

Smoke tests per role
- Admin: Visit `/dashboard/admin/departments` → create/edit/delete departments and use the filter.
- HR: Visit `/dashboard/hr` → view Jobs table (mock data).
- Manager: Visit `/dashboard/manager` → check attendance cards (mock data).
- Employee: Visit `/dashboard/employee` → view payroll cards (mock data).
- Candidate: Visit `/dashboard/candidate` → view interview/evaluation placeholders.

Troubleshooting
- If redirect doesn’t match role, ensure Firestore `users/{uid}` has the correct `role`.
- If login fails, confirm Firebase Auth → Sign-in method has Email/Password enabled.
- If role doesn’t persist on refresh, restart dev server after adding `.env.local`.


