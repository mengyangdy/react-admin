import { Outlet, useRouterState } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import clsx from "clsx";
import { KeepAlive, useKeepAliveRef } from "keepalive-for-react";
import { Suspense } from "react";

import { appStore } from "@/store/app";
import { routerActions, routerStore } from "@/store/router";
import { useThemeSettings } from "@/store/theme";

interface Props {
  closePadding?: boolean;
}

const GlobalContent = ({ closePadding }: Props) => {
  const aliveRef = useKeepAliveRef();

  const themeSettings = useThemeSettings();
  const transitionName = themeSettings.page.animate
    ? themeSettings.page.animateMode
    : "";
  const reloadFlag = useStore(appStore, (s) => s.reloadFlag);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const removeCacheKey = useStore(routerStore, (s) => s.removeCacheKey);
  const cacheRoutes = useStore(routerStore, (s) => s.cacheRoutes);

  useUpdateEffect(() => {
    if (!aliveRef.current || !removeCacheKey) return;
    aliveRef.current.destroy(removeCacheKey);
    routerActions.setRemoveCacheKey(null);
  }, [removeCacheKey]);

  useUpdateEffect(() => {
    aliveRef.current?.refresh();
  }, [reloadFlag, transitionName]);
  return (
    <div
      className={clsx("h-full flex-grow bg-layout", {
        "p-16px": !closePadding,
      })}
    >
      <KeepAlive
        activeCacheKey={pathname}
        aliveRef={aliveRef}
        cacheNodeClassName={reloadFlag ? "" : transitionName}
        include={cacheRoutes}
      >
        {!reloadFlag && (
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        )}
      </KeepAlive>
    </div>
  );
};

export default GlobalContent;
