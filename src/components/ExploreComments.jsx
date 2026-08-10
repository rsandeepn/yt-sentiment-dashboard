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
import { useAnalysis } from "../context/useAnalysis";

const HighlightedText = ({ text, term }) => {
  const query = term.trim();
  if (!query) return text;

  const parts = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, cursor);

  while (matchIndex !== -1) {
    parts.push(text.slice(cursor, matchIndex));
    parts.push(
      <mark key={`${matchIndex}-${cursor}`}>
        {text.slice(matchIndex, matchIndex + query.length)}
      </mark>,
    );
    cursor = matchIndex + query.length;
    matchIndex = lowerText.indexOf(lowerQuery, cursor);
  }

  parts.push(text.slice(cursor));
  return parts;
};

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
        borderRadius: 2,
        mb: 1.25,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        background: "#ffffff",
        borderLeft: isPositive
          ? "3px solid #168a45"
          : isNegative
            ? "3px solid #e6213c"
            : "3px solid #d97706",
        boxShadow: "none",
        maxWidth: "100%",
      }}
    >
      {/* ICON BADGE */}
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "9px",
          background: isPositive
            ? "#168a45"
            : isNegative
              ? "#e6213c"
              : "#d97706",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.1rem",
          flexShrink: 0,
          boxShadow: "none",
        }}
      >
        {isPositive ? "+" : isNegative ? "−" : "="}
      </Box>

      {/* TEXT */}
      <Typography
        variant="body1"
        sx={{
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "#343438",
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

  const allComments = useMemo(() => result?.all_comments || [], [result]);

  // ------------------------------------------------------------
  // SEARCH FILTER
  // ------------------------------------------------------------
  const searchResults = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return [];
    return allComments.filter((c) => c.text.toLowerCase().includes(t));
  }, [searchTerm, allComments]);

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

  if (!result) return null;

  // =============================================================
  // UI LAYOUT
  // =============================================================
  return (
    <Box>
      <Grid container spacing={3}>
        {/* =========================================================
            🔍 SEARCH UI — PREMIUM COMPACT CARD
        ========================================================= */}
        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              p: { xs: 2, md: 2.5 },
              boxSizing: "border-box",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
              Search comments
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

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
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
                  text={<HighlightedText text={c.text} term={searchTerm} />}
                  sentiment={c.sentiment}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* =========================================================
            ⭐ TOP POSITIVE + ⚠️ TOP NEGATIVE — PREMIUM UI
        ========================================================= */}
        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 3,
              background: "#ffffff",
              boxShadow: "none",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
              Comment highlights
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  color="success.main"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Most positive
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography color="error.main" fontWeight="bold" sx={{ mb: 1 }}>
                  Most critical
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
          p: { xs: 2, md: 2.5 },
          mt: 4,
          borderRadius: 3,
          background: "#ffffff",
          boxShadow: "none",
        }}
      >
        <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
          All comments ({allComments.length})
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
