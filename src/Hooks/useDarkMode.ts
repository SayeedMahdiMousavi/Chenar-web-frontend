import { useContext } from 'react';
import { ThemeContext } from '../context/ChangeThem';
// import { dark } from "../vars";

type DarkModeState = 'dark' | 'light';
// type SetDarkModeState = React.Dispatch<React.SetStateAction<DarkModeState>>;
export const useDarkMode = () => {
  //@ts-ignore
  const [mode, setMode] = useContext(ThemeContext);
  // const preferDarkQuery = "(prefers-color-scheme: dark)";
  // const [mode, setMode] = React.useState<DarkModeState>(() => {
  //   const lsVal = window.localStorage.getItem("colorMode");
  //   if (lsVal) {
  //     if (lsVal === "dark") {
  //       //@ts-ignore
  //       window.less.modifyVars(dark);

  //       return "dark";
  //     } else {
  //       return "light";
  //     }
  //     //   return lsVal === "dark" ? "dark" : "light";
  //   } else {
  //     return window.matchMedia(preferDarkQuery).matches ? "dark" : "light";
  //   }
  // });

  // React.useEffect(() => {
  //   const mediaQuery = window.matchMedia(preferDarkQuery);
  //   const handleChange = () => {
  //     if (mediaQuery.matches) {
  //       //@ts-ignore
  //       window.less.modifyVars(dark);
  //       setMode("dark");
  //     } else {
  //       //@ts-ignore
  //       window.less.modifyVars({});
  //       setMode("light");
  //     }
  //   };
  //   mediaQuery.addEventListener("change", handleChange);
  //   return () => mediaQuery.removeEventListener("change", handleChange);
  // }, []);

  // React.useEffect(() => {
  //   window.localStorage.setItem("colorMode", mode);
  // }, [mode]);

  // we're doing it this way instead of as an effect so we only
  // set the localStorage value if they explicitly change the default

  return [mode, setMode] as const;
};
