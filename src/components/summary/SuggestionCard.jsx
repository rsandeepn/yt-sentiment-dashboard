import { useState } from "react";
import { Paper, Typography, Box, Chip, Button, Collapse } from "@mui/material";

export default function SuggestionCard({ suggestions }) {
  if (!suggestions) return null;

  const [open, setOpen] = useState(false);

  const clusterEntries = Object.entries(suggestions.clusters || {});
  const sampleComments = suggestions.examples || [];

  return (
    <Paper
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 3,
        background: "#fff8e1",
        borderLeft: "6px solid #ff9800",
      }}
      elevation={2}
    >
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        💡 Viewer Suggestions & Improvement Ideas
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {suggestions.overview}
      </Typography>

      {/* Suggestion THEMES */}
      {clusterEntries.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Key Improvement Themes:
          </Typography>

          {clusterEntries.map(([id, cluster]) => (
            <Paper
              key={id}
              sx={{
                p: 2,
                px: 3,
                mb: 2,
                background: "#fff3cd",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                🔸 Theme {Number(id) + 1}: {cluster.summary}
              </Typography>
            </Paper>
          ))}
        </>
      )}

      {/* Expandable comments */}
      <Button variant="outlined" onClick={() => setOpen(!open)} sx={{ mt: 2 }}>
        {open ? "Hide Comments" : "Show Related Comments"}
      </Button>

      <Collapse in={open}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            📌 Sample Viewer Comments
          </Typography>

          {sampleComments.map((c, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{ mb: 0.8, pl: 1, borderLeft: "2px solid #ffcc80" }}
            >
              • {c}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}
