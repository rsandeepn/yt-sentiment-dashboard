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
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

import StatsCharts from "./StatsCharts";
import SummaryCard from "./summary/SummaryCard";
import ExploreComments from "./ExploreComments";
import Suggestioncard from "./summary/SuggestionCard";

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
      setError("Failed to analyze video.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // PDF EXPORT
  // -----------------------------------------
  const exportPDF = async () => {
    const section = document.getElementById("report-section");
    if (!section) return;

    const canvas = await html2canvas(section, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("youtube-summary-report.pdf");
  };

  return (
    <Box
      p={4}
      sx={{
        background: "linear-gradient(135deg, #eef1ff 0%, #ffffff 100%)",
        minHeight: "100vh",
      }}
    >
      {/* -----------------------------------------
          HEADER SECTION
      ------------------------------------------ */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          🎬 YouTube Sentiment Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: "800px", mx: "auto", fontSize: "1.1rem" }}
        >
          Analyze multilingual YouTube comments powered by sentiment clustering.
        </Typography>
      </Box>

      {/* -----------------------------------------
          PREMIUM URL INPUT CARD
      ------------------------------------------ */}
      <Paper
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          sx={{ textAlign: "center", mb: 2 }}
        >
          🔗 Enter YouTube Video URL
        </Typography>

        <Box
          mt={2}
          display="flex"
          gap={2}
          justifyContent="center"
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <TextField
            fullWidth
            placeholder="https://youtube.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{
              maxWidth: 700,
              mx: "auto",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <Button
            variant="contained"
            disabled={loading}
            onClick={analyzeVideo}
            sx={{
              px: 4,
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {loading ? <CircularProgress size={22} /> : "Analyze"}
          </Button>
        </Box>

        {error && (
          <Typography mt={2} color="error" textAlign="center">
            {error}
          </Typography>
        )}
      </Paper>

      {/* -----------------------------------------
          RESULTS
      ------------------------------------------ */}
      {result && (
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.7)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* ACTION BUTTONS */}
          <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
            {/* <Button
              variant="outlined"
              onClick={() => navigate("/themes")}
              sx={{
                borderRadius: "10px",
                fontWeight: "600",
                px: 3,
              }}
            >
              🎯 View Themes
            </Button> */}

            <Button
              variant="outlined"
              onClick={() => navigate("/clusters")}
              sx={{
                borderRadius: "10px",
                fontWeight: "600",
                px: 3,
              }}
            >
              🧩 View Clusters
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={exportPDF}
              sx={{ borderRadius: "10px", fontWeight: "700", px: 3 }}
            >
              📄 Export PDF
            </Button>
          </Box>

          <div id="report-section">
            {/* -----------------------------------------
                SIMPLE OVERVIEW (PREMIUM LOOK)
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
            <SummaryCard title="Simple Overview" icon="🧾" color="#4b7bec">
              {result.overview}
            </SummaryCard>

            <Divider sx={{ my: 4 }} />

            {/* -----------------------------------------
                STATS CHARTS
            ------------------------------------------ */}
            {/* <StatsCharts stats={result.stats} /> */}

            {/* ⭐ VIEWER SUGGESTIONS (Premium UI Added Back) */}
            {result?.suggestions && (
              <Suggestioncard suggestions={result.suggestions} />
            )}
            <Divider sx={{ my: 4 }} />
            {/* -----------------------------------------
                EXPLORE COMMENTS (PREMIUM)
            ------------------------------------------ */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(245,245,255,0.6)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="h5" fontWeight="700" gutterBottom>
                🔍 Explore Viewer Comments
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Search, filter and navigate through all viewer reactions.
              </Typography>

              <ExploreComments />
            </Paper>
          </div>
        </Paper>
      )}
    </Box>
  );
}
