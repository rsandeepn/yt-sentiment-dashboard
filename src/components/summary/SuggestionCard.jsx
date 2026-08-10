import { useState } from "react";
import { Box, Button, Collapse, Grid, Paper, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

export default function SuggestionCard({ suggestions }) {
  const [open, setOpen] = useState(false);
  if (!suggestions) return null;

  const clusters = Object.values(suggestions.clusters || {});
  const examples = suggestions.examples || [];

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3.5 }, mt: 2.5, bgcolor: "#fffbf4", borderColor: "#f2dec1" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2}>
        <Box sx={{ maxWidth: 780 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <LightbulbRoundedIcon sx={{ color: "#d97706" }} />
            <Typography variant="overline" sx={{ color: "#a95b05", fontWeight: 750 }}>Actionable insight</Typography>
          </Stack>
          <Typography variant="h4">Audience suggestions</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
            {suggestions.overview || "Review the most common viewer requests and improvement ideas."}
          </Typography>
        </Box>
        {examples.length > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={open ? <RemoveRoundedIcon /> : <AddRoundedIcon />}
            onClick={() => setOpen(!open)}
            sx={{ flexShrink: 0 }}
          >
            {open ? "Hide comments" : "View examples"}
          </Button>
        )}
      </Stack>

      {clusters.length > 0 && (
        <Grid container spacing={1.5} mt={1.5}>
          {clusters.slice(0, 6).map((cluster, index) => (
            <Grid key={`${cluster.summary}-${index}`} size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: "white", border: "1px solid #f2dec1", borderRadius: 2, p: 2, height: "100%" }}>
                <Typography variant="caption" color="text.secondary">Theme {index + 1}</Typography>
                <Typography fontWeight={650} mt={0.5}>{cluster.summary}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Collapse in={open}>
        <Grid container spacing={1.5} mt={2}>
          {examples.map((text, index) => (
            <Grid key={`${text}-${index}`} size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: "white", borderRadius: 2, border: "1px solid #f2dec1", p: 2, height: "100%" }}>
                <Typography variant="body2" sx={{ lineHeight: 1.65 }}>“{text}”</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Paper>
  );
}
