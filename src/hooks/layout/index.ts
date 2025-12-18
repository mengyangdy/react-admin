import { useStore } from "@tanstack/react-store";

import { appActions, appStore } from "@/store/app";
import { useThemeSettings } from "@/store/theme";

export function useReloadPage(duration = 300) {
	const isReload = useStore(appStore, (s) => s.reloadFlag);
	const themeSettings = useThemeSettings();
	async function reloadPage() {
		appActions.setReloadFlag(true);
		const d = themeSettings.page.animate ? duration : 40;
		await new Promise((resolve) => {
			setTimeout(resolve, d);
		});
		appActions.setReloadFlag(false);
	}
	return {
		isReload,
		reloadPage,
	};
}
