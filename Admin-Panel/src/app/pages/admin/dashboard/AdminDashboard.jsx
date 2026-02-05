import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Cities } from "@app/_components/common/Cities";
import {
  ObjectCountOrders,
  ObjectCountRevenue,
  ObjectCountVisits,
} from "@app/_components/common/ObjectCountCards";
import { Properties } from "@app/_components/common/Properties";
import { QueriesStatistics } from "@app/_components/common/QueriesStatistics";
import { Visits } from "@app/_components/common/Visits";
import { VisitsStatistics } from "@app/_components/common/VisitsStatistics";
import { NewConnections } from "@app/_components/widgets/NewConnections";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../backendServices/ApiCalls";

function AdminDashboard() {
  const { User } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  const fetchDashboardData = () => {
    setDataLoading(true);
    postRequest("/adminDashboardDataNew", {}, (response) => {
      if (response.status) {
        setData(response.data);
      } else {
        console.error(
          response.data.message || "Failed to fetch dashboard data"
        );
      }
      setDataLoading(false);
    });
  };

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");
      const isMiniAdmin = roles.includes("MiniAdmin");
      const allowedRoutes = Array.isArray(User.allowedRoutes)
        ? User.allowedRoutes
        : [];
      const currentPath = window.location.pathname;

      if (isAdmin) {
        setLoading(false);
        fetchDashboardData();
        return;
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setLoading(false);
          fetchDashboardData();
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary" }} />
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary", mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          {t("Loading dashboard data...")}
        </Typography>
      </div>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3.75}>
        {/* <Grid item xs={12} sm={6} lg={3.5}>
          <Properties title={t("Users Joined")} dashboarddata={data.totalUsers} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3.5}>
          <Cities title={t("Total Withdrawal Pending")} dashboarddata={data} />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} lg={3}>
          <VisitsStatistics title={t("Active Users")} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <QueriesStatistics title={t("Inactive Users")} />
        </Grid> */}
        {/* <Grid item xs={12} lg={5}>
          <Visits title={t("Users")} dashboarddata={data} />
        </Grid> */}
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountOrders
            vertical={true}
            subTitle={t("Total Users")}
            dashboarddata={data.totalUsers}
            type="profile"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountRevenue
            subTitle={t("Active Users")}
            dashboarddata={data.totalActiveUsers}
            type="profile"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountVisits
            subTitle={t("Inactive Users")}
            dashboarddata={data.totalInactiveUsers}
            type="profile"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountOrders
            vertical={true}
            subTitle={t("Today Total Deposit")}
            dashboarddata={data.todayTotalDepositAmount}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountRevenue
            subTitle={t("Total Approved Withdrawal")}
            dashboarddata={data.totalApprovedWithdrawalAmount}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ObjectCountVisits
            subTitle={t("Total Pending Withdrawal")}
            dashboarddata={data.totalPendingWithdrawalAmountAll}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <NewConnections
            title={"Today Deposits"}
            path={"/dashboard/updateCompetition"}
            scrollHeight={296}
            dataType="deposits"
            connections={data?.todayDeposits || []}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <NewConnections
            path={"/add_Packages"}
            title={"hub Sold Today"}
            scrollHeight={296}
            dataType="packages"
            connections={data?.todayPackages || []}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <NewConnections
            path={"/manageWithdraws"}
            title={"Pending Withdrawals"}
            scrollHeight={296}
            dataType="withdrawals"
            connections={data?.pendingWithdrawalDetails || []}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
