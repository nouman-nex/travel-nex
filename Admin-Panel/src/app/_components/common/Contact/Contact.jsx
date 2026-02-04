import {
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { JumboCard } from "@jumbo/components";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ProfileSkills } from "../ProfileSkills";
import { projects } from "../CurrentProjectsList/data";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { User } = useAuth();
  const { t } = useTranslation()

  return (
    <JumboCard title={t("contact")}>
      <List disablePadding sx={{ mb: 2 }}>
        <ListItem
          alignItems="flex-start"
          sx={{ p: (theme) => theme.spacing(0.5, 3) }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            <EmailOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1" color="text.secondary">
                {t("form.email")}
              </Typography>
            }
            secondary={
              <Link variant="body1" href="#" underline="none">
                {User?.email}
              </Link>
            }
          />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          sx={{ p: (theme) => theme.spacing(0.5, 3) }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            <InsertLinkOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1" color="text.secondary">
                {t("form.username")}
              </Typography>
            }
            secondary={
              <Link variant="body1" href="#" underline="none">
                {User && Array.isArray(User.roles) && User.roles.length > 0 && (
                  <Typography variant="body1" color="text.primary">
                    {User.username}
                  </Typography>
                )}
              </Link>
            }
          />
        </ListItem>
      </List>
    </JumboCard>
  );
};

export { Contacts };
