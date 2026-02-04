import { JumboCard } from "@jumbo/components";
import { Grid, ListItemText, Typography } from "@mui/material";
import { RevenueChart } from "./components";
import PropTypes from "prop-types";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const RevenueHistory = ({
  title,
  referrals,
  history,
  totalUsers,
  monthlyUsers,
}) => {
  const { User } = useAuth();
  return (
    <JumboCard
      title={title}
      contentWrapper
      sx={{ height: 150 }}
      contentSx={{ px: 3, pt: 1 }}
    >
      <Grid container spacing={3.75}>
        <Grid item xs={6}>
          <ListItemText
            primary={
              <Typography variant={"h3"} mb={0.5}>
                {User.type === "admin" ? totalUsers : referrals}
              </Typography>
            }
            secondary={`${User.type === "admin" ? "Total Users" : "Total Referrals"}`}
          />
        </Grid>
        <Grid item xs={6}>
          <RevenueChart history={history} monthlyUsers={monthlyUsers} />
        </Grid>
      </Grid>
    </JumboCard>
  );
};
export { RevenueHistory };

RevenueHistory.propTyeps = {
  title: PropTypes.node.isRequired,
};
