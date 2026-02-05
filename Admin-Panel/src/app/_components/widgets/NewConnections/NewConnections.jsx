import React from "react";
import { Button } from "@mui/material";
import { JumboCard, JumboScrollbar } from "@jumbo/components";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ConnectionsList } from "./ConnectionList";
import { PackagesList } from "./PackagesList"; // Import your new component
import { TodayDepositsList } from "./TodayDepositsList";
import { useTranslation } from "react-i18next";

function NewConnections({
  title,
  scrollHeight,
  path,
  connections = [],
  dataType,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderListComponent = () => {
    if (dataType === "packages" || title === "Package Sold Today") {
      return <PackagesList data={connections} />;
    } else if (dataType === "withdrawals" || title === "Pending Withdrawals") {
      return <ConnectionsList data={connections} />;
    } else if (dataType === "deposits" || title === "Today Deposits") {
      return <TodayDepositsList data={connections} />;
    } else {
      return <ConnectionsList data={connections} />;
    }
  };

  return (
    <JumboCard
      title={title}
      // subheader={`${connections.length} ${title.toLowerCase()}`}
      action={
        <Button
          onClick={() => {
            navigate(path);
          }}
          variant={"contained"}
          size={"small"}
          className="bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637]"
        >
          {t("dashboard.seeAll")}
        </Button>
      }
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 278}
      >
        {renderListComponent()}
      </JumboScrollbar>
    </JumboCard>
  );
}

NewConnections.propTypes = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
  path: PropTypes.string.isRequired,
  connections: PropTypes.array,
  dataType: PropTypes.string,
};

export { NewConnections };
