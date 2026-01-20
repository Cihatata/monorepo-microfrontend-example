import { ReportsHome } from "./pages/ReportsHome";

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
    id: "reports-home",
    path: "/reports",
    component: ReportsHome,
    nav: {
      label: "Reports",
      order: 2,
    },
  },
];
