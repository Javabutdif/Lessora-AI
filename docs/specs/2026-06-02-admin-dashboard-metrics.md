# Admin Dashboard Metrics Specification

## Feature overview

The admin dashboard Landing page displays key platform metrics: count of active users and total lesson plans generated. These metrics provide quick visibility into platform health and usage.

## Current state

- Admin dashboard exists with landing page
- No metrics currently displayed
- User schema has `isActive` field for filtering
- Lesson plan data stored in database (location to be determined)

## Metrics to display

### 1. Active Users Count

**Definition**: Users where `isActive: true` and `isVerified: true`

**Data source**: User collection

**Query logic**:

```javascript
{
  $match: {
    isActive: true,
    isVerified: true
  }
}
```

**Characteristics**:

- Should update near real-time (within 1-2 minutes is acceptable)
- Show breakdown optional: teachers online now vs registered teachers
- Consider growth trend: compare to yesterday/last week (optional future enhancement)

### 2. Lesson Plans Generated

**Definition**: Count of all lesson plan documents created (status: any, including drafts)

**Data source**: LessonPlan collection (or equivalent)

**Query logic**:

```javascript
{
  $count: "totalLessonPlans";
}
```

**Characteristics**:

- Count all plans regardless of status (drafts, completed, etc.)
- Should update near real-time
- Optional breakdown by status later: drafted, finalized, exported

## API Endpoints (Server-side)

### 1. GET /api/admin/metrics/dashboard

Returns all dashboard metrics in one call

**Response**:

```typescript
{
  success: boolean;
  data: {
    activeUsers: number;
    totalLessonPlans: number;
    lastUpdated: Date;
    timestamp: Date;
  };
  error?: string;
}
```

### 2. GET /api/admin/metrics/landing

Returns public landing page metrics without requiring an admin session.

**Response**:

```typescript
{
  success: boolean;
  data: {
    activeUsers: number;
    totalLessonPlans: number;
    lastUpdated: Date;
  };
  error?: string;
}
```

**Logic**:

- Reuse the dashboard metrics cache/query service.
- Return only public aggregate counts, not user details or private usage records.

**Logic**:

- Query both collections in parallel for performance
- Cache results for 1-2 minutes to avoid heavy queries
- Return last cache update time so UI can show freshness

**Performance considerations**:

- Add database indexes on `isActive` and `isVerified` fields (likely already exist)
- Index on lesson plan creation date if filtering by date in future
- Consider aggregation pipeline for complex queries

### 2. GET /api/admin/metrics/active-users (Optional separate endpoint)

Returns active users detail

**Response**:

```typescript
{
  success: boolean;
  data: {
    activeUsers: number;
    verifiedUsers: number;
    totalUsers: number;
    growthThisWeek?: number;
  };
  error?: string;
}
```

### 3. GET /api/admin/metrics/lesson-plans (Optional separate endpoint)

Returns lesson plan statistics

**Response**:

```typescript
{
  success: boolean;
  data: {
    totalLessonPlans: number;
    statusBreakdown?: {
      draft: number;
      finalized: number;
      exported: number;
    };
    createdThisWeek?: number;
  };
  error?: string;
}
```

## Admin UI Components

### Landing Page Layout

Add metrics section at top of landing page:

```
┌─────────────────────────────────────────────┐
│           Dashboard Metrics                 │
├──────────────┬──────────────────────────────┤
│              │                              │
│  Active      │    Lesson Plans              │
│  Users       │    Generated                 │
│              │                              │
│    [ 47 ]    │       [ 132 ]                │
│              │                              │
└──────────────┴──────────────────────────────┘
Last updated: Just now
```

### Card Component

Create reusable metric card:

```typescript
interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
  lastUpdated?: Date;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
}

<MetricCard
  title="Active Users"
  value={47}
  loading={isLoading}
  error={error}
  lastUpdated={new Date()}
/>
```

### Data fetching

```typescript
// In Landing.tsx or Dashboard container
const {
  data: metrics,
  isLoading,
  error,
} = useQuery(["dashboardMetrics"], () => fetchDashboardMetrics(), {
  refetchInterval: 60000, // Refresh every 60 seconds
  staleTime: 30000, // Consider data fresh for 30 seconds
});
```

### Loading & error states

- Show skeleton loaders while fetching
- Handle API errors gracefully with user-friendly messages
- Show last known value + "updating..." state during refresh
- Hide metrics if error persists (show error message instead)

## Implementation approach

### Server-side

1. Create `server-side/src/controllers/admin.controller.ts`
   - Add `getDashboardMetrics()` method

2. Create `server-side/src/services/admin.service.ts`
   - Add `getActiveUserCount()` method
   - Add `getLessonPlanCount()` method
   - Implement caching layer (Redis or in-memory)

3. Add routes in `server-side/src/routes/admin.routes.ts`
   - GET endpoint `/api/admin/metrics/dashboard`

4. Add authorization
   - Verify request comes from authenticated admin user
   - Check admin role in middleware

### Client-side (admin)

1. Create `client-side-admin/src/components/MetricCard.tsx`
   - Reusable metric display component

2. Update `client-side-admin/src/pages/Landing.tsx` (or create)
   - Add metrics section with cards
   - Implement data fetching with React Query
   - Handle loading/error states

3. Create `client-side-admin/src/services/admin.service.ts`
   - Add `fetchDashboardMetrics()` method

4. Add React Query configuration
   - Set up query keys and caching
   - Configure refetch intervals

## Caching strategy

### Option 1: Backend cache (Redis or in-memory)

```typescript
// Service-level caching
private cache = new Map<string, { data: any; expiresAt: Date }>();

async getDashboardMetrics() {
  const cached = this.cache.get('dashboard_metrics');
  if (cached && cached.expiresAt > new Date()) {
    return cached.data;
  }

  const data = await Promise.all([
    this.getActiveUserCount(),
    this.getLessonPlanCount(),
  ]);

  this.cache.set('dashboard_metrics', {
    data,
    expiresAt: new Date(Date.now() + 60000), // 1 minute TTL
  });

  return data;
}
```

### Option 2: Frontend caching (React Query)

- Use built-in React Query cache
- Configure 30 second stale time, 1 minute cache time
- Refetch every 60 seconds

## Authorization & security

- Endpoint requires authentication
- Only admins can access metrics endpoints
- Consider rate limiting dashboard metric calls (prevent metric endpoint DoS)

## Performance considerations

- Ensure indexes exist on filtering fields
- Use aggregation pipeline for large collections
- Monitor query performance as user base grows
- Consider pagination/limiting lesson plan count query if collection grows very large

## Testing requirements

- Unit test metric calculation logic
- Integration test API endpoints
- Test cache expiration and refresh
- Test error handling in both server and client
- Load test if metrics queries become slow at scale

## Future enhancements

- Metrics trends: compare to previous day/week
- Breakdown by lesson plan status
- User growth chart
- Lesson plan creation timeline
- User engagement metrics
- Admin can filter metrics by date range
- Export metrics report
