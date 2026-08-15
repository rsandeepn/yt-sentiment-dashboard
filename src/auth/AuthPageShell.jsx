import { Box, Paper, Stack, Typography } from "@mui/material";
import { BrandMark } from "../layout/AppLayout";
import PublicFooterLinks from "../components/PublicFooterLinks";

export default function AuthPageShell({ eyebrow, title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(420px, 0.9fr) 1.1fr" }, bgcolor: "#fff" }}>
      <Box sx={{ p: { xs: 3, sm: 6, xl: 9 }, display: "flex", flexDirection: "column" }}>
        <BrandMark />
        <Box sx={{ width: "100%", maxWidth: 460, my: "auto", py: 6 }}>
          <Typography variant="overline" color="primary" fontWeight={750}>{eyebrow}</Typography>
          <Typography variant="h2" mt={1} mb={1.5}>{title}</Typography>
          <Typography color="text.secondary" lineHeight={1.7} mb={4}>{subtitle}</Typography>
          {children}
        </Box>
        <Stack spacing={1.25}>
          <PublicFooterLinks />
          <Typography variant="caption" color="text.secondary">Independent audience analytics. Not affiliated with YouTube.</Typography>
        </Stack>
      </Box>

      <Box sx={{ display: { xs: "none", lg: "flex" }, bgcolor: "#18181b", color: "white", p: 7, alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 520, height: 520, bgcolor: "rgba(230,33,60,0.2)", borderRadius: "50%", top: -270, right: -220 }} />
        <Box sx={{ maxWidth: 650, position: "relative", zIndex: 1 }}>
          <Typography variant="h2" mb={2}>From comment noise to clear audience direction.</Typography>
          <Typography sx={{ color: "#bcbcc2", fontSize: "1.08rem", lineHeight: 1.75, maxWidth: 570 }}>
            Understand sentiment, discover repeated themes, and turn viewer feedback into your next content decision.
          </Typography>
          <Stack direction="row" spacing={2} mt={6}>
            {["Sentiment", "Keywords", "Suggestions"].map((label, index) => (
              <Paper key={label} sx={{ p: 2.25, minWidth: 140, bgcolor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "white" }}>
                <Typography variant="caption" sx={{ color: "#ff8b9b" }}>0{index + 1}</Typography>
                <Typography fontWeight={650} mt={1}>{label}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
