import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { AboutPage } from "@/features/about/pages/about-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { TeamPage } from "@/features/team/pages/team-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/app/dashboard" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "team",
        element: <TeamPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);
