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
  Grid,
  Chip,
} from "@mui/material";
import StatsCharts from "./StatsCharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { result, setResult } = useAnalysis();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch analysis from backend
  const analyzeVideo = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

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

  // Export PDF
  const exportPDF = async () => {
    const section = document.getElementById("report-section");
    if (!section) return;

    const canvas = await html2canvas(section, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(img, "PNG", 0, 0, width, 0);
    pdf.save("analysis_report.pdf");
  };

  return (
    <Box p={4}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎬 YouTube Sentiment Dashboard
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Analyze multilingual YouTube comments (Telugu, Hindi, Tamil, English,
        etc.)
      </Typography>

      {/* URL INPUT */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1">Enter YouTube URL</Typography>

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
          <Button variant="contained" disabled={loading} onClick={analyzeVideo}>
            {loading ? <CircularProgress size={22} /> : "Analyze"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Paper>

      {/* RESULTS */}
      {result && (
        <Paper sx={{ p: 3 }}>
          {/* Buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end" mb={2}>
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
            {/* Overview */}
            <Paper sx={{ p: 2, background: "#f7f7f7", mb: 3 }}>
              <Typography variant="h6">🧾 Simple Overview</Typography>
              <Typography>{result.overview}</Typography>
            </Paper>

            {/* Full Summary */}
            <Typography variant="h6" mb={1}>
              🧠 Detailed Summary
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {result.summary}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Stats + Charts */}
            <StatsCharts stats={result.stats} />

            <Divider sx={{ my: 3 }} />

            {/* POSITIVE CLUSTERS */}
            <Typography variant="h6" gutterBottom>
              ⭐ Positive Themes
            </Typography>
            {Object.entries(result.positive_clusters).map(([id, c]) => (
              <Paper key={id} sx={{ p: 2, mb: 2, background: "#e8f5e9" }}>
                <Chip
                  label={`Cluster #${id}`}
                  color="success"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography fontWeight="bold">{c.summary}</Typography>
                <ul>
                  {c.examples.map((ex, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">{ex}</Typography>
                    </li>
                  ))}
                </ul>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* NEGATIVE CLUSTERS */}
            <Typography variant="h6" gutterBottom>
              ⚠️ Negative Themes
            </Typography>
            {Object.entries(result.negative_clusters).map(([id, c]) => (
              <Paper key={id} sx={{ p: 2, mb: 2, background: "#ffebee" }}>
                <Chip
                  label={`Cluster #${id}`}
                  color="error"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography fontWeight="bold">{c.summary}</Typography>
                <ul>
                  {c.examples.map((ex, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">{ex}</Typography>
                    </li>
                  ))}
                </ul>
              </Paper>
            ))}
          </div>
        </Paper>
      )}
    </Box>
  );
}
