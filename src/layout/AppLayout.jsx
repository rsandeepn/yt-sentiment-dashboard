// src/layout/AppLayout.jsx
import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => setDark(!dark);

  return (
    <Box sx={{ display: "flex", background: dark ? "#121212" : "#f4f6f8" }}>
      {/* TOP NAVBAR */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1400 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            YT Sentiment AI
          </Typography>

          <Typography variant="body2" sx={{ mr: 1 }}>
            {dark ? "Dark" : "Light"}
          </Typography>
          <Switch checked={dark} onChange={toggleTheme} color="default" />
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Navigation
          </Typography>

          <List>
            <ListItemButton onClick={() => navigate("/")}>
              <DashboardIcon sx={{ mr: 2 }} />
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/explore")}>
              <SearchIcon sx={{ mr: 2 }} />
              <ListItemText primary="Explore Comments" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
