import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function NavDesktop({ sx, data, layoutQuery }: any) {
  const theme = useTheme();
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenNav = (e: CustomEvent) => {
      const nextPath = e.detail;
      setHighlightedPath(nextPath);
      setTimeout(() => setHighlightedPath(null), 100000);
    };
    window.addEventListener('openNav', handleOpenNav as EventListener);
    return () => window.removeEventListener('openNav', handleOpenNav as EventListener);
  }, []);

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        background: 'rgba(60, 20, 120, 0.95)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
        ...sx,
      }}
    >
      <NavContent data={data} highlightedPath={highlightedPath} />
    </Box>
  );
}

export function NavMobile({ sx, data, open, onClose }: any) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(open);
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);

  // Sync with external open prop when NOT in autoMode
  useEffect(() => {
    if (!autoMode) {
      setIsOpen(open);
    }
  }, [open, autoMode]);

  useEffect(() => {
    if (open && !autoMode) onClose();
  }, [pathname]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleOpenNav = (e: CustomEvent) => {
      const nextPath = e.detail;
      setAutoMode(true);
      setIsOpen(true);
      setHighlightedPath(nextPath);

      // Clear any existing timer
      if (timer) clearTimeout(timer);

      // Automatically close after 4 seconds
      timer = setTimeout(() => {
        setIsOpen(false);
        setHighlightedPath(null);
        setAutoMode(false);
      }, 4000);
    };

    window.addEventListener('openNav', handleOpenNav as EventListener);
    return () => {
      window.removeEventListener('openNav', handleOpenNav as EventListener);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleOnboardingComplete = () => {
      console.log('🎉 Onboarding complete - resetting nav');
      setAutoMode(false);
      setIsOpen(false);
      setHighlightedPath(null);
    };
    
    window.addEventListener('onboardingComplete', handleOnboardingComplete as EventListener);
    return () => window.removeEventListener('onboardingComplete', handleOnboardingComplete as EventListener);
  }, []);

  const handleClose = () => {
    console.log('Nav close attempted, autoMode:', autoMode);
    if (!autoMode) {
      setIsOpen(false);
      onClose();
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          background: 'rgba(60, 20, 120, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          ...sx,
        },
      }}
    >
      <NavContent data={data} highlightedPath={highlightedPath} />
    </Drawer>
  );
}

export function NavContent({ data, highlightedPath }: any) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ mb: 4, px: 2 }}>
        <Box sx={{ typography: 'h3', fontWeight: 'bold', color: '#fff' }}>GOALGRID</Box>
      </Box>

      <Scrollbar fillContent>
        <Box component="nav" sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <Box component="ul" sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            {data.map((item: any) => {
              const isActived = item.path === pathname;
              const isHighlighted = item.path === highlightedPath;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    data-nav={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: '#ffffff',
                      minHeight: 44,
                      backgroundColor: isHighlighted
                        ? 'rgba(255,255,0,0.4)'
                        : isActived
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'transparent',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: isActived
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>
                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {item.title}
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>
    </>
  );
}