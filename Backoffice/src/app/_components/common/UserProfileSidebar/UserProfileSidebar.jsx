import Grid from "@mui/material/Grid";
import { Contacts } from "../Contact";
import { Friends } from "../Friends";
import { Photos } from "../Photos";
import { JumboCard } from "@jumbo/components";
import { ProfileSkills } from "../ProfileSkills";
import { profileSkillsData } from "../data";
import { useEffect, useState } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";

const UserProfileSidebar = () => {
  const { t } = useTranslation();
  const { User } = useAuth();

  return (
    <Grid container spacing={3.75}>
      <Grid item xs={12} md={6} lg={12}>
        <Contacts />
      </Grid>
      {User &&
        Array.isArray(User.roles) &&
        User.roles.length > 0 &&
        User.roles[0] === "Employee" && (
          <JumboCard
            title={"Projects"}
            contentWrapper
            sx={{ mt: 3, ml: 3, width: "100%" }}
            contentSx={{ pt: 0 }}
          >
            <ProfileSkills data={projects} />
          </JumboCard>
        )}
    </Grid>
  );
};

export { UserProfileSidebar };
