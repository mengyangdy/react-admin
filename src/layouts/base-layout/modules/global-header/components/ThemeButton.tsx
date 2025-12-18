import { themeActions } from "@/store/theme";

const ThemeButton = () => {
  function handleClick() {
    themeActions.openThemeDrawer();
  }

  return (
    <ButtonIcon
      triggerParent
      className="px-12px"
      icon="majesticons:color-swatch-line"
      tooltipContent="主题配置"
      onClick={handleClick}
    />
  );
};

export default ThemeButton;
