# ManageX ERP CRM SaaS UI/UX Transformation

## Phase 0 — Baseline hardening + Design Tokens (no behavior change)
- [ ] Confirm Tailwind/PostCSS availability (check config files)
- [ ] Create/extend CSS design tokens in `src/style/partials/core.css` (CSS variables for colors/spacing/typography)
- [ ] Add shared UI wrappers in `frontend/src/components/ui/` (visual only): CardShell, SectionHeader, EmptyState, ErrorState, SkeletonWrapper
- [ ] Ensure app.css imports new token/theme file (if needed)

## Phase 1 — Premium dashboard refresh (visual only)
- [ ] Unify dashboard card radius/shadows/spacing using wrappers
- [ ] Improve dashboard skeleton/loading appearance for summary + recent tables
- [ ] Add empty state UI for RecentTable widgets
- [x] Run `npm run build` for frontend


## Phase 2 — Enterprise data tables
- [ ] Upgrade `components/DataTable/DataTable.jsx` (sticky headers, filter UI polish, pagination polish)
- [ ] Upgrade `DashboardModule/components/RecentTable/*`
- [ ] Run `npm run build`

## Phase 3 — Forms UX upgrade
- [ ] Create shared form field grouping + helper text styles
- [ ] Add consistent validation message presentation via AntD overrides
- [ ] Run `npm run build`

## Phase 4 — Auth/login premiumization
- [ ] Premium login page states + error UI
- [ ] Run `npm run build`

## Phase 5 — Enterprise chrome polish
- [ ] Sidebar + header spacing, transitions, hover/selected states
- [ ] Add breadcrumb component
- [ ] Run `npm run build`

