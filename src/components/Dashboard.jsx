// src/components/Dashboard.jsx
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

import StatsCharts from "./StatsCharts";
import SummaryCard from "./summary/SummaryCard";
import { parseSummary } from "../utils/parseSummary";
import SuggestionCard from "./summary/SuggestionCard";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { result, setResult } = useAnalysis();
  const navigate = useNavigate();

  // -----------------------------------------
  // ANALYZE VIDEO
  // -----------------------------------------
  const analyzeVideo = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", { url });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // EXPORT PDF
  // -----------------------------------------
  const exportPDF = async () => {
    const section = document.getElementById("report-section");
    if (!section) return;

    const canvas = await html2canvas(section, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("youtube-summary-report.pdf");
  };

  // -----------------------------------------
  // PARSE DETAILED SUMMARY INTO UI SECTIONS
  // -----------------------------------------
  const summarySections = result ? parseSummary(result.summary) : {};

  return (
    <Box p={4}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎬 YouTube Sentiment Dashboard
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Analyze multilingual YouTube comments (English, Spanish, Telugu, Hindi,
        Tamil, etc.)
      </Typography>

      {/* URL INPUT */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="600">
          Enter YouTube URL
        </Typography>

        <Box
          mt={2}
          display="flex"
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <TextField
            fullWidth
            label="https://youtube.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button
            variant="contained"
            disabled={loading}
            onClick={analyzeVideo}
            sx={{ minWidth: 140 }}
          >
            {loading ? <CircularProgress size={22} /> : "Analyze"}
          </Button>
        </Box>

        {error && (
          <Typography mt={2} color="error">
            {error}
          </Typography>
        )}
      </Paper>

      {/* ---------------------------------------------------
         RESULTS SECTION
      ---------------------------------------------------- */}
      {result && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          {/* ACTION BUTTONS */}
          <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
            <Button variant="contained" color="secondary" onClick={exportPDF}>
              📄 Export PDF
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/explore")}
            >
              🔍 Explore Comments
            </Button>
          </Box>

          <div id="report-section">
            {/* -----------------------------------------
               SIMPLE OVERVIEW (ALREADY GOOD)
            ------------------------------------------ */}
            <SummaryCard title="Simple Overview" icon="🧾" color="#4b7bec">
              {result.overview}
            </SummaryCard>

            {/* -----------------------------------------
               HIGH-LEVEL SUMMARY
            ------------------------------------------ */}
            <SummaryCard
              title="High-Level Summary"
              icon="🧠"
              color="#8854d0"
              data={{
                stats: {
                  total: result.stats.total,
                  positive: result.stats.positive,
                  negative: result.stats.negative,
                  neutral: result.stats.neutral,
                  suggestions: result.stats.suggestions,

                  posPct: (
                    (result.stats.positive / result.stats.total) *
                    100
                  ).toFixed(1),
                  negPct: (
                    (result.stats.negative / result.stats.total) *
                    100
                  ).toFixed(1),
                  neuPct: (
                    (result.stats.neutral / result.stats.total) *
                    100
                  ).toFixed(1),
                },
                text: "",
              }}
            />

            {result?.suggestions && (
              <SuggestionCard suggestions={result.suggestions} />
            )}

            {/* -----------------------------------------
               POSITIVE THEMES
            ------------------------------------------ */}
            {/* {summarySections.positives && (
              <SummaryCard title="Positive Themes" icon="⭐" color="#20bf6b">
                {summarySections.positives}
              </SummaryCard>
            )} */}

            {/* -----------------------------------------
               NEGATIVE THEMES
            ------------------------------------------ */}
            {/* {summarySections.negatives && (
              <SummaryCard title="Negative Themes" icon="⚠️" color="#eb3b5a">
                {summarySections.negatives}
              </SummaryCard>
            )} */}

            {/* -----------------------------------------
               NEUTRAL OBSERVATIONS
            ------------------------------------------ */}
            {/* {summarySections.neutral && (
              <SummaryCard
                title="Neutral Observations"
                icon="😐"
                color="#a5b1c2"
              >
                {summarySections.neutral}
              </SummaryCard>
            )} */}

            <Divider sx={{ my: 3 }} />

            {/* -----------------------------------------
               STATS + CHARTS
            ------------------------------------------ */}
            <StatsCharts stats={result.stats} />

            <Divider sx={{ my: 3 }} />

            {/* ---------------------------------------------------
               CLUSTER SECTIONS
            ---------------------------------------------------- */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Comment Themes
            </Typography>

            <Grid container spacing={3}>
              {/* POSITIVE CLUSTERS */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  ⭐ Positive Clusters
                </Typography>

                {Object.entries(result.positive_clusters).map(([id, c]) => (
                  <Paper
                    key={id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      background: "#e8f9f1",
                    }}
                  >
                    <Chip
                      label={`Cluster #${id}`}
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography fontWeight="600">{c.summary}</Typography>
                    <ul>
                      {c.examples.map((ex, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">{ex}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                ))}
              </Grid>

              {/* NEGATIVE CLUSTERS */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  ⚠️ Negative Clusters
                </Typography>

                {Object.entries(result.negative_clusters).map(([id, c]) => (
                  <Paper
                    key={id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      background: "#ffeaea",
                    }}
                  >
                    <Chip
                      label={`Cluster #${id}`}
                      color="error"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography fontWeight="600">{c.summary}</Typography>
                    <ul>
                      {c.examples.map((ex, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">{ex}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                ))}
              </Grid>
              {result.themes && <ThemeCard themes={result.themes} />}
            </Grid>
          </div>
        </Paper>
      )}
    </Box>
  );
}
