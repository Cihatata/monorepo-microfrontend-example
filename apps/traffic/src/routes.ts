import { TrafficHome } from "./pages/TrafficHome";

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
    id: "traffic-home",
    path: "/traffic",
    component: TrafficHome,
    nav: {
      label: "Traffic",
      order: 1,
    },
  },
];
