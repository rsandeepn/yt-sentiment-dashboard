// // src/components/ThemePage.jsx
// import { Box, Paper, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAnalysis } from "../context/AnalysisContext";
// import ThemeCard from "./summary/ThemeCard";

// export default function ThemePage() {
//   const { result } = useAnalysis();
//   const navigate = useNavigate();

//   if (!result || !result.themes) {
//     return (
//       <Box p={4}>
//         <Typography variant="h5" gutterBottom>
//           No theme insights available ❗
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
//         🎯 Comment Theme Insights
//       </Typography>

//       <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
//         ← Back to Dashboard
//       </Button>

//       <Paper sx={{ p: 3 }}>
//         <ThemeCard themes={result.themes} />
//       </Paper>
//     </Box>
//   );
// }

// src/components/ThemePage.jsx
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

export default function ThemePage() {
  const { result } = useAnalysis();
  const navigate = useNavigate();

  if (!result) {
    return (
      <Box p={4}>
        <Typography variant="h5">No theme overview available.</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎯 Theme Overview
      </Typography>

      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
        ← Back to Dashboard
      </Button>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #eef6ff 0%, #ffffff 100%)",
        }}
      >
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
        >
          {result.theme_overview}
        </Typography>
      </Paper>
    </Box>
  );
}
