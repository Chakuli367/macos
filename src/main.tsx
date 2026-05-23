import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';
import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { logEvent } from "firebase/analytics";
import { analytics } from "./lib/firebase";

// ----------------------------------------------------------------------

const AppLayout = () => {
  const location = useLocation();
  const pathsToHideNav = ['/conversation', '/creategoal', '/signin'];
  const isNavHidden = pathsToHideNav.includes(location.pathname.toLowerCase());

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.body.style.fontFamily = "'Poppins', sans-serif";

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }
    // ✅ ADD viewport-fit=cover FOR SAFE AREA SUPPORT
    viewport.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
  }, []);

  useEffect(() => {
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
    });
  }, [location]);

  useEffect(() => {
    if (!analytics) return;
    logEvent(analytics, "test_event_manual", { test: "working" });
  }, []);

  const wrapperStyle: React.CSSProperties = {
    overflowX: 'hidden',
    width: '100%',
    maxWidth: 'none',
    padding: isMobile ? '0 10px' : '0 40px',
  };

  const contentStyle: React.CSSProperties = {
    margin: '0 auto',
    maxWidth: '1400px',
    paddingBottom: '0px',
    marginTop: '0px',
  };

  return (
    <App>
      <div style={wrapperStyle}>
        <div style={contentStyle}>
          <Outlet />
        </div>
      </div>
    </App>
  );
};

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: AppLayout,
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
        <RouterProvider router={router} />

  </StrictMode>
);