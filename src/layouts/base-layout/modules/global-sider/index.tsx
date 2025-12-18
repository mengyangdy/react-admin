import { useStore } from "@tanstack/react-store";

import { GLOBAL_SIDER_MENU_ID } from "@/constants/app.ts";
import GlobalLogo from "@/layouts/base-layout/modules/global-logo";
import { themeStore } from "@/store/theme";

interface Props {
	headerHeight: number;
	inverted: boolean;
	isHorizontalMix: boolean;
	isVerticalMix: boolean;
	siderCollapse: boolean;
}

const GlobalSider: FC<Props> = ({
	headerHeight,
	inverted,
	isHorizontalMix,
	isVerticalMix,
	siderCollapse,
}) => {
	const darkMode = useStore(themeStore, (s) => s.darkMode);
	const showLogo = !isVerticalMix && !isHorizontalMix;
	const darkMenu = !darkMode && !isHorizontalMix && inverted;

	return (
		<DarkModeContainer
			className="size-full flex-col-stretch shadow-sider"
			inverted={darkMenu}
		>
			{showLogo && (
				<GlobalLogo
					showTitle={!siderCollapse}
					style={{ height: `${headerHeight}px` }}
				/>
			)}
			<div
				className={showLogo ? "flex-1-hidden" : "h-full"}
				id={GLOBAL_SIDER_MENU_ID}
			/>
		</DarkModeContainer>
	);
};

export default GlobalSider;
