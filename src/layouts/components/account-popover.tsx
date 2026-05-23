// src/layouts/components/account-popover.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

interface AccountPopoverProps {
  data: {
    label: string;
    href: string;
  }[];
}

export function AccountPopover({ data }: AccountPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (href: string) => {
    handleClose();
    navigate(href.startsWith('/') ? href : `/${href}`);
  };

  return (
    <>
      <Tooltip title="AccounFDt">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar alt="User Avatar" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ elevation: 1, sx: { mt: 1.5, minWidth: 150 } }}
      >
        {data.map((item) => (
          <MenuItem key={item.label} onClick={() => handleNavigate(item.href)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
