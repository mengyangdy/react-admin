import { Button } from "antd";
import { createElement } from "react";

import { globalConfig } from "@/config";

export function setupAppVersionNotification() {
	const canAutoUpdateApp =
		import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === "Y" && import.meta.env.PROD;

	if (!canAutoUpdateApp) return;
	let isShow = false;
	document.addEventListener("visibilitychange", async () => {
		const preConditions = [!isShow, document.visibilityState === "visible", !globalConfig.isDev];
		if (!preConditions.every(Boolean)) return;
		const buildTime = await getHtmlBuildTime();
		if (buildTime === BUILD_TIME) return;
		isShow = true;
		window.$notification?.open({
			btn: (() => {
				return createElement(
					"div",
					{ style: { display: "flex", gap: "12px", justifyContent: "end", width: "325px" } },
					[
						createElement(
							Button,
							{
								key: "cancel",
								onClick() {
									window.$notification?.destroy();
								},
							},
							"稍后再说",
						),
						createElement(
							Button,
							{
								key: "ok",
								onClick() {
									location.reload();
								},
								type: "primary",
							},
							"立即刷新",
						),
					],
				);
			})(),
			title: "系统版本更新通知",
			description: "检测到系统有新版本发布，是否立即刷新页面？",
			onClose() {
				isShow = false;
			},
		});
	});
}

async function getHtmlBuildTime() {
	const res = await fetch(`/index.html?time=${Date.now()}`, {
		headers: {
			"Cache-Control": "no-cache",
		},
	});
	const html = await res.text();

	const match = html.match(/<meta name="buildTime" content="(.*)">/);

	const buildTime = match?.[1] || "";

	return buildTime;
}
