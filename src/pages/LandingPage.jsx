import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import { Link as RouterLink } from "react-router-dom";
import { BrandMark } from "../layout/AppLayout";

const features = [
  {
    icon: <InsightsRoundedIcon />,
    title: "Sentiment at a glance",
    copy: "See positive, neutral, and negative reactions without reading every comment.",
  },
  {
    icon: <SearchRoundedIcon />,
    title: "Themes and keywords",
    copy: "Find recurring topics, repeated phrases, and the ideas your viewers care about.",
  },
  {
    icon: <LanguageRoundedIcon />,
    title: "Multilingual feedback",
    copy: "Bring audience reactions from multiple languages into one focused report.",
  },
];

const faqs = [
  {
    question: "What is a YouTube comment analyzer?",
    answer: "A YouTube comment analyzer turns public video comments into organized insights such as sentiment, common themes, keywords, and audience requests.",
  },
  {
    question: "Is CommentScope free to use?",
    answer: "Yes. You can create an account and start analyzing public YouTube video comments for free.",
  },
  {
    question: "Does CommentScope work with multilingual comments?",
    answer: "Yes. CommentScope is designed to help summarize and compare audience feedback across multiple languages.",
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "rgba(255,255,255,0.94)",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(14px)",
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1240, py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <BrandMark />
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="/login" color="secondary">
                Sign in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Analyze comments free
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box component="main">
        <Box
          sx={{
            bgcolor: "#18181b",
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background: "rgba(230,33,60,0.2)",
              filter: "blur(24px)",
              top: -330,
              right: -100,
            },
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: 1240, py: { xs: 9, md: 14 }, position: "relative" }}>
            <Box sx={{ maxWidth: 820 }}>
              <Typography variant="overline" sx={{ color: "#ff8b9b", fontWeight: 750, letterSpacing: "0.14em" }}>
                Free YouTube comment analyzer
              </Typography>
              <Typography component="h1" variant="h1" sx={{ mt: 1.5, mb: 3, maxWidth: 800 }}>
                Turn YouTube comments into clear audience insights.
              </Typography>
              <Typography sx={{ color: "#c9c9ce", fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 700, lineHeight: 1.75 }}>
                CommentScope analyzes public YouTube comments for sentiment, themes, keywords, multilingual feedback, and actionable content ideas.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={4}>
                <Button component={RouterLink} to="/register" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
                  Analyze comments free
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)", "&:hover": { borderColor: "white" } }}
                >
                  Open your dashboard
                </Button>
              </Stack>
              <Typography variant="caption" sx={{ display: "block", color: "#96969d", mt: 2 }}>
                No credit card required. Analyze public YouTube videos.
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth={false} sx={{ maxWidth: 1240, py: { xs: 7, md: 10 } }}>
          <Box component="section" aria-labelledby="features-title">
            <Typography variant="overline" color="primary" fontWeight={750}>
              Audience intelligence
            </Typography>
            <Typography id="features-title" component="h2" variant="h2" mt={0.75} maxWidth={720}>
              Understand what your viewers are really saying
            </Typography>
            <Typography color="text.secondary" mt={2} mb={4.5} maxWidth={720} lineHeight={1.75}>
              Replace hours of manual comment reading with a structured report you can use to plan better videos, respond to viewers, and spot new opportunities.
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
              {features.map((feature) => (
                <Paper key={feature.title} sx={{ p: 3.5, minHeight: 230 }}>
                  <Box sx={{ color: "primary.main", mb: 3 }}>{feature.icon}</Box>
                  <Typography component="h3" variant="h4" mb={1.25}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" lineHeight={1.75}>
                    {feature.copy}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Box component="section" aria-labelledby="how-title" sx={{ py: { xs: 8, md: 11 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 9 }} alignItems={{ md: "center" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" color="primary" fontWeight={750}>
                  How it works
                </Typography>
                <Typography id="how-title" component="h2" variant="h2" mt={0.75}>
                  From video link to useful report
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ flex: 1 }}>
                {[
                  ["1", "Paste a public YouTube video URL."],
                  ["2", "CommentScope analyzes the available comments."],
                  ["3", "Explore sentiment, themes, keywords, and suggestions."],
                ].map(([number, copy]) => (
                  <Stack key={number} direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: "primary.main", color: "white", display: "grid", placeItems: "center", fontWeight: 750, flexShrink: 0 }}>
                      {number}
                    </Box>
                    <Typography fontWeight={650}>{copy}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Paper component="section" sx={{ bgcolor: "#18181b", color: "white", p: { xs: 3.5, md: 6 }, mb: { xs: 8, md: 11 } }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <TipsAndUpdatesRoundedIcon sx={{ color: "#ff8b9b" }} />
                  <Typography variant="overline" sx={{ color: "#ff8b9b", fontWeight: 750 }}>
                    Start with your next video
                  </Typography>
                </Stack>
                <Typography component="h2" variant="h3">
                  Make audience feedback easier to act on.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/register" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ flexShrink: 0 }}>
                Create free account
              </Button>
            </Stack>
          </Paper>

          <Box component="section" aria-labelledby="faq-title">
            <Typography variant="overline" color="primary" fontWeight={750}>
              Frequently asked questions
            </Typography>
            <Typography id="faq-title" component="h2" variant="h2" mt={0.75} mb={4}>
              YouTube comment analysis, explained
            </Typography>
            <Stack spacing={2}>
              {faqs.map((item) => (
                <Paper key={item.question} sx={{ p: 3 }}>
                  <Typography component="h3" variant="h5" mb={1}>
                    {item.question}
                  </Typography>
                  <Typography color="text.secondary" lineHeight={1.75}>
                    {item.answer}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "#fff" }}>
        <Container maxWidth={false} sx={{ maxWidth: 1240, py: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1}>
            <BrandMark />
            <Typography variant="caption" color="text.secondary">
              Independent audience analytics. Not affiliated with YouTube.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
