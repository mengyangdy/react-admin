import { PageTab } from "@dy/materials";
import { useStore } from "@tanstack/react-store";
import clsx from "clsx";

import BetterScroll from "@/components/BetterScroll.tsx";
import DarkModeContainer from "@/components/DarkModeContainer.tsx";
import FullScreen from "@/components/FullScreen.tsx";
import SvgIcon from "@/components/SvgIcon.tsx";
import { useTabActions, useTabManage } from "@/hooks/tab/useTab";
import { useTabScroll } from "@/hooks/tab/useTabScroll";
import { routerActions } from "@/store/router";
import { themeActions, themeStore, useThemeSettings } from "@/store/theme";
import { isPC } from "@/utils/agent.ts";

import ContextMenu from "./components/TabContextMenu";
import TabReloadButton from "./components/TabReloadButton";

const GlobalTab = () => {
	const isPCFlag = isPC();
	const darkMode = useStore(themeStore, (s) => s.darkMode);
	const themeSettings = useThemeSettings();
	const { activeTabId, isTabRetain, navigate, removeTabById, tabs } = useTabActions();

	const { bsWrapper, setBsScroll, tabRef } = useTabScroll(activeTabId);
	useTabManage();
	const fullContent = useStore(themeStore, (s) => s.fullContent);

	const tabWrapperClass =
		themeSettings.tab.mode === "chrome" ? "items-end" : "items-center gap-12px";
	function removeFocus() {
		(document.activeElement as HTMLElement)?.blur();
	}

	function getContextMenuDisabledKeys(tabId: string, index: number): App.Global.DropdownKey[] {
		const disableKeys: App.Global.DropdownKey[] = [];
		const isRetain = isTabRetain(tabId);
		if (isRetain) {
			const homeDisable: App.Global.DropdownKey[] = ["closeCurrent", "closeLeft"];
			disableKeys.push(...homeDisable);
		}
		if (index === 1) disableKeys.push("closeLeft");
		if (index === tabs.length - 1) disableKeys.push("closeRight");
		return disableKeys;
	}
	function toggleContent() {
		themeActions.setFullContent();
	}

	function handleCloseTab(tab: App.Global.Tab) {
		removeTabById(tab.id);
		routerActions.setRemoveCacheKey(tab.routePath);
	}
	function handleClickTab(tab: App.Global.Tab) {
		navigate({
			to: tab.fullPath,
		});
	}

	return (
		<DarkModeContainer className="size-full flex-y-center px-16px shadow-tab">
			<div
				className="h-full flex-1-hidden"
				ref={bsWrapper}
			>
				<BetterScroll
					options={{
						click: !isPCFlag,
						scrollX: true,
						scrollY: false,
					}}
					setBsScroll={setBsScroll}
					onClick={removeFocus}
				>
					<div
						className={clsx("h-full flex pr-18px", tabWrapperClass)}
						ref={tabRef}
					>
						{tabs.map((item, index) => (
							<ContextMenu
								active={item.id === activeTabId}
								darkMode={darkMode}
								disabledKeys={getContextMenuDisabledKeys(item.id, index)}
								key={item.id}
								mode={themeSettings.tab.mode}
								tabId={item.id}
							>
								<div
									className={themeSettings.tab.mode === "slider" ? "h-full" : undefined}
									id={item.id}
								>
									<PageTab
										active={item.id === activeTabId}
										activeColor={themeSettings.themeColor}
										closable={!isTabRetain(item.id)}
										darkMode={darkMode}
										datatype={item.id}
										handleClose={() => handleCloseTab(item)}
										id={item.id}
										mode={themeSettings.tab.mode}
										prefix={
											<SvgIcon
												className="inline-block align-text-bottom text-16px"
												icon={item.icon}
												localIcon={item.localIcon}
											/>
										}
										onClick={() => handleClickTab(item)}
									>
										<div className="max-w-240px ellipsis-text">{item.label}</div>
									</PageTab>
								</div>
							</ContextMenu>
						))}
					</div>
				</BetterScroll>
			</div>
			<TabReloadButton />
			<FullScreen
				full={fullContent}
				toggleFullscreen={toggleContent}
			/>
		</DarkModeContainer>
	);
};

export default GlobalTab;
