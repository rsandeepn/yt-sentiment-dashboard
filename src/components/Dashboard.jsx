import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/useAnalysis";
import api from "../api";
import ExploreComments from "./ExploreComments";
import StatsCharts from "./StatsCharts";
import { analysisJobOutcome, isActiveAnalysis } from "../utils/analysisJobs";
import { deriveInsights, downloadJSONReport, reportFilename } from "../utils/reportInsights";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const { result, setResult, currentJob, setCurrentJob } = useAnalysis();
  const navigate = useNavigate();
  const analysisIsActive = isActiveAnalysis(currentJob);

  useEffect(() => {
    if (!analysisIsActive || !currentJob?.id) return undefined;
    let cancelled = false;
    let timer;
    const poll = async () => {
      try {
        const response = await api.get(`/analyses/${currentJob.id}`);
        if (cancelled) return;
        const job = response.data;
        if (analysisJobOutcome(job) === "results") {
          setResult(job.result);
          setCurrentJob(null);
          return;
        }
        setCurrentJob(job);
        if (analysisJobOutcome(job) === "poll") timer = window.setTimeout(poll, 1500);
      } catch (requestError) {
        if (!cancelled) setError(requestError.response?.data?.detail || "Unable to check analysis progress.");
      }
    };
    poll();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [analysisIsActive, currentJob?.id, setCurrentJob, setResult]);

  const analyzeVideo = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    setError("");
    setResult(null);
    setCurrentJob(null);
    try {
      const response = await api.post("/analyses", { url });
      const job = response.data;
      if (job.status === "completed") setResult(job.result);
      else setCurrentJob(job);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Failed to analyze video.");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    analyzeVideo();
  };

  const exportPDF = async () => {
    const section = document.getElementById("report-section");
    if (!section) return;
    setExporting(true);
    setError("");
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(section, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usablePageHeight = pageHeight - margin * 2;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let renderedHeight = 0;
      while (renderedHeight < imgHeight) {
        if (renderedHeight > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin - renderedHeight, imgWidth, imgHeight);
        renderedHeight += usablePageHeight;
      }
      pdf.save(reportFilename(result, "pdf"));
    } catch {
      setError("Unable to export this report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const insights = result ? deriveInsights(result) : null;

  return (
    <>
      <Box
        sx={{
          bgcolor: "#18181b",
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(230,33,60,0.18)",
            filter: "blur(10px)",
            top: -260,
            right: -100,
          },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 7, md: 10 }, position: "relative", zIndex: 1 }}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 5, lg: 9 }} alignItems={{ lg: "center" }}>
            <Box sx={{ flex: 1, maxWidth: 720 }}>
              <Typography variant="overline" sx={{ color: "#ff8b9b", fontWeight: 700, letterSpacing: "0.14em" }}>
                Multilingual audience intelligence
              </Typography>
              <Typography variant="h1" sx={{ mt: 1, mb: 2 }}>
                Understand what your audience is really saying.
              </Typography>
              <Typography sx={{ color: "#bcbcc2", fontSize: { xs: "1rem", md: "1.12rem" }, maxWidth: 620, lineHeight: 1.7 }}>
                Turn YouTube comments into clear sentiment, recurring themes, top keywords, and practical content ideas—in one focused report.
              </Typography>
            </Box>

            <Paper component="form" onSubmit={onSubmit} sx={{ flex: 1, width: "100%", maxWidth: 620, p: { xs: 2.5, sm: 3.5 }, border: 0, boxShadow: "0 24px 70px rgba(0,0,0,0.32)" }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <LinkRoundedIcon color="primary" />
                <Typography variant="h5" color="text.primary">Analyze a YouTube video</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={2.5}>
                Paste a public video link to create a new audience report.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <TextField
                  fullWidth
                  aria-label="YouTube video URL"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  disabled={analysisIsActive}
                />
                <Button type="submit" variant="contained" disabled={analysisIsActive} endIcon={!analysisIsActive && <ArrowForwardRoundedIcon />} sx={{ whiteSpace: "nowrap", minWidth: 150 }}>
                  {analysisIsActive ? <CircularProgress size={22} color="inherit" /> : "Analyze video"}
                </Button>
              </Stack>

              {currentJob && (
                <Box sx={{ mt: 2.5 }}>
                  {currentJob.status === "failed" ? (
                    <Alert severity="error">{currentJob.error_message || "Analysis failed. Open History to retry."}</Alert>
                  ) : (
                    <>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight={650}>{currentJob.status_message || "Analysis in progress"}</Typography>
                        <Typography variant="body2" color="text.secondary">{currentJob.progress || 0}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={currentJob.progress || 0} sx={{ height: 7, borderRadius: 10 }} />
                    </>
                  )}
                </Box>
              )}
              {error && <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert>}
            </Paper>
          </Stack>
        </Container>
      </Box>

      {!result && !currentJob && (
        <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 6, md: 9 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              ["01", "Sentiment distribution", "See the balance of positive, neutral, and negative reactions at a glance."],
              ["02", "Keywords & themes", "Find the topics and phrases your viewers repeat most often."],
              ["03", "Audience suggestions", "Surface requests and improvement ideas you can act on next."],
            ].map(([number, title, copy]) => (
              <Paper key={number} sx={{ p: 3.5, flex: 1, minHeight: 210 }}>
                <Typography variant="overline" color="primary" fontWeight={750}>{number}</Typography>
                <Typography variant="h4" mt={3} mb={1.25}>{title}</Typography>
                <Typography color="text.secondary" lineHeight={1.7}>{copy}</Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      )}

      {result && (
        <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 4, md: 6 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "flex-end" }} spacing={2} mb={3}>
            <Box>
              <Typography variant="overline" color="primary" fontWeight={750}>Analysis report</Typography>
              <Typography variant="h2" mt={0.5}>Audience insights</Typography>
              <Typography color="text.secondary" mt={1}>
                {result.video?.id ? `Video ${result.video.id} · ` : ""}Generated {new Date().toLocaleString()}
              </Typography>
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Button variant="outlined" color="secondary" startIcon={<HubRoundedIcon />} onClick={() => navigate("/clusters")}>Detailed themes</Button>
              <Button variant="outlined" color="secondary" startIcon={<DownloadRoundedIcon />} onClick={() => downloadJSONReport(result)}>JSON</Button>
              <Button variant="contained" startIcon={<PictureAsPdfRoundedIcon />} onClick={exportPDF} disabled={exporting}>
                {exporting ? "Preparing…" : "Export PDF"}
              </Button>
            </Stack>
          </Stack>

          <Paper sx={{ p: { xs: 2.5, md: 4 } }} id="report-section">
            <Stack direction="row" alignItems="center" spacing={1.25} mb={3}>
              <InsertChartOutlinedRoundedIcon color="primary" />
              <Typography variant="h4">Report overview</Typography>
            </Stack>
            {result.overview && (
              <Box sx={{ bgcolor: "#f6f6f4", borderRadius: 2.5, p: 2.5, mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>Executive summary</Typography>
                <Typography sx={{ whiteSpace: "pre-line", mt: 0.75, lineHeight: 1.75 }}>{result.overview}</Typography>
              </Box>
            )}
            <StatsCharts stats={result.stats} insights={insights} />
          </Paper>

          <Divider sx={{ my: 5 }} />
          <Box>
            <Typography variant="overline" color="primary" fontWeight={750}>Comment explorer</Typography>
            <Typography variant="h3" mt={0.5}>Hear the individual voices</Typography>
            <Typography color="text.secondary" mt={1} mb={3}>Search, compare, and review the comments behind the report.</Typography>
            <ExploreComments />
          </Box>
        </Container>
      )}
    </>
  );
}
