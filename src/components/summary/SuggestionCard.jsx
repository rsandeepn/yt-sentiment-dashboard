// import { useState } from "react";
// import { Paper, Typography, Box, Chip, Button, Collapse } from "@mui/material";

// export default function SuggestionCard({ suggestions }) {
//   if (!suggestions) return null;

//   const [open, setOpen] = useState(false);

//   const clusterEntries = Object.entries(suggestions.clusters || {});
//   const sampleComments = suggestions.examples || [];

//   return (
//     <Paper
//       sx={{
//         p: 3,
//         mt: 3,
//         borderRadius: 3,
//         background: "#fff8e1",
//         borderLeft: "6px solid #ff9800",
//       }}
//       elevation={2}
//     >
//       {/* Header */}
//       <Typography variant="h6" fontWeight="bold" gutterBottom>
//         💡 Viewer Suggestions & Improvement Ideas
//       </Typography>

//       <Typography variant="body1" sx={{ mb: 2 }}>
//         {suggestions.overview}
//       </Typography>

//       {/* Suggestion THEMES */}
//       {clusterEntries.length > 0 && (
//         <>
//           <Typography variant="subtitle1" fontWeight="600" gutterBottom>
//             Key Improvement Themes:
//           </Typography>

//           {clusterEntries.map(([id, cluster]) => (
//             <Paper
//               key={id}
//               sx={{
//                 p: 2,
//                 px: 3,
//                 mb: 2,
//                 background: "#fff3cd",
//                 borderRadius: 2,
//               }}
//             >
//               <Typography variant="subtitle2" fontWeight="bold">
//                 🔸 Theme {Number(id) + 1}: {cluster.summary}
//               </Typography>
//             </Paper>
//           ))}
//         </>
//       )}

//       {/* Expandable comments */}
//       <Button variant="outlined" onClick={() => setOpen(!open)} sx={{ mt: 2 }}>
//         {open ? "Hide Comments" : "Show Related Comments"}
//       </Button>

//       <Collapse in={open}>
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="subtitle1" fontWeight="600" gutterBottom>
//             📌 Sample Viewer Comments
//           </Typography>

//           {sampleComments.map((c, idx) => (
//             <Typography
//               key={idx}
//               variant="body2"
//               sx={{ mb: 0.8, pl: 1, borderLeft: "2px solid #ffcc80" }}
//             >
//               • {c}
//             </Typography>
//           ))}
//         </Box>
//       </Collapse>
//     </Paper>
//   );
// }

import { useState } from "react";
import { Paper, Typography, Button, Collapse, Box } from "@mui/material";

export default function PremiumSuggestionCard({ suggestions }) {
  const [open, setOpen] = useState(false);

  if (!suggestions) return null;

  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #fff8dc, #ffffff)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        borderLeft: "6px solid #ffb300",
      }}
    >
      {/* TITLE */}
      <Typography variant="h5" fontWeight="700" gutterBottom>
        💡 Viewer Suggestions & Improvement Ideas
      </Typography>

      {/* OVERVIEW */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        {suggestions.overview}
      </Typography>

      {/* TOGGLE BUTTON */}
      <Button
        variant="outlined"
        onClick={() => setOpen(!open)}
        sx={{
          mt: 1,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        {open ? "Hide Related Comments" : "Show Related Comments"}
      </Button>

      {/* EXPANDABLE COMMENT LIST */}
      <Collapse in={open}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            📌 Sample Viewer Comments
          </Typography>

          {suggestions.examples.map((text, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                mb: 1,
                pl: 1,
                borderLeft: "2px solid #ffcc80",
                lineHeight: 1.6,
              }}
            >
              • {text}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}
