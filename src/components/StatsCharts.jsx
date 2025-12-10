import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Box, Typography, Paper } from "@mui/material";

const COLORS = ["#4caf50", "#f44336", "#ff9800"];

export default function StatsCharts({ stats }) {
  if (!stats) return null;

  const { positive, negative, neutral } = stats;

  const pieData = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
    { name: "Neutral", value: neutral },
  ];

  const barData = [{ name: "Comments", positive, negative, neutral }];

  return (
    <Box mt={4}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={3}
        justifyContent="space-between"
      >
        {/* ---------------- PIE CHART ---------------- */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sentiment Distribution
          </Typography>

          <PieChart width={350} height={260}>
            <Pie
              data={pieData}
              cx={150}
              cy={120}
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
            >
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </Paper>

        {/* ---------------- BAR CHART ---------------- */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sentiment Comparison
          </Typography>

          <BarChart width={380} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" fill="#4caf50" />
            <Bar dataKey="negative" fill="#f44336" />
            <Bar dataKey="neutral" fill="#ff9800" />
          </BarChart>
        </Paper>
      </Box>
    </Box>
  );
}
