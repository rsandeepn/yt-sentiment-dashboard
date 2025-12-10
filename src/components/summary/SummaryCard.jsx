import { Paper, Typography, Box, Chip, Divider, Grid } from "@mui/material";

export default function SummaryCard({
  title,
  icon,
  color,
  data = {},
  children,
}) {
  // Accept EITHER data.text OR direct children content
  const textContent = data?.text || children;

  // If no text AND no stats => do not render card
  const hasStats = data?.stats !== undefined;
  const hasText = typeof textContent === "string" && textContent.trim() !== "";

  if (!hasStats && !hasText) return null;

  return (
    <Paper
      sx={{
        p: 3,
        my: 3,
        borderRadius: 3,
        background: "#ffffff",
        borderLeft: `6px solid ${color}`,
      }}
      elevation={2}
    >
      {/* HEADER */}
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" sx={{ color, mr: 1 }}>
          {icon}
        </Typography>
        <Typography variant="h6" fontWeight="600">
          {title}
        </Typography>
      </Box>

      {/* STAT GRID */}
      {hasStats && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} md={3}>
            <Chip
              label={`Total: ${data.stats.total}`}
              color="primary"
              fullWidth
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Chip
              label={`Positive: ${data.stats.positive} (${data.stats.posPct}%)`}
              sx={{ width: "100%", background: "#e8f9f1" }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Chip
              label={`Negative: ${data.stats.negative} (${data.stats.negPct}%)`}
              sx={{ width: "100%", background: "#ffeaea" }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Chip
              label={`Neutral: ${data.stats.neutral} (${data.stats.neuPct}%)`}
              sx={{ width: "100%", background: "#f1f2f6" }}
            />
          </Grid>

          {data.stats.suggestions !== undefined && (
            <Grid item xs={6} md={3}>
              <Chip
                label={`Suggestions: ${data.stats.suggestions}`}
                sx={{ width: "100%", background: "#fff3cd" }}
              />
            </Grid>
          )}
        </Grid>
      )}

      {hasStats && hasText && <Divider sx={{ my: 2 }} />}

      {/* MAIN TEXT CONTENT */}
      {hasText && (
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {textContent}
        </Typography>
      )}
    </Paper>
  );
}
