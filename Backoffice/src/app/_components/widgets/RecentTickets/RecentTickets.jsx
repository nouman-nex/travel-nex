import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { RecentTicketsList } from "./components";
import PropTypes from "prop-types";

const RecentTickets = ({ title, mints }) => {
  return (
    <JumboCard title={title} contentWrapper contentSx={{ p: 0 }}>
      <JumboScrollbar autoHeight autoHeightMin={130}>
        <RecentTicketsList mints={mints} />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { RecentTickets };
RecentTickets.propTyeps = {
  title: PropTypes.node.isRequired,
};
