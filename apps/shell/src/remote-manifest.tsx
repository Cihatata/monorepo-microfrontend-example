import { lazy } from "react";

// Remote route config type (from remote modules)
interface RemoteRouteConfig {
  id: string;
  path: string;
  component: React.ComponentType;
  nav: {
    label: string;
    order?: number;
  };
}

export interface RouteConfig {
  id: string;
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  nav: {
    label: string;
    order?: number;
  };
}

export interface RemoteManifest {
  name: string;
  routes: RouteConfig[];
}

// Helper to create lazy route from remote
const createLazyRoute = (
  remoteImport: Promise<{ routes: RemoteRouteConfig[] }>,
  routeId: string,
  path: string,
  nav: { label: string; order?: number }
): RouteConfig => ({
  id: routeId,
  path,
  component: lazy(() =>
    remoteImport.then((m) => {
      const route = m.routes.find((r) => r.id === routeId);
      if (route?.component) {
        const Component = route.component;
        return { default: () => <Component /> };
      }
      return { default: () => <div>Not Found</div> };
    })
  ),
  nav,
});

// Traffic remote routes
const trafficRoutes: RouteConfig[] = [
  createLazyRoute(
    import("traffic/routes"),
    "traffic-home",
    "/traffic",
    { label: "Traffic", order: 1 }
  ),
];

// Reports remote routes
const reportsRoutes: RouteConfig[] = [
  createLazyRoute(
    import("reports/routes"),
    "reports-home",
    "/reports",
    { label: "Reports", order: 2 }
  ),
];

// Admin remote routes
const adminRoutes: RouteConfig[] = [
  createLazyRoute(
    import("admin/routes"),
    "admin-home",
    "/admin",
    { label: "Admin", order: 3 }
  ),
];

export const remoteManifests: RemoteManifest[] = [
  { name: "traffic", routes: trafficRoutes },
  { name: "reports", routes: reportsRoutes },
  { name: "admin", routes: adminRoutes },
];

export const getAllRoutes = (): RouteConfig[] => {
  return remoteManifests.flatMap((m) => m.routes);
};

export const getNavItems = () => {
  return getAllRoutes()
    .filter((r) => r.nav)
    .sort((a, b) => (a.nav.order ?? 99) - (b.nav.order ?? 99))
    .map((r) => ({
      path: r.path,
      label: r.nav.label,
    }));
};

