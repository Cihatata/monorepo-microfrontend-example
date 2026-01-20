declare module "platform/AppProviders" {
  import { ComponentType, ReactNode } from "react";
  export const AppProviders: ComponentType<{ children: ReactNode }>;
}

declare module "platform/queryClient" {
  import { QueryClient } from "@tanstack/react-query";
  export function getQueryClient(): QueryClient;
}

declare module "platform/account" {
  export interface Account {
    id: string;
    name: string;
    email: string;
  }

  export function useAccount(): {
    data: Account | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  export function prefetchAccount(): Promise<void>;
}

declare module "traffic/routes" {
  import { ComponentType, LazyExoticComponent } from "react";
  export interface RouteConfig {
    id: string;
    path: string;
    component: ComponentType;
    nav: {
      label: string;
      order?: number;
    };
  }
  export const routes: RouteConfig[];
}

declare module "reports/routes" {
  import { ComponentType, LazyExoticComponent } from "react";
  export interface RouteConfig {
    id: string;
    path: string;
    component: ComponentType;
    nav: {
      label: string;
      order?: number;
    };
  }
  export const routes: RouteConfig[];
}

declare module "admin/routes" {
  import { ComponentType, LazyExoticComponent } from "react";
  export interface RouteConfig {
    id: string;
    path: string;
    component: ComponentType;
    nav: {
      label: string;
      order?: number;
    };
  }
  export const routes: RouteConfig[];
}

