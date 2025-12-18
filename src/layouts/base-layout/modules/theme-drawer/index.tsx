import { SimpleScrollbar } from "@dy/materials";
import { useStore } from "@tanstack/react-store";
import { Divider, Drawer } from "antd";

import ConfigOperation from "@/layouts/base-layout/modules/theme-drawer/modules/ConfigOperation.tsx";
import { themeActions, themeStore } from "@/store/theme";

import DarkMode from "./modules/DarkMode";
import LayoutMode from "./modules/LayoutMode";
import PageFn from "./modules/PageFn";
import ThemeColor from "./modules/ThemeColor";

const ThemeDrawer = () => {
  const themeDrawerVisible = useStore(themeStore, (s) => s.themeDrawerVisible);

  function close() {
    themeActions.closeThemeDrawer();
  }

  useMount(() => {
    const saveThemeSettings = () => {
      themeActions.cacheThemeSettings();
    };
    window.addEventListener("beforeunload", saveThemeSettings);
    return () => {
      window.removeEventListener("beforeunload", saveThemeSettings);
    };
  });
  return (
    <Drawer
      closeIcon={false}
      footer={<ConfigOperation />}
      open={themeDrawerVisible}
      styles={{
        body: {
          padding: 0,
        },
      }}
      title="主题配置"
      extra={
        <ButtonIcon
          className="h-28px"
          icon="ant-design:close-outlined"
          onClick={close}
        />
      }
      onClose={close}
    >
      <SimpleScrollbar>
        <div className="overflow-hidden px-24px pb-24px pt-8px">
          <Divider>主题模式</Divider>
          <DarkMode />
          <Divider>布局模式</Divider>
          <LayoutMode />
          <Divider>主题颜色</Divider>
          <ThemeColor />
          <Divider>页面功能</Divider>
          <PageFn />
        </div>
      </SimpleScrollbar>
    </Drawer>
  );
};

export default ThemeDrawer;
