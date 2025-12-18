import { createPortal } from "react-dom";

import { GLOBAL_SIDER_MENU_ID } from "@/constants/app";
import AntdVerticalMenu from "@/layouts/base-layout/modules/global-menu/components/AntdVerticalMenu.tsx";
import { useGetElementById } from "@/layouts/base-layout/modules/global-menu/modules/hook.ts";

const VerticalMenu = () => {
  const container = useGetElementById(GLOBAL_SIDER_MENU_ID);
  if (!container) return null;
  return createPortal(<AntdVerticalMenu />, container);
};

export default VerticalMenu;
