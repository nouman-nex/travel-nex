import React, { useEffect } from "react";
import { Container } from "@mui/material";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { JumboCard } from "@jumbo/components";
import { LeavesList } from "@app/_components/common/LeavesList/LeavesList";

function AppliedLeaves() {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
      }}
      disableGutters
    >
      <LeavesList />
    </Container>
  );
}

export default AppliedLeaves;
