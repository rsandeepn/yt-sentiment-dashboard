import { Paper, Typography, Chip, Box } from "@mui/material";

export default function ThemeCard({ themes }) {
  if (!themes) return null;

  return (
    <Paper sx={{ p: 3, mt: 3, borderLeft: "5px solid #6a5acd" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🎯 Key Themes in the Comments
      </Typography>

      {Object.entries(themes).map(([theme, items], idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="600">
            {theme}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {items.map((p, i) => (
              <Chip
                key={i}
                label={p}
                size="small"
                sx={{ bgcolor: "#eee", fontSize: "0.8rem" }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
