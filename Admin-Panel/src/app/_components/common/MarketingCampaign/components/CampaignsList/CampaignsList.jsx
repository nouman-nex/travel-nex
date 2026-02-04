import { List } from "@mui/material";
import { CampaignItem } from "../CampaignItem";

const CampaignsList = ({ employeesdata }) => {
  return (
    <List disablePadding>
      {employeesdata?.data?.map((item) => (
        <CampaignItem item={item} key={item.id || item._id} />
      ))}
    </List>

  );
};

export { CampaignsList };
