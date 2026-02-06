import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Icon } from "@jumbo/components/Icon";
import { alpha } from "@mui/material/styles";

const SidebarNavigation = ({ navItems, currentTab, onNavigate }) => {
  return (
    <List
      disablePadding
      sx={{
        pb: 2,
      }}
    >
      {navItems.map((navItem, i) => (
        <ListItemButton
          key={i}
          component="li"
          sx={{
            p: 0,
            mb: 0.25,
            ".MuiNavDiv-root": {
              borderLeft: 3,
              borderColor: "transparent",
              borderRadius: 2,
              p: (theme) => theme.spacing(1.25, 1.5),
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.15),
                borderColor: (theme) => theme.palette.primary.main,
              },
              ...(navItem?.path === currentTab
                ? {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.15),
                    borderColor: (theme) => theme.palette.primary.main,
                  }
                : {}),
            },
            ".MuiListItemIcon-root": {
              minWidth: 32,
            },
            "&:hover": {
              background: "transparent",
            },
          }}
          disableRipple
        >
          <div
            className="MuiNavDiv-root"
            onClick={() => onNavigate(navItem)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              position: "relative",
              color: "inherit",
              textDecoration: "none",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            {navItem?.icon && (
              <ListItemIcon
                sx={{
                  color: "inherit",
                }}
              >
                <Icon name={navItem?.icon} style={{ fontSize: 20 }} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={navItem?.label}
              sx={{
                m: 0,
                "& .MuiTypography-root": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </div>
        </ListItemButton>
      ))}
    </List>
  );
};

export default SidebarNavigation;
