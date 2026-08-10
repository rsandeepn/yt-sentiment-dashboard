import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { filterMeaningfulKeywords } from "../utils/keywordFilters";

const SENTIMENT_COLORS = ["#168a45", "#e6213c", "#d97706"];

function MetricCard({ label, value, helper, accent = "#18181b" }) {
  return (
    <Paper sx={{ p: 2.5, height: "100%", borderTop: `3px solid ${accent}` }}>
      <Typography variant="caption" color="text.secondary" fontWeight={650}>{label}</Typography>
      <Typography variant="h3" sx={{ mt: 1, mb: 0.5, textTransform: "capitalize" }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{helper}</Typography>
    </Paper>
  );
}

function ChartCard({ eyebrow, title, subtitle, children }) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, height: "100%", boxSizing: "border-box" }}>
      <Typography variant="overline" color="primary" fontWeight={750}>{eyebrow}</Typography>
      <Typography variant="h4" mt={0.25}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" mt={0.75} mb={2}>{subtitle}</Typography>
      {children}
    </Paper>
  );
}

export default function StatsCharts({ stats, insights }) {
  if (!stats) return null;

  const sentimentData = [
    { name: "Positive", value: stats.positive || 0 },
    { name: "Negative", value: stats.negative || 0 },
    { name: "Neutral", value: stats.neutral || 0 },
  ];
  const keywords = filterMeaningfulKeywords(insights?.top_keywords);
  const total = stats.total || sentimentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Comments analyzed" value={total.toLocaleString()} helper="Included in this report" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Overall sentiment" value={insights?.dominant_sentiment || "Unknown"} helper="Largest reaction group" accent="#168a45" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Positive audience" value={`${(insights?.positive_percentage ?? 0).toFixed(1)}%`} helper="Share of positive comments" accent="#168a45" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Suggestion rate" value={`${(insights?.suggestion_percentage ?? 0).toFixed(1)}%`} helper="Comments with a request" accent="#d97706" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard eyebrow="Sentiment" title="Sentiment distribution" subtitle="How viewers reacted across all analyzed comments.">
            <Box sx={{ width: "100%", height: 290, position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={103} paddingAngle={3} stroke="none">
                    {sentimentData.map((entry, index) => <Cell key={entry.name} fill={SENTIMENT_COLORS[index]} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} comments`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <Stack sx={{ position: "absolute", inset: 0, pointerEvents: "none" }} alignItems="center" justifyContent="center">
                <Typography variant="h3">{total.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">comments</Typography>
              </Stack>
            </Box>
            <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2.5}>
              {sentimentData.map((item, index) => (
                <Stack key={item.name} direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: SENTIMENT_COLORS[index] }} />
                  <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard eyebrow="Conversation" title="Top keywords" subtitle="The most frequently repeated terms in the discussion.">
            {keywords.length ? (
              <Box sx={{ width: "100%", height: 340 }}>
                <ResponsiveContainer>
                  <BarChart data={keywords.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 18 }}>
                    <CartesianGrid stroke="#eeeeeb" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#77777e", fontSize: 12 }} />
                    <YAxis dataKey="keyword" type="category" width={90} axisLine={false} tickLine={false} tick={{ fill: "#343438", fontSize: 12, fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: "#f6f6f4" }} />
                    <Bar dataKey="count" name="Mentions" fill="#e6213c" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ minHeight: 340, display: "grid", placeItems: "center", bgcolor: "#fafaf9", borderRadius: 2 }}>
                <Typography color="text.secondary">Keyword data is unavailable for this saved analysis.</Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
