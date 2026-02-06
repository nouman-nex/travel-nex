import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  const { User } = useAuth();
  const isAdmin = User?.roles?.[0] === "Admin";
  const isMiniAdmin = User?.roles?.[0] === "MiniAdmin";
  const allowedRoutes = User?.allowedRoutes || [];

  const adminMenus = [
    {
      label: "Dashboard",
      icon: "onboarding-1",
      path: "/adminDashboard",
    },
    {
      label: t("hub"),
      collapsible: true,
      icon: "invoices",
      children: [
        { path: "/add_Packages", label: t("Add") },
        { path: "/manage_package", label: t("Manage") },
      ],
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
      label: t("Mini Admin"),
      collapsible: true,
      icon: "widget",
      children: [
        { path: "/addMiniAdmin", label: t("Add ") },
        { path: "/manageMiniAdmin", label: t("Manage ") },
      ],
    },
    {
      label: t("Settings"),
      collapsible: true,
      icon: "settings",
      children: [
        { path: "/selfMintingcommission", label: t("Self Minting") },
        { path: "/autoMintingcommission", label: t("Auto Minting") },
        { path: "/levelbonus", label: t("Comunity Minting Bonus") },
        { path: "/directbonus", label: t("Direct Bonus") },
        { path: "/buildingbonus", label: t("Building Bonus") },
        { path: "/manageWithdrawFee", label: t("Withdraw Fee") },
        { path: "/manageRank", label: t("Manage Rank") },
        { path: "/switchingFee", label: t("Swapping Fee") },
        { path: "/mintingCap", label: t("Minting Cap") },
      ],
    },
    {
      label: t("Reports"),
      collapsible: true,
      icon: "chart",
      children: [
        { path: "/depositReport", label: t("Deposit") },
        { path: "/purchaseReport", label: t("Purchased Hub") },
        {
          path: "/automintingbonusreport",
          label: t("Auto Minting Bonus"),
        },
        {
          path: "/BinaryCommissionReport",
          label: t("Binary Commission"),
        },
        {
          path: "/CommunityAutoMintingBonusReport",
          label: t("Community Auto Minting Bonus"),
        },
        {
          path: "/CommunityBuildingBonusReport",
          label: t("Community Building Bonus"),
        },
        {
          path: "/CommunitySelfMintingBonusReport",
          label: t("Community Self Minting Bonus"),
        },
        {
          path: "/DirectCommissionReport",
          label: t("Direct Commission"),
        },
        {
          path: "/SelfMintingBonusReport",
          label: t("Self Minting Bonus"),
        },
        {
          path: "/adminReports",
          label: t("Rank History"),
        },
      ],
    },
    {
      label: "Manage Withdrawals",
      icon: "news",
      path: "/manageWithdraws",
    },
    {
      label: "Bulk Registration",
      icon: "news",
      path: "/bulkRegistration",
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
    { path: "/myPackages", label: t("My Hub"), icon: "onboarding-1" },
    { path: "/deposit", label: t("Deposit"), icon: "crypto" },
    {
      label: t("Minting"),
      icon: "metric",
      path: "/minting",
    },
    { path: "/packages", label: t("Available Hub"), icon: "pricing-plan" },
    {
      label: t("Withdrawal"),
      icon: "crypto",
      collapsible: true,
      children: [
        { path: "/withdraw", label: t("Request") },
        { path: "/pendingWithdraws", label: t("Summary") },
      ],
    },
    {
      label: t("Reports"),
      icon: "chart",
      collapsible: true,
      children: [
        { path: "/purchasingReports", label: t("Purchased Hub") },
        { path: "/DirectCommission", label: t("Direct Commission") },
        { path: "/DepositReports", label: t("Deposit") },
        { path: "/userReports", label: t("Rank History") },
        {
          path: "/ComunityBuildingBonus",
          label: t("Comunity Building Bonus"),
        },
        {
          path: "/community_self_minting_bonus",
          label: t("Community Self Minting"),
        },
        {
          path: "/community_auto_minting_bonus",
          label: t("Community Auto Minting Bonus"),
        },
      ],
    },
    {
      label: t("Tree View"),
      icon: "team",
      collapsible: true,
      children: [
        { path: "/binaryTree", label: t("Binary Tree") },
        { path: "/unilevelTree", label: t("Unilevel Tree") },
      ],
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

  if (isMiniAdmin) {
    const filteredAdminMenus = adminMenus
      .map((menu) => {
        if (menu.path && allowedRoutes.includes(menu.path)) {
          return menu;
        }
        if (menu.children) {
          const filteredChildren = menu.children.filter((child) =>
            allowedRoutes.includes(child.path)
          );
          if (filteredChildren.length > 0) {
            return { ...menu, children: filteredChildren };
          }
        }
        return null;
      })
      .filter(Boolean);
    return [...filteredAdminMenus, logoutMenuItem];
  }

  return [...userMenus, logoutMenuItem];
}
