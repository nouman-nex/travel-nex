import { EmailCampaignChart } from "@app/_components/charts";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PropTypes from "prop-types";

const NewVisitorsThisMonth = ({ subheader, salaryData }) => {
  return (
    <JumboCard
      title={`${Math.floor(Number(salaryData?.salaryEarned || 0)).toLocaleString()} PKR`}
      subheader={subheader}
      // action={<TrendingUpIcon fontSize={"small"} />}
      textColor="common.white"
      bgcolor={["#f9cc8a", "#f39711"]}
      reverse
      sx={{
        borderTop: "4px solid #F39711",
        ".MuiCardHeader-title": {
          color: "inherit",
          fontSize: "1.25rem",
        },
        ".MuiCardHeader-subheader": {
          color: "inherit",
        },
      }}
    >
      <Div sx={{ p: 3, pb: 0 }}>
        <EmailCampaignChart salaryData={salaryData} />
      </Div>
    </JumboCard>
  );
};

export { NewVisitorsThisMonth };

NewVisitorsThisMonth.propTypes = {
  subheader: PropTypes.node.isRequired,
};
