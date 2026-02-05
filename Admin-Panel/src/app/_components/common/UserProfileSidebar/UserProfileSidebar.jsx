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
  const { t } = useTranslation()
  const { User } = useAuth();
  const [projects, setProjects] = useState([]);
  const getMembers = async () => {
    try {
      const response = await fetch(
        `https://mobicrypto-backend.threearrowstech.com/user/api/get-projects-employee/${User._id}`
      );
      const project = await response.json();
      setProjects(project);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (User && User._id) {
      getMembers();
    }
  }, [User]);

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

      {/* <Grid item xs={12} md={6} lg={12}>
        <Friends />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={12}>
        <Photos />
      </Grid> */}
    </Grid>
  );
};

export { UserProfileSidebar };
