import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/useAnalysis";

function ClusterColumn({ eyebrow, title, clusters, color, tint }) {
  const entries = Object.entries(clusters || {});
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3.5 }, height: "100%" }}>
      <Typography variant="overline" sx={{ color, fontWeight: 750 }}>{eyebrow}</Typography>
      <Typography variant="h3" mt={0.5} mb={2.5}>{title}</Typography>
      <Stack spacing={1.5}>
        {entries.length ? entries.map(([id, cluster], index) => (
          <Box key={id} sx={{ p: 2.25, borderRadius: 2, bgcolor: tint, borderLeft: `3px solid ${color}` }}>
            <Typography variant="caption" color="text.secondary">Theme {index + 1}</Typography>
            <Typography fontWeight={680} mt={0.5} mb={1}>{cluster.summary}</Typography>
            {(cluster.examples || []).slice(0, 3).map((example, exampleIndex) => (
              <Typography key={`${id}-${exampleIndex}`} variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.6 }}>
                “{example}”
              </Typography>
            ))}
          </Box>
        )) : <Typography color="text.secondary">No themes were detected in this group.</Typography>}
      </Stack>
    </Paper>
  );
}

export default function ClustersPage() {
  const { result } = useAnalysis();
  const navigate = useNavigate();

  if (!result) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1100, py: 8 }}>
        <Paper sx={{ p: 7, textAlign: "center", bgcolor: "#fafaf9" }}>
          <Typography variant="h4">No report is open</Typography>
          <Typography color="text.secondary" mt={1} mb={2}>Analyze a video or open a report from History first.</Typography>
          <Button variant="contained" onClick={() => navigate("/analyze")}>Analyze a video</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 4, md: 7 } }}>
      <Button color="secondary" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/analyze")} sx={{ mb: 3 }}>
        Back to report
      </Button>
      <Typography variant="overline" color="primary" fontWeight={750}>Deeper analysis</Typography>
      <Typography variant="h2" mt={0.5}>Detailed themes</Typography>
      <Typography color="text.secondary" mt={1} mb={4}>The recurring positive and critical conversations behind the headline metrics.</Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ClusterColumn eyebrow="Positive signals" title="What viewers value" clusters={result.positive_clusters} color="#168a45" tint="#f1faf4" />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ClusterColumn eyebrow="Critical signals" title="Where viewers want more" clusters={result.negative_clusters} color="#e6213c" tint="#fff5f6" />
        </Grid>
      </Grid>

      {result.suggestions?.overview && (
        <Paper sx={{ mt: 2.5, p: { xs: 2.5, md: 4 }, bgcolor: "#fffbf4", borderColor: "#f2dec1" }}>
          <Typography variant="overline" sx={{ color: "#a95b05", fontWeight: 750 }}>Recommended focus</Typography>
          <Typography variant="h4" mt={0.5} mb={1.25}>Audience requests</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>{result.suggestions.overview}</Typography>
        </Paper>
      )}
    </Container>
  );
}
