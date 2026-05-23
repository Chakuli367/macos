import { Label } from 'src/components/label';
import { Timeline, People, Checklist, SmartToy, AccountCircle, Lock } from "@mui/icons-material";

export const navData = [
  { title: 'Dashboard', path: '/', icon: <SmartToy fontSize="medium" /> },
  {
    title: 'Your Lessons',
    path: '/user',
    icon: <Timeline fontSize="medium" />,
  },
  { title: 'Community', path: '/products', icon: <People fontSize="medium" /> },
  { title: 'Action Tracker', path: '/blog', icon: <Checklist fontSize="medium" /> },
  { title: 'Your Profile', path: '/profile', icon: <AccountCircle fontSize="medium" /> },
];
