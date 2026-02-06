import { ButtonStack, Progressbar } from "@app/_components/_core";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import React from "react";
import { BalanceSummary } from "./components";
import PropTypes from "prop-types";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PortfolioBalance = ({ title }) => {
  const { User } = useAuth();
  const { t } = useTranslation();
  const unlocked = Number(User?.commissionWithdrawable) || 0;
  const locked = Number(User?.commissionLocked) || 0;
  const total = unlocked + locked;

  const unlockedPercent = total > 0 ? (unlocked / total) * 100 : 0;
  const lockedPercent = total > 0 ? (locked / total) * 100 : 0;

  return (
    <Card sx={{ height: "90%" }}>
      <CardHeader title={title} />
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BalanceSummary
              amount={"$" + (User?.currentBalance || 0)?.toFixed(2)}
              // trend={{ percentage: 13, direction: "up" }}
              label={t("dashboard.wallet.commissionWallet")}
            />
            <ButtonStack>
              <Link to="/withdraw">
                <Button variant="contained" color="inherit" disableElevation>
                  {t("withdrawPage.form.withdrawNowButton")}
                </Button>
              </Link>
            </ButtonStack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" color="text.secondary" mb={2}>
              {t("dashboard.wallet.portfolioDistribution")}
            </Typography>
            <Progressbar
              variant="determinate"
              color="success"
              label={t("dashboard.wallet.hubCapacity")}
              subLabel={`$${User.walletBalance?.toFixed(2)}`}
              value={unlockedPercent}
              sx={{ mb: 2 }}
            />
            <Progressbar
              label={t("dashboard.stats.deposit")}
              subLabel={`$${User.cryptoWallet?.toFixed(2)}`}
              variant="determinate"
              color="warning"
              value={lockedPercent}
              sx={{ mb: 0 }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ pt: 0.5, pb: 2 }}>
        {/* <Button startIcon={<AddIcon />} size="small">
          Add More
        </Button> */}
      </CardActions>
    </Card>
  );
};

export { PortfolioBalance };

PortfolioBalance.propTypes = {
  title: PropTypes.node.isRequired,
};
