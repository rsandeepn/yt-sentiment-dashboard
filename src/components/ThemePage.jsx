import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/useAnalysis";

export default function ThemePage() {
  const { result } = useAnalysis();
  const navigate = useNavigate();

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1100, py: { xs: 4, md: 7 } }}>
      <Button color="secondary" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/analyze")} sx={{ mb: 3 }}>
        Back to report
      </Button>
      <Typography variant="overline" color="primary" fontWeight={750}>Conversation themes</Typography>
      <Typography variant="h2" mt={0.5}>Theme overview</Typography>
      <Typography color="text.secondary" mt={1} mb={3}>A concise view of the topics shaping the discussion.</Typography>

      {!result ? (
        <Paper sx={{ p: 6, textAlign: "center", bgcolor: "#fafaf9" }}>
          <Typography variant="h5">No report is open</Typography>
          <Typography color="text.secondary" mt={1} mb={2}>Analyze a video or open a saved report first.</Typography>
          <Button variant="contained" onClick={() => navigate("/analyze")}>Analyze a video</Button>
        </Paper>
      ) : (
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ width: 44, height: 4, bgcolor: "primary.main", mb: 3 }} />
          <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.85, fontSize: "1.05rem" }}>
            {result.theme_overview || "No theme overview is available for this report."}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
