# Admin Dashboard Metrics Implementation Plan

**Goal:** Display active user count and total lesson plans generated on admin dashboard landing page with real-time updates.

**Architecture:** New admin API endpoints for metrics aggregation, backend caching layer to avoid expensive queries on every request, React Query for client-side caching and refetch, reusable metric card component.

**Tech Stack:** Express, TypeScript, MongoDB aggregation pipeline, React Query, React components, Tailwind CSS.

---

## References

- spec: [2026-06-02-admin-dashboard-metrics.md](../specs/2026-06-02-admin-dashboard-metrics.md)
- task brief: [2026-06-02-user-auth-credits-admin-features.md](../ai/tasks/2026-06-02-user-auth-credits-admin-features.md)

## Steps

### Phase 1: Server-side endpoints (Days 1-2)

- [x] Verify User schema has `isActive` and `isVerified` fields indexed
- [x] Identify lesson plan collection/model name and location
- [x] Verify lesson plan collection has proper indexes on status/date fields
- [x] Create `server-side/src/services/admin.service.ts` with:
  - `getActiveUserCount()` - query active & verified users
  - `getLessonPlanCount()` - query all lesson plans
  - `getDashboardMetrics()` - aggregate both counts
  - Implement 60-second TTL cache for metrics
- [x] Create `server-side/src/controllers/admin.controller.ts` with:
  - `getDashboardMetrics()` controller method
  - Admin authorization middleware
  - Response formatting with timestamp
- [x] Add routes to `server-side/src/routes/admin.routes.ts`:
  - `GET /api/admin/metrics/dashboard`
  - `GET /api/admin/metrics/landing`
- [ ] `GET /api/admin/metrics/active-users` (optional)
- [ ] `GET /api/admin/metrics/lesson-plans` (optional)
- [ ] Add request/response validation with Zod schemas
- [x] Add error handling for database query failures
- [ ] Test endpoints manually with cURL/Postman

### Phase 2: Client-side admin components (Days 2-3)

- [x] Create `client-side-admin/src/components/MetricCard.tsx`:
  - Display metric title, value, and last updated time
  - Loading skeleton state
  - Error state
  - Optional trend indicator
  - Tailwind styling to match existing design
- [x] Update `client-side-admin/src/services/api.ts`:
  - `fetchDashboardMetrics()` function
  - Error handling
  - TypeScript types for response
- [x] Update `client-side-admin/src/pages/AdminDashboard.tsx`:
  - Add metrics section at top
  - Use React Query for data fetching
  - Display two metric cards: active users and lesson plans
  - Show loading and error states
  - Show last updated timestamp
- [x] Update `client-side-admin/src/pages/LandingPage.tsx`:
  - Add public metrics strip below CTA buttons
  - Show active educators and lesson plans created
  - Use public metrics endpoint so visitors are not redirected to admin login

### Phase 3: React Query setup (Days 3-4)

- [x] Configure React Query in admin client:
  - Set refetch interval to 60 seconds
  - Set stale time to 30 seconds
  - Set cache time to 5 minutes
  - Handle error retries (3 attempts)
- [ ] Implement error boundary for metrics section
- [x] Add loading skeleton while fetching

### Phase 4: UI integration & styling (Days 4-5)

- [x] Design metric card layout (width, spacing, typography)
- [x] Add compact labels for each metric
- [x] Ensure responsive design works on mobile/tablet admin access
- [x] Add visual feedback for data refresh (subtle "updating" indicator)
- [x] Match existing AdminDashboard design tokens
- [x] Ensure accessibility with semantic articles and loading state

### Phase 5: Testing (Days 5-7)

- [ ] Unit tests:
  - Test metric service functions (active user count calculation)
  - Test admin.service metric calculation
  - Test MetricCard component rendering
- [ ] Integration tests:
  - Test API endpoints return correct format
  - Test auth middleware blocks non-admins
  - Test caching behavior
- [ ] End-to-end testing:
  - Create test admin user
  - Create test user accounts (some active, some inactive)
  - Create test lesson plans
  - Verify metrics display correct counts
  - Verify auto-refetch works (wait 60+ seconds, see update)
  - Verify error state displays if server is down
- [ ] Performance testing:
  - Measure query execution time with large user base
  - Verify cache prevents excessive database queries
  - Test response time with 1000+ users

### Phase 6: Optimization & monitoring (Days 7-8)

- [ ] Review MongoDB query performance with explain()
- [ ] Verify indexes exist on `isActive`, `isVerified` fields
- [ ] Monitor average query execution time
- [ ] Add logging for metrics API calls (optional)
- [ ] Add TypeScript validation: `npx tsc --noEmit`
- [ ] Optimize component re-renders (check React.memo if needed)
- [ ] Review bundle size impact of MetricCard component

### Phase 7: Documentation & cleanup (Days 8-9)

- [ ] Update admin client README with new metrics feature
- [ ] Document API endpoint contract
- [ ] Add JSDoc comments to service functions
- [ ] Add comments explaining React Query caching strategy
- [ ] Remove any console.log debugging statements
- [ ] Verify all TypeScript errors cleared

### Phase 8: Deployment (Days 9-10)

- [ ] Deploy server-side changes to staging
- [ ] Deploy admin client to staging
- [ ] Test end-to-end in staging environment
- [ ] Deploy to production
- [ ] Monitor for any API errors or performance issues
- [ ] Verify metrics display correctly in production

## Validation

- [x] `npx tsc --noEmit` passes in both server-side and client-side-admin
- [x] API endpoint returns valid response format by TypeScript contract
- [x] MetricCard renders without TypeScript errors
- [ ] Metrics update after 60-second refetch interval
- [ ] Cache prevents excessive database queries (check logs)
- [ ] Auth middleware blocks unauthorized requests
- [ ] Error state displays if API fails
- [ ] Styling matches existing dashboard design

## Risks

- risk 1: Metrics queries could be slow with very large collections (mitigation: use aggregation pipeline efficiently, test with production data)
- risk 2: Cache could display stale metrics if refresh fails silently (mitigation: add error logging, show "last updated" timestamp)
- risk 3: Admin could refresh metrics too frequently and cause load (mitigation: server-side cache prevents this, set minimum refetch interval)
- dependency 1: Need to locate correct lesson plan collection - identify if named "LessonPlan", "LessonPlans", etc.
- dependency 2: Verify admin auth middleware exists or create it

## Handoff notes

- Metrics should refresh every 60 seconds automatically once page loads
- Consider adding more metrics in future: lesson plans by status, user growth chart, recent activity
- Admin dashboard might benefit from more analytics - consider this as Phase 1 of larger analytics dashboard
- Performance will be important as user base grows - monitor query times regularly
- Consider adding admin setting to control refresh interval if needed for performance tuning
