import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Chip,
  Grid,
  Pagination,
} from "@mui/material";
import { useAnalysis } from "../context/AnalysisContext";

// =============================================================
// PREMIUM COMMENT CARD COMPONENT
// =============================================================
const PremiumCommentCard = ({ text, sentiment }) => {
  const isPositive = sentiment === "positive";
  const isNegative = sentiment === "negative";

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        mb: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        background: isPositive
          ? "linear-gradient(135deg, #E8FFF3, #FFFFFF)"
          : isNegative
          ? "linear-gradient(135deg, #FFF0F0, #FFFFFF)"
          : "linear-gradient(135deg, #F7F7F7, #FFFFFF)",
        borderLeft: isPositive
          ? "6px solid #2ecc71"
          : isNegative
          ? "6px solid #e74c3c"
          : "6px solid #b2bec3",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        maxWidth: "100%",
      }}
    >
      {/* ICON BADGE */}
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: isPositive
            ? "#2ecc71"
            : isNegative
            ? "#e74c3c"
            : "#b2bec3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.1rem",
          flexShrink: 0,
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
        }}
      >
        {isPositive ? "👍" : isNegative ? "⚠️" : "💬"}
      </Box>

      {/* TEXT */}
      <Typography
        variant="body1"
        sx={{
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "#2d3436",
          wordBreak: "break-word",
        }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

// =============================================================
// MAIN COMPONENT
// =============================================================
export default function ExploreComments() {
  const { result } = useAnalysis();

  const [searchTerm, setSearchTerm] = useState("");
  const [topNPositive, setTopNPositive] = useState(3);
  const [topNNegative, setTopNNegative] = useState(3);
  const [page, setPage] = useState(1);

  const commentsPerPage = 6;

  if (!result) return null;

  const allComments = result.all_comments || [];

  // ------------------------------------------------------------
  // SEARCH FILTER
  // ------------------------------------------------------------
  const searchResults = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return [];
    return allComments.filter((c) => c.text.toLowerCase().includes(t));
  }, [searchTerm, allComments]);

  // Highlight matches
  const highlight = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  // ------------------------------------------------------------
  // TOP POSITIVE / NEGATIVE
  // ------------------------------------------------------------
  const topPositive = useMemo(() => {
    const n = Number(topNPositive) || 0;
    return [...allComments]
      .filter((c) => c.sentiment === "positive")
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }, [allComments, topNPositive]);

  const topNegative = useMemo(() => {
    const n = Number(topNNegative) || 0;
    return [...allComments]
      .filter((c) => c.sentiment === "negative")
      .sort((a, b) => a.score - b.score)
      .slice(0, n);
  }, [allComments, topNNegative]);

  // ------------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------------
  const paginatedComments = useMemo(() => {
    const start = (page - 1) * commentsPerPage;
    return allComments.slice(start, start + commentsPerPage);
  }, [page, allComments]);

  const totalPages = Math.ceil(allComments.length / commentsPerPage);

  // =============================================================
  // UI LAYOUT
  // =============================================================
  return (
    <Box>
      <Grid container spacing={3}>
        {/* =========================================================
            🔍 SEARCH UI — PREMIUM COMPACT CARD
        ========================================================= */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #F8FAFF, #FFFFFF)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
              🔍 Search by Keyword
            </Typography>

            <TextField
              fullWidth
              placeholder="Search (hero, bgm, boring, song...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "48px",
                  borderRadius: "10px",
                  fontSize: "1rem",
                },
              }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
              {searchTerm && searchResults.length > 0
                ? `Found ${searchResults.length} comments`
                : searchTerm
                ? "No matching comments"
                : "Start typing to search"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {searchResults.map((c, idx) => (
                <PremiumCommentCard
                  key={idx}
                  text={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlight(c.text, searchTerm),
                      }}
                    />
                  }
                  sentiment={c.sentiment}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* =========================================================
            ⭐ TOP POSITIVE + ⚠️ TOP NEGATIVE — PREMIUM UI
        ========================================================= */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #FFF8E8, #FFFFFF)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
              ⭐ Top Positive & ⚠️ Top Negative
            </Typography>

            {/* Inputs */}
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Top Positive"
                size="small"
                value={topNPositive}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9]+$/.test(val)) {
                    setTopNPositive(val === "" ? "" : Number(val));
                  }
                }}
                sx={{ width: 150 }}
              />

              <TextField
                label="Top Negative"
                size="small"
                value={topNNegative}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9]+$/.test(val)) {
                    setTopNNegative(val === "" ? "" : Number(val));
                  }
                }}
                sx={{ width: 150 }}
              />
            </Box>

            <Grid container spacing={2}>
              {/* POSITIVE */}
              <Grid item xs={12} sm={6}>
                <Typography
                  color="success.main"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  ⭐ Positive
                </Typography>

                <Box>
                  {topPositive.map((c, idx) => (
                    <PremiumCommentCard
                      key={idx}
                      text={c.text}
                      sentiment={c.sentiment}
                    />
                  ))}
                </Box>
              </Grid>

              {/* NEGATIVE */}
              <Grid item xs={12} sm={6}>
                <Typography color="error.main" fontWeight="bold" sx={{ mb: 1 }}>
                  ⚠️ Negative
                </Typography>

                <Box>
                  {topNegative.map((c, idx) => (
                    <PremiumCommentCard
                      key={idx}
                      text={c.text}
                      sentiment={c.sentiment}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================================
          📜 ALL COMMENTS — PREMIUM LIST
      ========================================================= */}
      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #FAFAFA, #FFFFFF)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
          📜 All Comments ({allComments.length})
        </Typography>

        {/* Top Pagination */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>

        {/* COMMENTS */}
        <Box>
          {paginatedComments.map((c, idx) => (
            <PremiumCommentCard
              key={idx}
              text={c.text}
              sentiment={c.sentiment}
            />
          ))}
        </Box>

        {/* Bottom Pagination */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>
    </Box>
  );
}
