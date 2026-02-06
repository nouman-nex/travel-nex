import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import ForgotPasswordChangePassword from "@app/_components/auth/forgotPasswordChangePassword";
import { ASSET_AVATARS, ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ForgotPasswordChange() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const linkToken = params.get("linkToken");

  const { isAuthenticated, loading } = useAuth();
  if (isAuthenticated === true) {
    return <Navigate to="/" />;
  }

  const { t } = useTranslation();
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
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex", width: "35%" }}>
        <img src={`${ASSET_IMAGES}/logo.png`} alt="Jumbo React"  className="w-[30%] mx-auto"/>
      </Div>
      <Card sx={{ maxWidth: "100%", width: 360, mb: 4 }}>
        <Div sx={{ position: "relative", height: "200px" }}>
        <video autoPlay muted loop playsInline>
          <source src="https://media.rolex.com/video/upload/c_limit,q_auto:best,w_2880/vc_vp9/v1/rolexcom/collection/family-pages/classic-watches/1908/landing/videos/cover/long-film/video-cover_2023-retailer-film-perpetual-1908-film-30-version-b-16x9-texted-clock-py-ly.webm" type="video/mp4">
          </source>
        </video>
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                color: "common.white",
                fontSize: "1.5rem",
                mb: 0,
              }}
            >
              {t("Forgot Password")}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>

          <ForgotPasswordChangePassword linkToken={linkToken} />
        </CardContent>
      </Card>
    </Div>
  );
}
