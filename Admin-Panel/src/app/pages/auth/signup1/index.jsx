import { SignupForm } from "@app/_components/auth/signup";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  Fab,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Navigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

export default function Signup1() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === true) {
    return <Navigate to="/" />;
  }
  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: (theme) => theme.spacing(4),
        transform: "scale(0.85)", // 👈 Zoom out
        transformOrigin: "top center", // Optional: Set the anchor point for scaling
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex", width: "40%" }}>
        <Link to="/" underline="none" sx={{ display: "inline-flex" }}>
          <img
            src={`${ASSET_IMAGES}/logo.png`}
            alt="Jumbo React"
            className="w-[30%] mx-auto"
          />
        </Link>
      </Div>
      <Card sx={{ width: 480, mb: 4 }}>
        <Div sx={{ position: "relative", height: "240px" }}>
          <video autoPlay muted loop playsInline>
            <source
              src={`${ASSET_IMAGES}/colin-watts.mp4`}
              type="video/mp4"
            ></source>
          </video>
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{ color: "common.white", fontSize: "1.5rem", mb: 0 }}
            >
              Sign up
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <SignupForm />
          <Typography textAlign={"center"} variant={"body1"} mb={1}>
            Have an account?{" "}
            <Link underline="none" to={"/auth/login"}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
}
