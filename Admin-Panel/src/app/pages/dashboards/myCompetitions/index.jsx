import { Grid } from "@mui/material";
import React from "react";
import MyCompetitions from "../../dashboard/components/MyCompetitions";
function Competitions() {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12}>
        <MyCompetitions />
      </Grid>
    </Grid>
  );
}

export default Competitions;
