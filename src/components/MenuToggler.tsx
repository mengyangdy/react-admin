import ButtonIcon from "@/components/ButtonIcon";
import SvgIcon from "@/components/SvgIcon";
import { themeActions, useThemeState } from "@/store/theme";

interface Props {
  /** Arrow style icon */
  arrowIcon?: boolean;
  className?: string;
}

type NumberBool = 0 | 1;

const icons: Record<NumberBool, Record<NumberBool, string>> = {
  0: {
    0: "line-md:menu-fold-left",
    1: "line-md:menu-fold-right",
  },
  1: {
    0: "ph-caret-double-left-bold",
    1: "ph-caret-double-right-bold",
  },
};

const MenuToggler = ({ arrowIcon, className }: Props) => {
  const themeStore = useThemeState();

  const siderCollapse = themeStore.siderCollapse;

  const isArrowIcon = Number(arrowIcon || false) as NumberBool;
  const isCollapsed = Number(siderCollapse || false) as NumberBool;
  const icon = icons[isArrowIcon][isCollapsed];

  return (
    <ButtonIcon
      className={className}
      tooltipContent={siderCollapse ? "展开菜单" : "折叠菜单"}
      tooltipPlacement="bottomLeft"
      onClick={() => themeActions.toggleSiderCollapse()}
    >
      <SvgIcon icon={icon} />
    </ButtonIcon>
  );
};

export default MenuToggler;
