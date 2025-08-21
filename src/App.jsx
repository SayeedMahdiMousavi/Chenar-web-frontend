import {
  QueryClientProvider,
  QueryClient,
} from "react-query";

import { useTranslation } from "react-i18next";
import Routers from "./pages/Router/Route";
import { App as AntApp, ConfigProvider } from "antd";
import { useDarkMode } from "./Hooks/useDarkMode";
import { lightTheme, darkTheme } from './theme';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: (failureCount, error) => {
        const res = error?.response;
        return error?.message === "Network Error" ||
          res?.status === 403 ||
          res?.status === 500 ||
          res?.status === 404
          ? false
          : failureCount > 2
          ? false
          : true;
      },
    },
    mutations: {},
  },
});

const App = () => {
  const { t } = useTranslation();
  const [mode] = useDarkMode();
  const selectedTheme = mode === "dark" ? darkTheme : lightTheme;

  console.log("t(Dir)", t("Dir"));
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <ConfigProvider theme={selectedTheme}>
          <AntApp>
            <Routers />
          </AntApp>
        </ConfigProvider>
      </div>
    </QueryClientProvider>
  );
};

export default App;