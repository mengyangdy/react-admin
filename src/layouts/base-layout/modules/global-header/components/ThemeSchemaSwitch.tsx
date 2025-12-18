import { useStore } from "@tanstack/react-store";
import type { ThemeModeType } from "ahooks/lib/useTheme";
import type { ButtonProps, TooltipProps } from "antd";
import type { CSSProperties } from "react";

import { themeStore, themeActions } from "@/store/theme";

export const icons: Record<ThemeModeType, string> = {
	dark: "material-symbols:nightlight-rounded",
	light: "material-symbols:sunny",
	system: "material-symbols:hdr-auto",
};

interface Props {
	className?: string;
	showTooltip?: boolean;
	style?: CSSProperties;
	tooltipPlacement?: TooltipProps["placement"];
}

const DEFAULT_ANIMATION_DURATION = 400;

const DEFAULT_ANIMATION_EASING = "ease-out";

const ThemeSchemaSwitch: FC<Props> = ({
	showTooltip = true,
	tooltipPlacement = "bottom",
	...props
}) => {
	const themeScheme = useStore(themeStore, (s) => s.themeScheme);
	const darkMode = useStore(themeStore, (s) => s.darkMode);
	const tooltipContent = showTooltip ? "主题模式" : "";
	const toggleDark: ButtonProps["onClick"] = (event) => {
		const isAppearanceTransition = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!isAppearanceTransition) {
			themeActions.toggleThemeScheme();
			return;
		}
		const transition = document.startViewTransition(() => {
			themeActions.toggleThemeScheme();
		});
		if (themeScheme === "system") return;
		const x = event.clientX;
		const y = event.clientY;
		const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
		transition.ready.then(() => {
			const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
			document.documentElement.animate(
				{
					clipPath: darkMode ? [...clipPath].reverse() : clipPath,
				},
				{
					duration: DEFAULT_ANIMATION_DURATION,
					easing: DEFAULT_ANIMATION_EASING,
					pseudoElement: darkMode ? "::view-transition-old(root)" : "::view-transition-new(root)",
				},
			);
		});
	};
	return (
		<ButtonIcon
			icon={icons[themeScheme]}
			tooltipContent={tooltipContent}
			{...props}
			tooltipPlacement={tooltipPlacement}
			onClick={toggleDark}
		></ButtonIcon>
	);
};

export default ThemeSchemaSwitch;
