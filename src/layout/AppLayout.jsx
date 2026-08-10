import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function BrandMark({ inverse = false }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          width: 36,
          height: 26,
          borderRadius: "8px",
          bgcolor: "primary.main",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 5px 14px rgba(230, 33, 60, 0.24)",
        }}
      >
        <PlayArrowRoundedIcon sx={{ color: "white", fontSize: 20 }} />
      </Box>
      <Typography sx={{ color: inverse ? "#fff" : "text.primary", fontWeight: 760, letterSpacing: "-0.035em", fontSize: "1.08rem" }}>
        CommentScope
      </Typography>
    </Stack>
  );
}

export default function AppLayout({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const accountLabel = displayName || user?.email || "Account";

  const go = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: "rgba(255,255,255,0.94)", borderBottom: "1px solid", borderColor: "divider", backdropFilter: "blur(14px)" }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1480 }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 3 }}>
            <Box onClick={() => go("/")} sx={{ cursor: "pointer", flexShrink: 0 }}>
              <BrandMark />
            </Box>

            <Stack direction="row" spacing={0.5} sx={{ ml: { md: 3 }, display: { xs: "none", sm: "flex" } }}>
              <Button
                color="secondary"
                startIcon={<InsightsRoundedIcon />}
                onClick={() => go("/")}
                sx={{ bgcolor: location.pathname === "/" ? "#f1f1ef" : "transparent" }}
              >
                Analyze
              </Button>
              <Button
                color="secondary"
                startIcon={<TipsAndUpdatesRoundedIcon />}
                onClick={() => go("/suggestions")}
                sx={{ bgcolor: location.pathname === "/suggestions" ? "#f1f1ef" : "transparent" }}
              >
                Audience Suggestions
              </Button>
              <Button
                color="secondary"
                startIcon={<HistoryRoundedIcon />}
                onClick={() => go("/history")}
                sx={{ bgcolor: location.pathname === "/history" ? "#f1f1ef" : "transparent" }}
              >
                History
              </Button>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={user?.email || accountLabel}>
              <Button
                color="secondary"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                sx={{ minWidth: 0, px: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13, fontWeight: 700 }}>
                  {accountLabel.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ ml: 1, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", display: { xs: "none", md: "block" } }}>
                  {accountLabel}
                </Typography>
              </Button>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={logout}>Sign out</MenuItem>
            </Menu>
          </Toolbar>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "flex", sm: "none" }, pb: 1, overflowX: "auto" }}
          >
            <Button
              color="secondary"
              onClick={() => go("/")}
              sx={{ bgcolor: location.pathname === "/" ? "#f1f1ef" : "transparent", flexShrink: 0 }}
            >
              Analyze
            </Button>
            <Button
              color="secondary"
              onClick={() => go("/suggestions")}
              sx={{ bgcolor: location.pathname === "/suggestions" ? "#f1f1ef" : "transparent", flexShrink: 0 }}
            >
              Audience Suggestions
            </Button>
            <Button
              color="secondary"
              onClick={() => go("/history")}
              sx={{ bgcolor: location.pathname === "/history" ? "#f1f1ef" : "transparent", flexShrink: 0 }}
            >
              History
            </Button>
          </Stack>
        </Container>
      </AppBar>

      <Box component="main">{children}</Box>

      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "#fff", mt: 8 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1480, py: 3 }}>
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
