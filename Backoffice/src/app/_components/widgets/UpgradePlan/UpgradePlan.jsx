import { useState } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import useNotify from "@app/_components/Notification/useNotify";
import {
  Alert,
  AlertTitle,
  Stack,
  Typography,
  Button,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "qrcode";
import ReactQRCode from "react-qr-code";
const UpgradePlan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { User } = useAuth();
  const notify = useNotify();

  const copyReferralLink = (link) => {
    navigator.clipboard.writeText(link);
    notify("Referral link copied!");
  };

  const referralLink = `https://mobicrypto.threearrowstech.com/auth/signup-1?ref=${User?.refferrCode}`;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const generateQRCode = (text) => {
    return QRCode.toDataURL(text);
  };

  return (
    <Box
      severity="info"
      sx={{
        border: 1,
        borderColor: "primary.main",
        borderRadius: 3,
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        p: 1.5,
        bgcolor: "#f0fafa",
        ".MuiAlert-icon": {
          fontSize: 26,
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AlertTitle sx={{ pt: 1, fontSize: 18, mb: 0 }}>
          Get a bonus every time your referral joins
        </AlertTitle>
        <Typography sx={{ mt: 1 }} variant="body1" color="text.primary">
          Start referring today! Please click on the button to get your unique
          referral link. Thank You!
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexWrap="wrap"
          mt={3}
        >
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", sm: "block" },
              wordBreak: "break-all",
            }}
          >
            {referralLink}
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={() => copyReferralLink(referralLink)}
          >
            Copy Referral Link
          </Button>
        </Stack>
      </Box>

      {/* Right Side QR Code */}
      <Box
        sx={{
          minWidth: 130,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactQRCode value={referralLink} size={120} />
      </Box>
    </Box>
  );
};

export { UpgradePlan };
