import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";

const SENTIMENT_COLORS = ["#16a34a", "#dc2626", "#d97706"];
const LANGUAGE_COLORS = ["#4f46e5", "#0891b2", "#7c3aed", "#db2777", "#65a30d", "#ea580c"];

function ChartCard({ title, subtitle, children }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: "100%", boxSizing: "border-box" }}>
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>{subtitle}</Typography>
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
  const keywords = insights?.top_keywords || [];
  const languages = insights?.language_breakdown || [];

  return (
    <Box mt={3}>
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ChartCard title="Dominant sentiment" subtitle="Largest viewer reaction group">
            <Typography variant="h4" fontWeight={800} textTransform="capitalize" color="primary.main">
              {insights?.dominant_sentiment || "Unknown"}
            </Typography>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ChartCard title="Average sentiment" subtitle="Score from -1 (negative) to +1 (positive)">
            <Typography variant="h4" fontWeight={800}>
              {insights?.average_sentiment_score == null
                ? "N/A"
                : insights.average_sentiment_score.toFixed(2)}
            </Typography>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ChartCard title="Suggestion rate" subtitle="Comments containing an improvement request">
            <Typography variant="h4" fontWeight={800}>
              {(insights?.suggestion_percentage ?? 0).toFixed(1)}%
            </Typography>
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Sentiment distribution" subtitle="Share of analyzed comments by sentiment">
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={entry.name} fill={SENTIMENT_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Top keywords" subtitle="Most frequently repeated discussion terms">
            {keywords.length ? (
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={keywords.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="keyword" type="category" width={90} />
                    <Tooltip />
                    <Bar dataKey="count" name="Mentions" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : <Typography color="text.secondary">Keyword data is unavailable for this saved analysis.</Typography>}
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChartCard title="Comment script distribution" subtitle="Dominant writing script detected in each comment; Latin may include transliterated languages">
            {languages.length ? (
              <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                {languages.map((item, index) => (
                  <Chip
                    key={item.language}
                    label={`${item.language}: ${item.count} (${item.percentage.toFixed(1)}%)`}
                    sx={{ color: "white", bgcolor: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length], fontWeight: 600 }}
                  />
                ))}
              </Stack>
            ) : <Typography color="text.secondary">Script data is unavailable for this saved analysis.</Typography>}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
