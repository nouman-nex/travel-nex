import { View } from "@app/_components/_core";
import { UserItem, users } from "@app/_components/common/Users";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommissionSettingsForm from "./Form";

export default function EmployeeManagement() {
  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (!isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-employees/${User.companyId}`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const handlereload = () => {
    fetchEmployees();
  };
  const { t } = useTranslation();
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
      }}
      disableGutters
    >
      <Typography variant={"h2"} mb={3}>
        {t("Settings")}
      </Typography>
      <CommissionSettingsForm />
    </Container>
  );
}
