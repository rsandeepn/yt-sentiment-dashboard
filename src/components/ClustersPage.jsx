// // src/components/ClustersPage.jsx
// import { Box, Paper, Typography, Chip, Button, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAnalysis } from "../context/AnalysisContext";

// export default function ClustersPage() {
//   const { result } = useAnalysis();
//   const navigate = useNavigate();

//   if (!result) {
//     return (
//       <Box p={4}>
//         <Typography variant="h5" gutterBottom>
//           No cluster data available ❗
//         </Typography>
//         <Typography color="text.secondary">
//           Please analyze a YouTube video from the dashboard first.
//         </Typography>
//         <Button
//           sx={{ mt: 2 }}
//           variant="contained"
//           onClick={() => navigate("/")}
//         >
//           ← Back to Dashboard
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box p={4}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         🧩 Comment Clusters
//       </Typography>

//       <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
//         ← Back to Dashboard
//       </Button>

//       {/* Positive Clusters */}
//       <Typography variant="h6" gutterBottom>
//         ⭐ Positive Themes
//       </Typography>
//       {Object.entries(result.positive_clusters || {}).map(([id, c]) => (
//         <Paper key={id} sx={{ p: 2, mb: 2, background: "#e8f5e9" }}>
//           <Chip
//             label={`Cluster #${id}`}
//             color="success"
//             size="small"
//             sx={{ mb: 1 }}
//           />
//           <Typography fontWeight="bold">{c.summary}</Typography>
//           <ul>
//             {c.examples.map((ex, idx) => (
//               <li key={idx}>
//                 <Typography variant="body2">{ex}</Typography>
//               </li>
//             ))}
//           </ul>
//         </Paper>
//       ))}

//       <Divider sx={{ my: 3 }} />

//       {/* Negative Clusters */}
//       <Typography variant="h6" gutterBottom>
//         ⚠️ Negative Themes
//       </Typography>
//       {Object.entries(result.negative_clusters || {}).map(([id, c]) => (
//         <Paper key={id} sx={{ p: 2, mb: 2, background: "#ffebee" }}>
//           <Chip
//             label={`Cluster #${id}`}
//             color="error"
//             size="small"
//             sx={{ mb: 1 }}
//           />
//           <Typography fontWeight="bold">{c.summary}</Typography>
//           <ul>
//             {c.examples.map((ex, idx) => (
//               <li key={idx}>
//                 <Typography variant="body2">{ex}</Typography>
//               </li>
//             ))}
//           </ul>
//         </Paper>
//       ))}
//     </Box>
//   );
// }

// src/components/ClustersPage.jsx
import { Box, Paper, Typography, Button, Chip, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

export default function ClustersPage() {
  const { result } = useAnalysis();
  const navigate = useNavigate();

  if (!result) {
    return (
      <Box p={4}>
        <Typography variant="h5">No data available ❗</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </Button>
      </Box>
    );
  }

  const { positive_clusters, negative_clusters, suggestions } = result;

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🧩 Detailed Cluster Insights
      </Typography>

      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
        ← Back to Dashboard
      </Button>

      {/* ⭐ POSITIVE THEMES */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ⭐ Positive Themes
        </Typography>

        {Object.entries(positive_clusters || {}).map(([id, c]) => (
          <Paper
            key={id}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
              background: "#e8f9f1",
              borderLeft: "8px solid #4caf50",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {c.summary}
            </Typography>

            {c.examples.map((ex, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{ mb: 1, pl: 1.5, borderLeft: "3px solid #a5e6c5" }}
              >
                • {ex}
              </Typography>
            ))}
          </Paper>
        ))}
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* ⚠ NEGATIVE THEMES */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ⚠ Negative Themes
        </Typography>

        {Object.entries(negative_clusters || {}).map(([id, c]) => (
          <Paper
            key={id}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
              background: "#ffebee",
              borderLeft: "8px solid #f44336",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {c.summary}
            </Typography>

            {c.examples.map((ex, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{ mb: 1, pl: 1.5, borderLeft: "3px solid #f7b3b3" }}
              >
                • {ex}
              </Typography>
            ))}
          </Paper>
        ))}
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* 💡 VIEWER SUGGESTIONS */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #fff7e0 0%, #ffffff 100%)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          💡 Viewer Suggestions & Requests
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {suggestions.overview}
        </Typography>

        {suggestions.examples.map((ex, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{ mb: 1, pl: 1.5, borderLeft: "3px solid #ffd699" }}
          >
            • {ex}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}
