import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

export const tokens = {
  light: {
    algorithm: defaultAlgorithm,
    token: {
      colorPrimary: '#21c0ad',
      borderRadius: 4,
    },
    components: {
      Button: {
        borderRadius: 7,
      },
    },
  },
  dark: {
    algorithm: darkAlgorithm,
    token: {
      colorPrimary: '#0E262E',
      borderRadius: 4,
      colorBgElevated: '#273053',
      colorBgContainer: '#1E2746',
      colorBgLayout: '#1C233D',
    },
    components: {
      Button: {
        borderRadius: 7,
      },
    },
  },
} as const;

export const lessVars = {
  light: {
    '@primary-color': '#21c0ad',
    '@text-color': '#727272',
    '@font-family': 'KALAMEH',
    '@border-radius-base': '7px',
    '@btn-border-radius-base': '7px',
    '@checkbox-border-radius': '4px',
  },
  dark: {
    '@primary-color': '#0E262E',
    '@text-color': '#d9d9d9',
    '@font-family': 'KALAMEH',
    '@border-radius-base': '7px',
    '@btn-border-radius-base': '7px',
    '@checkbox-border-radius': '4px',
  },
} as const;
