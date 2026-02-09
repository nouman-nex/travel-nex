import { createBrowserRouter } from "react-router-dom";

import Login1 from "@app/pages/auth/login1";
import Signup1 from "@app/pages/auth/signup1";
import ForgotPassword from "@app/pages/auth/forgotPassword";
import ForgotPasswordChange from "@app/pages/auth/forgotPasswordChange";

import dashboard from "@app/pages/dashboard/dashboard";
import AdminDashboard from "@app/pages/admin/dashboard/AdminDashboard";
import Profile from "@app/pages/dashboards/profile";
import Logout from "@app/pages/dashboards/logout";

import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import withAuth from "@app/_hoc/withAuth";
import { Page, NotFound404 } from "@app/_components/_core";
import ManageBankAccounts from "@app/pages/admin/settings/ManageBankAccounts";
import PartnerShip from "@app/pages/admin/Partnership/PartnerShip";
import ActiveUser from "@app/pages/admin/users/ActiveUser";

const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        path: "",
        element: <Page Component={dashboard} hoc={withAuth} />,
      },
      // Admin routes
      {
        path: "partnershipRequests",
        element: <Page Component={PartnerShip} hoc={withAuth} />,
      },
      {
        path: "manageBankAccount",
        element: <Page Component={ManageBankAccounts} hoc={withAuth} />,
      },
      {
        path: "activeUsers",
        element: <Page Component={ActiveUser} hoc={withAuth} />,
      },
      {
        path: "adminDashboard",
        element: <Page Component={AdminDashboard} hoc={withAuth} />,
      },
      {
        path: "profile",
        element: <Page Component={Profile} hoc={withAuth} />,
      },
      {
        path: "logout",
        element: <Page Component={Logout} hoc={withAuth} />,
      },
    ],
  },
  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login",
        element: <Login1 />,
      },
      {
        path: "signup-1",
        element: <Signup1 />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "forgot-password-change",
        element: <ForgotPasswordChange />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
];

export const router = createBrowserRouter(routes);
