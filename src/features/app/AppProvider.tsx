import { useStore } from "@tanstack/react-store";
import type { PropsWithChildren } from "react";

import { LazyAnimate } from "@/features/animate";
import AntdProvider from "@/features/antd/AntdProvider.tsx";
import { themeActions, themeStore } from "@/store/theme";

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const AppProvider = ({ children }: PropsWithChildren) => {
  const themeScheme = useStore(themeStore, (s) => s.themeScheme);
  const darkMode = useStore(themeStore, (s) => s.darkMode);
  useEffect(() => {
    if (themeScheme === "system") {
      const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);
      const handler = (event: MediaQueryListEvent) => {
        themeActions.setDarkMode(event.matches);
      };
      mediaQuery.addEventListener("change", handler);
      if (mediaQuery.matches !== darkMode) {
        handler({
          matches: mediaQuery.matches,
        } as MediaQueryListEvent);
      }
      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    }
  }, [themeScheme, darkMode]);

  // 确保 html.dark 与 store 的 darkMode 始终一致
  useEffect(() => {
    themeActions.toggleCssDarkMode(darkMode);
  }, [darkMode]);
  return (
    <AntdProvider>
      <LazyAnimate>{children}</LazyAnimate>
    </AntdProvider>
  );
};

export default AppProvider;
