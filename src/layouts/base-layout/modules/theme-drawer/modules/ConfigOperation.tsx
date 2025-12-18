import { Button } from "antd";

import { themeActions, useThemeSettingsJson } from "@/store/theme";

const ConfigOperation = () => {
  const { copy } = useCopy();
  const themeSettingsJson = useThemeSettingsJson();

  function handleReset() {
    themeActions.setThemeScheme("light");
    themeActions.resetThemeStore();
    setTimeout(() => {
      window.$message?.success("重置成功");
    }, 50);
  }

  function formatConfigText() {
    const reg = /"\w+":/g;
    return themeSettingsJson.replace(reg, (match) => match.replace(/"/g, ""));
  }

  async function handleCopy() {
    const text = formatConfigText();
    const success = await copy(text);
    if (success) {
      window.$message?.success(
        "复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings"
      );
    } else {
      window.$message?.error("复制失败");
    }
  }

  return (
    <div className="flex justify-between">
      <Button danger onClick={handleReset}>
        重置配置
      </Button>
      <Button type="primary" onClick={handleCopy}>
        复制配置
      </Button>
    </div>
  );
};

export default ConfigOperation;
