import type { Theme } from '@mui/material/styles';
import { createTheme as createMuiTheme } from '@mui/material/styles';

import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components as baseComponents } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';

import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export const baseTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        ...palette.light,
        background: {
          default: '#6A0DAD', // yellow for reference in MUI components
          paper: '#FFFFFF',   // keep cards white
        },
      },
      shadows: shadows.light,
      customShadows: customShadows.light,
      components: {
        ...baseComponents,
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background: '#6A0DAD', // forces entire page background yellow
              minHeight: '100vh',
            },
          },
        },
      },
    },
  },
  components: baseComponents,
  typography,
  shape: { borderRadius: 8 },
  cssVariables: themeConfig.cssVariables,
};

// ----------------------------------------------------------------------

type CreateThemeProps = {
  themeOverrides?: ThemeOptions;
};

export function createTheme({ themeOverrides = {} }: CreateThemeProps = {}): Theme {
  const theme = createMuiTheme(baseTheme, themeOverrides);

  return theme;
}
