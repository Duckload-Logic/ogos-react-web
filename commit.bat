git checkout -b fix/frontend-updates
git add src/components src/config src/routes
git commit -m "chore(ui): update shared components and navigation"
git add src/features/analytics src/pages/superadmin
git commit -m "feat(analytics): update superadmin analytics and dashboard"
git add src/features/appointments src/pages/admin/appointments src/pages/student/appointments
git commit -m "feat(appointments): update appointment modals and details"
git add src/features/iir src/pages/dev
git commit -m "feat(iir): update profile and developer pages"
git add src/features/notifications src/pages/shared/Notifications.tsx
git commit -m "feat(notifications): update notification modal and page"
git add src/features/slips src/pages/admin/slips src/pages/student/slips
git commit -m "feat(slips): update slip viewing and submission"
git add src/features/student-core src/pages/student/CORManagement.tsx src/pages/student/cor/CorUpload.tsx
git commit -m "feat(student-core): add COR management and update student profile"
git add src/pages/auth
git commit -m "feat(auth): update login and callback pages"
git add src/pages/shared/Profile.tsx
git commit -m "fix(profile): handle profile picture rendering on reload"
git add -A
git commit -m "chore(cleanup): catch remaining frontend changes"
git push -u origin fix/frontend-updates
