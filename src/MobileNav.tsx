import React, { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction, Paper, Box, IconButton, Typography, Dialog, DialogContent } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, School, Person, People, Checklist, WarningRounded, CloseRounded, SupportAgentRounded } from "@mui/icons-material";
import Support from "./support";

const leftTabs = [
  { label: 'Home', id: 'dashboard', icon: <Home />, path: '/' },
  { label: 'Scripts', id: 'actionPlan', icon: <School />, path: '/user' },
  { label: 'Community', id: 'connections', icon: <People />, path: '/products' },
];

const rightTabs = [
  { label: 'Support', id: 'supportNav', icon: <SupportAgentRounded />, action: 'support' as const },
  { label: 'Actions', id: 'planTips', icon: <Checklist />, path: '/blog' },
  { label: 'Profile', id: 'createGoalButton', icon: <Person />, path: '/profile' },
];
const tabs = [...leftTabs, ...rightTabs.filter((tab) => 'path' in tab)];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(0);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.path === location.pathname);
    if (currentIndex !== -1) setActiveTab(currentIndex);
  }, [location.pathname]);

  useEffect(() => {
    console.log('📱 Bottom Nav IDs available:', tabs.map(t => `#${t.id}`));
    setTimeout(() => {
      tabs.forEach(tab => {
        const element = document.querySelector(`#${tab.id}`);
        console.log(`Element #${tab.id}:`, element ? '✅ Found' : '❌ Not found');
      });
    }, 500);
  }, []);

  if (location.pathname === '/sign-in') return null;

  const handleChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
    navigate(tabs[newValue].path);
  };

  return (
    <>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderRadius: 0,
          backdropFilter: 'blur(12px)',
          background: 'rgba(36, 0, 70, 0.96)',
          borderTop: '1px solid rgba(168, 85, 247, 0.25)',
          boxShadow: 'none',
          flexShrink: 0,
          zIndex: 10,
        }}
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={handleChange}
          sx={{
            bgcolor: "transparent",
            height: "72px",
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            alignItems: 'end',
            px: 1,

            "& .Mui-selected": {
              color: "#fbbf24 !important",
              "& .MuiSvgIcon-root": {
                transform: "scale(1.12)",
                filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))",
              },
            },

            "& .MuiBottomNavigationAction-root": {
              color: 'rgba(233, 213, 255, 0.65)',
              position: 'relative',
              zIndex: 1,
              minWidth: 'auto',
              maxWidth: 'none',
              paddingTop: '12px',
              paddingBottom: '10px',
              paddingLeft: '4px',
              paddingRight: '4px',
            },

            "& .MuiBottomNavigationAction-label": {
              fontWeight: 600,
              fontSize: "0.62rem",
              marginTop: "3px",
              transition: "all 0.25s ease",
              lineHeight: 1.1,
              "&.Mui-selected": {
                fontSize: "0.68rem",
                fontWeight: 700,
              },
            },

            "& .MuiSvgIcon-root": {
              fontSize: "30px",
              transition: "all 0.25s ease",
            },
          }}
        >
          {leftTabs.map((tab, index) => (
            <BottomNavigationAction
              key={tab.label}
              value={index}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              sx={{
                position: 'relative !important',
                zIndex: '100 !important',
              }}
              data-driver-target={tab.id}
            />
          ))}
          <Box sx={{ width: '100%' }} />
          {rightTabs.map((tab, index) => (
            'path' in tab ? (
              <BottomNavigationAction
                key={tab.label}
                value={leftTabs.length + rightTabs.slice(0, index + 1).filter((item) => 'path' in item).length - 1}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                sx={{
                  position: 'relative !important',
                  zIndex: '100 !important',
                }}
                data-driver-target={tab.id}
              />
            ) : (
              <BottomNavigationAction
                key={tab.label}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                onClick={() => setIsSupportOpen(true)}
                sx={{
                  position: 'relative !important',
                  zIndex: '100 !important',
                  color: 'rgba(233, 213, 255, 0.65)',
                }}
              />
            )
          ))}
        </BottomNavigation>

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -28%)',
            zIndex: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <IconButton
            aria-label="SOS"
            id="sosButton"
            onClick={() => setIsSupportOpen(true)}
            sx={{
              width: 68,
              height: 68,
              color: '#fff7ed',
              background: '#e11d48',
              border: '3px solid #fb7185',
              boxShadow: '0 10px 22px rgba(225, 29, 72, 0.38)',
              opacity: 1,
              '&:hover': {
                background: '#be123c',
              },
            }}
          >
            <WarningRounded sx={{ fontSize: 34 }} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: '#ffe4e6',
              fontWeight: 800,
              letterSpacing: '0.08em',
              fontSize: '0.62rem',
            }}
          >
            SOS
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#020617',
            backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 1) 100%)',
          },
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            px: 2,
            pt: 2,
            bgcolor: 'rgba(2, 6, 23, 0.88)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <IconButton
            aria-label="Close support"
            onClick={() => setIsSupportOpen(false)}
            sx={{
              color: '#fff',
              bgcolor: 'rgba(148, 163, 184, 0.16)',
              '&:hover': {
                bgcolor: 'rgba(148, 163, 184, 0.26)',
              },
            }}
          >
            <CloseRounded />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
          <Support />
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
          flexShrink: 0
        }}
      />
    </>
  );
}
