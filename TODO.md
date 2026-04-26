

## Approved Plan Summary

- Build React components/pages: Homepage, Auth (login/signup), Dashboard, Ideas list/detail, Comments, Profile.
- Phase 1: UI components + Layout + Core pages (Home, Login/Register, Dashboard stub) + Routing.
- Phase 2: Ideas pages + Comments.
- Phase 3: Profile + Polish/Integrate APIs.

## Steps

- [ ] Step 1: Create UI components (Button, Input), Layout (Header), Auth store (useAuth.js).
- [ ] Step 2: Create pages (Home.jsx, Login.jsx, Register.jsx).
- [ ] Step 3: Update App.jsx with React Router and routes.
- [ ] Step 4: Create Dashboard stub page.
- [ ] Step 5: Test frontend (`cd frontend/idealab && npm run dev`).
- [ ] Step 6: Phase 2 - Ideas list/detail pages with API hooks.
- [ ] Step 7: Phase 3 - Profile page.

- [x] Step 1: Create UI components (Button, Input), Layout (Header), Auth store (useAuth.js).
- [x] Step 2: Create pages (Home.jsx, Login.jsx, Register.jsx).
- [x] Step 3: Update App.jsx with React Router and routes.
- [x] Step 4: Create Dashboard stub page.
- [ ] Step 5: Test frontend (`cd frontend/idealab && npm run dev`).
- [ ] Step 6: Phase 2 - Ideas list/detail pages with API hooks.
- [ ] Step 7: Phase 3 - Profile page.

Phase 1 complete ✓

**Phase 2: Backend Connection** ✓

- [x] Update useAuth.js: Real login/register with JWT/localStorage
- [x] main.jsx: QueryClientProvider
- [x] useIdeas.js: Hooks for ideas (list, user ideas, detail)
- [x] Dashboard.jsx: Real data fetch, loading states

Run backend `cd backend && python manage.py runserver`, frontend `npm run dev`. Register/login to test dashboard with your ideas.

**Next Phase 3:** Ideas list/detail, comments, profile.
