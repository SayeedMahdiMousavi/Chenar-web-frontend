import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;

export const lightTheme = {
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
};

// Dark Theme
export const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#21c0ad',
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
};
