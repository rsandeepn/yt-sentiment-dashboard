import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/useAnalysis";
import SuggestionCard from "./summary/SuggestionCard";

export default function SuggestionsPage() {
  const { result } = useAnalysis();
  const navigate = useNavigate();
  const suggestions = result?.suggestions;

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 4, md: 7 } }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "flex-end" }} gap={2} mb={4}>
        <Box>
          <Typography variant="overline" color="primary" fontWeight={750}>Content opportunities</Typography>
          <Typography variant="h2" mt={0.5}>Audience suggestions</Typography>
          <Typography color="text.secondary" mt={1} maxWidth={720}>
            Turn repeated viewer requests and improvement ideas from your latest opened report into clear next steps.
          </Typography>
        </Box>
        <Button variant="outlined" color="secondary" startIcon={<HistoryRoundedIcon />} onClick={() => navigate("/history")}>
          Choose another report
        </Button>
      </Stack>

      {suggestions ? (
        <>
          <Paper sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#fff", borderColor: "#e4e4e7" }}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "#fce8ec", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <TipsAndUpdatesRoundedIcon sx={{ color: "#c51630" }} />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Current report</Typography>
                <Typography variant="h5">{result.video?.id ? `Video ${result.video.id}` : "Latest analyzed video"}</Typography>
              </Box>
            </Stack>
          </Paper>
          <SuggestionCard suggestions={suggestions} expanded />
        </>
      ) : (
        <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: "center", bgcolor: "#fafaf9" }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: "#f1f1ef", display: "grid", placeItems: "center", mx: "auto", mb: 2 }}>
            <TipsAndUpdatesRoundedIcon sx={{ color: "text.secondary" }} />
          </Box>
          <Typography variant="h4">Open a report to view its suggestions</Typography>
          <Typography color="text.secondary" mt={1} mb={3}>
            Analyze a new video or select a completed report from History.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={1.25}>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate("/")}>Analyze a video</Button>
            <Button variant="outlined" color="secondary" startIcon={<HistoryRoundedIcon />} onClick={() => navigate("/history")}>Open History</Button>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
