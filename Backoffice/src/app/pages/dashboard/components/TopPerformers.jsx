import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { Gem, Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const TopPerformer = React.memo(({ topPerformer = {}, loading = false }) => {
  const { t } = useTranslation();
  const topPerformerData = useMemo(() => {
    return {
      username: topPerformer?.username || topPerformer?.userName || "N/A",
      firstName: topPerformer?.firstName || topPerformer?.first_name || "",
      lastName: topPerformer?.lastName || topPerformer?.last_name || "",
    };
  }, [topPerformer]);

  const displayName =
    `${topPerformerData.firstName} ${topPerformerData.lastName}`.trim();

  if (loading) {
    return (
      <Card
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mt: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          p: 2,
          boxShadow: "none",
          borderLeft: "6px solid #DC2626",
          minHeight: 180, // Increased height for loading state
        }}
      >
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={24} />
        </Box>
        <Skeleton variant="rectangular" width={120} height={120} />{" "}
        {/* Larger image skeleton */}
      </Card>
    );
  }

  if (!topPerformer || Object.keys(topPerformer).length === 0) {
    return (
      <Card
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mt: 2,
          mb: 4,
          boxShadow: "none",
          border: "1px dashed",
          borderColor: "grey.300",
          p: 3,
          textAlign: "center",
          minHeight: 180, // Increased height for empty state
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderLeft: "6px solid #DC2626",
        }}
      >
        <Typography variant="h6" gutterBottom color="text.secondary">
          No Top Performer Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later to see who's at the top!
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ height: 100, my: 3, borderLeft: "6px solid #2865EB", }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <>
              <Typography variant="h4">
                {" "}
                {t("dashboard.topPerformer")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {topPerformerData?.username || "N/A"}
              </Typography>
            </>
          </Box>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Gem className="w-6 h-6 text-blue-600" />
          </div>
        </Box>
      </CardContent>
    </Card>
  );
});

export default TopPerformer;
