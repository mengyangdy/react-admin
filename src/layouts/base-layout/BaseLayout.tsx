import type { LayoutMode } from "@dy/materials";
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from "@dy/materials";
import { useStore } from "@tanstack/react-store";
import { Suspense, useLayoutEffect } from "react";

import {
	LAYOUT_MODE_HORIZONTAL,
	LAYOUT_MODE_HORIZONTAL_MIX,
	LAYOUT_MODE_VERTICAL,
	LAYOUT_MODE_VERTICAL_MIX,
} from "@/constants/common";
import GlobalContent from "@/layouts/base-layout/modules/global-content";
import GlobalFooter from "@/layouts/base-layout/modules/global-footer";
import GlobalHeader from "@/layouts/base-layout/modules/global-header";
import GlobalMenu from "@/layouts/base-layout/modules/global-menu";
import GlobalSider from "@/layouts/base-layout/modules/global-sider";
import GlobalTab from "@/layouts/base-layout/modules/global-tab";
import ThemeDrawer from "@/layouts/base-layout/modules/theme-drawer";
import { themeStore, useThemeSettings } from "@/store/theme";

const BaseLayout = () => {
	const themeSettings = useThemeSettings();
	const siderCollapse = useStore(themeStore, (s) => s.siderCollapse);
	const fullContent = useStore(themeStore, (s) => s.fullContent);
	const mixSiderFixed = useStore(themeStore, (s) => s.mixSiderFixed);

	const responsive = useResponsive();

	// const { childLevelMenus, isActiveFirstLevelMenuHasChildren } = useMixMenuContext();
	const childLevelMenus = [];
	const isActiveFirstLevelMenuHasChildren = false;

	const siderVisible = themeSettings.layout.mode !== LAYOUT_MODE_HORIZONTAL;
	const isVerticalMix = themeSettings.layout.mode === LAYOUT_MODE_VERTICAL_MIX;
	const isHorizontalMix = themeSettings.layout.mode === LAYOUT_MODE_HORIZONTAL_MIX;
	const layoutMode = themeSettings.layout.mode.includes(LAYOUT_MODE_VERTICAL)
		? LAYOUT_MODE_VERTICAL
		: LAYOUT_MODE_HORIZONTAL;
	const isMobile = !responsive.sm;

	function getSiderWidth() {
		const { reverseHorizontalMix } = themeSettings.layout;
		const { mixChildMenuWidth, mixWidth, width } = themeSettings.sider;
		if (isHorizontalMix && reverseHorizontalMix) {
			return isActiveFirstLevelMenuHasChildren ? width : 0;
		}
		let w = isVerticalMix || isHorizontalMix ? mixWidth : width;
		if (isVerticalMix && mixSiderFixed && childLevelMenus.length) {
			w += mixChildMenuWidth;
		}
		return w;
	}
	const siderWidth = getSiderWidth();
	function getSiderCollapsedWidth() {
		const { reverseHorizontalMix } = themeSettings.layout;
		const { collapsedWidth, mixChildMenuWidth, mixCollapsedWidth } = themeSettings.sider;

		if (isHorizontalMix && reverseHorizontalMix) {
			return isActiveFirstLevelMenuHasChildren ? collapsedWidth : 0;
		}

		let w = isVerticalMix || isHorizontalMix ? mixCollapsedWidth : collapsedWidth;

		if (isVerticalMix && mixSiderFixed && childLevelMenus.length) {
			w += mixChildMenuWidth;
		}

		return w;
	}
	const siderCollapsedWidth = getSiderCollapsedWidth();
	function updateSiderCollapse() {}

	useLayoutEffect(() => {}, []);

	return (
		<AdminLayout
			fixedFooter={themeSettings.footer.fixed}
			fixedTop={themeSettings.fixedHeaderAndTab}
			Footer={<GlobalFooter />}
			footerHeight={themeSettings.footer.height}
			footerVisible={themeSettings.footer.visible}
			fullContent={fullContent}
			headerHeight={themeSettings.header.height}
			isMobile={isMobile}
			mode={layoutMode as LayoutMode}
			rightFooter={themeSettings.footer.right}
			scrollElId={LAYOUT_SCROLL_EL_ID}
			scrollMode={themeSettings.layout.scrollMode}
			siderCollapse={siderCollapse}
			siderCollapsedWidth={siderCollapsedWidth}
			siderVisible={siderVisible}
			siderWidth={siderWidth}
			Tab={<GlobalTab />}
			tabHeight={themeSettings.tab.height}
			tabVisible={themeSettings.tab.visible}
			updateSiderCollapse={updateSiderCollapse}
			Header={
				<GlobalHeader
					isMobile={isMobile}
					mode={themeSettings.layout.mode}
					reverse={themeSettings.layout.reverseHorizontalMix}
					siderWidth={themeSettings.sider.width}
				/>
			}
			Sider={
				<GlobalSider
					headerHeight={themeSettings.header.height}
					inverted={themeSettings.sider.inverted}
					isHorizontalMix={isHorizontalMix}
					isVerticalMix={isVerticalMix}
					siderCollapse={siderCollapse}
				/>
			}
		>
			<GlobalContent />
			<GlobalMenu
				mode={themeSettings.layout.mode}
				reverse={themeSettings.layout.reverseHorizontalMix}
			/>
			<Suspense fallback={null}>
				<ThemeDrawer />
			</Suspense>
		</AdminLayout>
	);
};

export default BaseLayout;
