import React, { createContext, useLayoutEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../pages/ApiBaseUrl";
import { dark, lightThemeVars  } from "../vars";
import less from "less";

export const ThemeContext = createContext(null);
type DarkModeState = "dark" | "light";
const ChangeThem:React.FC<any> = (props: any) => {
  const {t} = useTranslation()
  const preferDarkQuery = "(prefers-color-scheme: dark)";
  const [userName] = useState(() => window.localStorage.getItem("user_id"));
  //@ts-ignore
  const [mode, setMode] = useState<DarkModeState>(() => {
    const lsVal = window.localStorage.getItem("colorMode");
    const id = localStorage.getItem("user_id");
    const newLightThemeVars = {
      ...lightThemeVars,
      "@font-family":t("Font_family")
    }
    const newDarkThemeVars = {
      ...dark,
      "@font-family":t("Font_family")
    }
    if (id) {
      if (lsVal) {
        if (lsVal === "dark") {
          //@ts-ignore
          window.less.modifyVars(newDarkThemeVars);

          return "dark";
        } else {
          //@ts-ignore
          window.less.modifyVars(newLightThemeVars);
          return "light";
        }
        //   return lsVal === "dark" ? "dark" : "light";
      } else {
        return window.matchMedia(preferDarkQuery).matches ? "dark" : "light";
      }
    }
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(preferDarkQuery);
    const handleChange = () => {
      if (mediaQuery.matches) {
        //@ts-ignore
        window.less.modifyVars(dark);
        setMode("dark");
      } else {
        //@ts-ignore
        window.less.modifyVars(lightThemeVars);
        setMode("light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  useLayoutEffect(() => {
    (async () => {
      if (userName) {
        await axiosInstance
          .get(
            `/user_account/user_profile/${userName}/?expand=*&fields=user_theme`
          )
          .then((res) => {
            const data = res?.data;
            if (data?.user_theme?.type === "dark") {
              //@ts-ignore
              window.less.modifyVars(dark);
              setMode("dark");
            } else {
              //@ts-ignore
              window.less.modifyVars(lightThemeVars);
              setMode("light");
            }
          });
      } else {
        //@ts-ignore
        less.modifyVars(lightThemeVars);
      }
    })();
  }, [userName]);
 

  // 
  const value = useMemo(() => [mode, setMode], [mode, setMode]);
  return (
    <ThemeContext.Provider
      //@ts-ignore
      value={value}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
export { ChangeThem };
