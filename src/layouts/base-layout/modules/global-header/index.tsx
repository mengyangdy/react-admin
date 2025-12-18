import { GLOBAL_HEADER_MENU_ID } from "@/constants/app.ts";
import GlobalBreadcrumb from "@/layouts/base-layout/modules/global-header/components/GlobalBreadcrumb.tsx";
import ThemeButton from "@/layouts/base-layout/modules/global-header/components/ThemeButton.tsx";
import ThemeSchemaSwitch from "@/layouts/base-layout/modules/global-header/components/ThemeSchemaSwitch.tsx";
import UserAvatar from "@/layouts/base-layout/modules/global-header/components/UserAvatar.tsx";

import GlobalLogo from "../global-logo";
import MenuToggler from "./components/menu-toggler.tsx";

interface Props {
	isMobile: boolean;
	mode: UnionKey.ThemeLayoutMode;
	reverse?: boolean;
	siderWidth: number;
}
const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
	horizontal: {
		showLogo: true,
		showMenu: true,
		showMenuToggler: false,
	},
	"horizontal-mix": {
		showLogo: true,
		showMenu: true,
		showMenuToggler: false,
	},
	vertical: {
		showLogo: false,
		showMenu: false,
		showMenuToggler: true,
	},
	"vertical-mix": {
		showLogo: false,
		showMenu: false,
		showMenuToggler: false,
	},
};

const GlobalHeader: FC<Props> = ({ isMobile, mode, reverse, siderWidth }) => {
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);
	const { showLogo, showMenu, showMenuToggler } = headerPropsConfig[mode];
	const showToggler = reverse ? true : showMenuToggler;

	return (
		<DarkModeContainer className="h-full flex-y-center px-12px shadow-header">
			{showLogo && (
				<GlobalLogo
					className="h-full"
					style={{ width: `${siderWidth}px` }}
				/>
			)}
			{showToggler && <MenuToggler />}
			<div
				className="h-full flex-y-center flex-1-hidden"
				id={GLOBAL_HEADER_MENU_ID}
			>
				{!isMobile && !showMenu && <GlobalBreadcrumb className="ml-12px" />}
			</div>
			<div className="h-full flex-y-center justify-end">
				{/* TODO全局搜索 */}
				{!isMobile && (
					<FullScreen
						className="px-12px"
						full={isFullscreen}
						toggleFullscreen={toggleFullscreen}
					/>
				)}
				{/* TODO语言切换 */}
				<ThemeSchemaSwitch className="px-12px" />
				<ThemeButton />
				<UserAvatar />
			</div>
		</DarkModeContainer>
	);
};

export default GlobalHeader;
