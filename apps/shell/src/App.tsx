import { Suspense, lazy, useEffect, useState } from "react";
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

// Lazy load remote components
const TrafficPage = lazy(() =>
  import("traffic/routes").then((m) => {
    const route = m.routes.find((r: { id: string }) => r.id === "traffic-home");
    return { default: route?.component ?? (() => <div>Failed to load</div>) };
  })
);

const ReportsPage = lazy(() =>
  import("reports/routes").then((m) => {
    const route = m.routes.find((r: { id: string }) => r.id === "reports-home");
    return { default: route?.component ?? (() => <div>Failed to load</div>) };
  })
);

const AdminPage = lazy(() =>
  import("admin/routes").then((m) => {
    const route = m.routes.find((r: { id: string }) => r.id === "admin-home");
    return { default: route?.component ?? (() => <div>Failed to load</div>) };
  })
);

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Home route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// Remote routes
const trafficRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/traffic",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TrafficPage />
    </Suspense>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReportsPage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminPage />
    </Suspense>
  ),
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  trafficRoute,
  reportsRoute,
  adminRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Type safety for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500">Loading page...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    // Prefetch account on app start
    import("platform/account").then(({ prefetchAccount }) => {
      prefetchAccount().finally(() => setIsReady(true));
    });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Starting application...</span>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AppWithProviders />
    </Suspense>
  );
}

function AppWithProviders() {
  const [AppProviders, setAppProviders] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    import("platform/AppProviders").then((m) => {
      setAppProviders(() => m.AppProviders);
    });
  }, []);

  if (!AppProviders) {
    return <PageLoader />;
  }

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
