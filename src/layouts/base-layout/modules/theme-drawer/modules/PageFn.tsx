import { Input, InputNumber, Select, Switch } from "antd";

import {
  themePageAnimationModeOptions,
  themeScrollModeOptions,
  themeTabModeOptions,
} from "@/constants/app";
import { themeActions, useThemeSettings } from "@/store/theme";

import SettingItem from "../components/SettingItem";

const PageFn = memo(() => {
  const themeSettings = useThemeSettings();
  const isWrapperScrollMode = themeSettings.layout.scrollMode === "wrapper";
  const isPageAnimate = themeSettings.page.animate;
  const watermarkVisible = themeSettings.watermark?.visible ?? false;

  const layoutMode = themeSettings.layout.mode;

  const isMixLayoutMode = layoutMode.includes("mix");

  const isVertical = layoutMode === "vertical";

  return (
    <div className="relative flex-col-stretch gap-12px">
      <SettingItem label="滚动模式">
        <Select
          className="w-120px"
          value={themeSettings.layout.scrollMode}
          options={themeScrollModeOptions.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          onChange={(value) => themeActions.setLayoutScrollMode(value)}
        />
      </SettingItem>
      <SettingItem label="页面切换动画">
        <Switch
          checked={isPageAnimate}
          onChange={(value) => themeActions.setPage({ animate: value })}
        />
      </SettingItem>

      <SettingItem label="页面切换动画类型" show={isPageAnimate}>
        <Select
          className="w-120px"
          value={themeSettings.page.animateMode}
          options={themePageAnimationModeOptions.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          onChange={(value) => themeActions.setPage({ animateMode: value })}
        />
      </SettingItem>

      <SettingItem label="固定头部和标签栏" show={isWrapperScrollMode}>
        <Switch
          checked={themeSettings.fixedHeaderAndTab}
          onChange={(value) => themeActions.setFixedHeaderAndTab(value)}
        />
      </SettingItem>

      <SettingItem label="头部高度">
        <InputNumber
          className="w-120px"
          value={themeSettings.header.height}
          onChange={(value) => themeActions.setHeader({ height: value ?? 0 })}
        />
      </SettingItem>
      <SettingItem label="显示面包屑">
        <Switch
          checked={themeSettings.header.breadcrumb.visible}
          onChange={(value) =>
            themeActions.setHeader({
              breadcrumb: {
                ...themeSettings.header.breadcrumb,
                visible: value,
              },
            })
          }
        />
      </SettingItem>

      <SettingItem
        label="显示面包屑图标"
        show={themeSettings.header.breadcrumb.visible}
      >
        <Switch
          checked={themeSettings.header.breadcrumb.showIcon}
          onChange={(value) =>
            themeActions.setHeader({
              breadcrumb: {
                ...themeSettings.header.breadcrumb,
                showIcon: value,
              },
            })
          }
        />
      </SettingItem>

      <SettingItem label="显示标签栏">
        <Switch
          checked={themeSettings.tab.visible}
          onChange={(value) => themeActions.setTab({ visible: value })}
        />
      </SettingItem>

      <SettingItem label="标签栏高度" show={themeSettings.tab.visible}>
        <InputNumber
          className="w-120px"
          value={themeSettings.tab.height}
          onChange={(value) => themeActions.setTab({ height: value ?? 0 })}
        />
      </SettingItem>

      <SettingItem label="标签栏风格" show={themeSettings.tab.visible}>
        <Select
          className="w-120px"
          value={themeSettings.tab.mode}
          options={themeTabModeOptions.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          onChange={(value) => themeActions.setTab({ mode: value })}
        />
      </SettingItem>

      <SettingItem label="侧边栏宽度" show={isVertical}>
        <InputNumber
          className="w-120px"
          value={themeSettings.sider.width}
          onChange={(value) => themeActions.setSider({ width: value ?? 0 })}
        />
      </SettingItem>

      <SettingItem label="侧边栏折叠宽度" show={isVertical}>
        <InputNumber
          className="w-120px"
          value={themeSettings.sider.collapsedWidth}
          onChange={(value) =>
            themeActions.setSider({ collapsedWidth: value ?? 0 })
          }
        />
      </SettingItem>

      <SettingItem label="混合布局侧边栏宽度" show={isMixLayoutMode}>
        <InputNumber
          className="w-120px"
          value={themeSettings.sider.mixWidth}
          onChange={(value) => themeActions.setSider({ mixWidth: value ?? 0 })}
        />
      </SettingItem>

      <SettingItem label="混合布局侧边栏折叠宽度" show={isMixLayoutMode}>
        <InputNumber
          className="w-120px"
          value={themeSettings.sider.mixCollapsedWidth}
          onChange={(value) =>
            themeActions.setSider({ mixCollapsedWidth: value ?? 0 })
          }
        />
      </SettingItem>

      <SettingItem
        label="混合布局子菜单宽度"
        show={layoutMode === "vertical-mix"}
      >
        <InputNumber
          className="w-120px"
          value={themeSettings.sider.mixChildMenuWidth}
          onChange={(value) =>
            themeActions.setSider({ mixChildMenuWidth: value ?? 0 })
          }
        />
      </SettingItem>

      <SettingItem label="显示底部">
        <Switch
          checked={themeSettings.footer.visible}
          onChange={(value) => themeActions.setFooter({ visible: value })}
        />
      </SettingItem>

      <SettingItem
        label="固定底部"
        show={Boolean(themeSettings.footer.visible && isWrapperScrollMode)}
      >
        <Switch
          checked={themeSettings.footer.fixed}
          onChange={(value) => themeActions.setFooter({ fixed: value })}
        />
      </SettingItem>

      <SettingItem label="底部高度" show={themeSettings.footer.visible}>
        <InputNumber
          className="w-120px"
          value={themeSettings.footer.height}
          onChange={(value) => themeActions.setFooter({ height: value ?? 0 })}
        />
      </SettingItem>

      <SettingItem
        label="底部居右"
        show={Boolean(
          themeSettings.footer.visible && layoutMode === "horizontal-mix"
        )}
      >
        <Switch
          checked={themeSettings.footer.right}
          onChange={(value) => themeActions.setFooter({ right: value })}
        />
      </SettingItem>

      <SettingItem label="显示全屏水印">
        <Switch
          checked={watermarkVisible}
          onChange={(value) => themeActions.setWatermark({ visible: value })}
        />
      </SettingItem>

      <SettingItem label="水印文本" show={watermarkVisible}>
        <Input
          allowClear
          className="w-120px"
          value={themeSettings.watermark?.text ?? ""}
          onChange={(e) =>
            themeActions.setWatermark({ text: e.target.value || "" })
          }
        />
      </SettingItem>
    </div>
  );
});

export default PageFn;
