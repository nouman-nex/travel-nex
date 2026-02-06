import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Stack,
  Typography,
  Box,
  styled,
} from "@mui/material";
import EmployeeManagementModal from "@app/_components/common/EmployeeManagementModal/EmployeeManagementModal";

const Item = styled("span")(({ theme }) => ({
  padding: theme.spacing(0, 1),
}));

const UserItem = ({ item ,handlereload}) => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    handlereload();
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ mb: 1 }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{ p: (theme) => theme.spacing(2, 1) }}
        >
          <Item sx={{ flex: { xs: 1, md: "0 1 45%", lg: "0 1 35%" } }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Item>
                <Badge
                  overlap="circular"
                  variant="dot"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  sx={{
                    ".MuiBadge-badge": {
                      border: "2px solid #FFF",
                      height: "14px",
                      width: "14px",
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    },
                  }}
                >
                  <Avatar
                    sx={{ width: 56, height: 56 }}
                    alt={`${item.firstName} ${item.lastName}`}
                    src={item.profileImg}
                  />
                </Badge>
              </Item>
              <Item>
                <Typography variant={"h6"} mb={0.5}>
                  {`${item.firstname} ${item.lastname}`}
                </Typography>
                <Typography variant={"body1"} color="text.secondary">
                  {item.email}
                </Typography>
              </Item>
            </Stack>
          </Item>

          {item?.roles?.length > 1 && (
            <>
            <Item
              sx={{
                alignSelf: "flex-start",
                flexBasis: { md: "28%", lg: "18%" },
                display: { xs: "none", md: "block" },
              }}
            >
              <Typography variant={"h6"} mt={1} lineHeight={1.25}>
                {item.roles[1]}
              </Typography>
            </Item>
            <Stack
            spacing={2}
            direction={"row"}
            alignItems={"center"}
            sx={{ textAlign: "center" }}
          >
            <Item>
              <Typography variant={"h6"} mb={0.5}>
                {item?.salaryType === "fixed" ? "Monthly" : "Hourly"}
              </Typography>
              <Typography variant={"body1"} color="text.secondary">
                Salary Type
              </Typography>
            </Item>
            <Item>
              <Typography variant={"h6"} mb={0.5}>
                {item?.salaryType === "fixed"
                  ? item?.fixedSalary
                  : item?.hourlyRate}
              </Typography>
              <Typography variant={"body1"} color="text.secondary">
                Salary
              </Typography>
            </Item>
            {/* <Item>
            <Typography variant={"h6"} mb={0.5}>
              asda
            </Typography>
            <Typography variant={"body1"} color="text.secondary">
              Followers
            </Typography>
          </Item> */}
          </Stack>
          </>
          )}
          
          <Item sx={{ ml: "auto", display: { xs: "none", sm: "block" } }}>
            <Button
              sx={{ minWidth: 92 }}
              disableElevation
              variant={"contained"}
              size={"small"}
              color={"primary"}
              onClick={handleOpenModal}
            >
              Manage
            </Button>
          </Item>
        </Stack>
      </Card>

      <EmployeeManagementModal
        open={open}
        handleClose={handleCloseModal}
        item={item}
      />
    </>
  );
};

export { UserItem };
