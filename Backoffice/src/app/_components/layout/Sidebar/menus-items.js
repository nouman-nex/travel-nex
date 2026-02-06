import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  const { User } = useAuth();
  const isAdmin = User?.role?.[0] === "admin";

  const adminMenus = [
    {
      label: "Dashboard",
      icon: "onboarding-1",
      path: "/adminDashboard",
    },
    {
      label: t("Users"),
      collapsible: true,
      icon: "profile-4",
      children: [
        { path: "/activeUsers", label: t("Active ") },
        { path: "/inactiveUsers", label: t("Inactive ") },
      ],
    },
    {
      label: t("Settings"),
      collapsible: true,
      icon: "settings",
      children: [{ path: "/manageBankAccount", label: t("Bank Accounts") }],
    },
    {
      label: "Profile",
      icon: "profile-3",
      path: "/profile",
    },
    {
      label: "Logout",
      icon: "login",
      path: "/logout",
    },
  ];

  const userMenus = [
    { path: "/", label: t("Dashboard"), icon: "onboarding-1" },
    {
      label: t("Reports"),
      icon: "chart",
      collapsible: true,
      children: [{ path: "/purchasingReports", label: t("Purchased Hub") }],
    },
    {
      label: t("Profile"),
      icon: "profile-3",
      path: "/profile",
    },
    {
      label: t("Logout"),
      icon: "login",
      path: "/logout",
    },
  ];

  const logoutMenuItem = {};

  if (isAdmin) {
    return [...adminMenus, logoutMenuItem];
  }

  return [...userMenus, logoutMenuItem];
}
