import { AdminHome } from "./pages/AdminHome";

export interface RouteConfig {
  id: string;
  path: string;
  component: React.ComponentType;
  nav: {
    label: string;
    order?: number;
  };
}

export const routes: RouteConfig[] = [
  {
    id: "admin-home",
    path: "/admin",
    component: AdminHome,
    nav: {
      label: "Admin",
      order: 3,
    },
  },
];
