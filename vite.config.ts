import process from "node:process";
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { getBuildTime } from "./build/config";
import { createViteProxy } from "./build/config/proxy";
import { setupVitePlugins } from "./build/plugins";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
	const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;
	const buildTime = getBuildTime();
	const enableProxy = configEnv.command === "serve" && !configEnv.isPreview;
	return {
		base: viteEnv.VITE_BASE_URL,
		plugins: setupVitePlugins(viteEnv, buildTime),
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"~": fileURLToPath(new URL("./", import.meta.url)),
			},
		},
		// CSS 预处理器配置
		css: {
			preprocessorOptions: {
				// 如果需要 Sass 新 API（modern-compiler），请升级到支持该字段的
				// Vite/Sass 版本后再开启；当前类型定义不包含 api 字段。
				scss: {},
			},
		},
		server: {
			host: "0.0.0.0",
			open: true,
			port: 9527,
			proxy: createViteProxy(viteEnv, enableProxy),
			warmup: {
				clientFiles: ["./index.html", "./src/{pages,components}/*"],
			},
		},
		define: {
			BUILD_TIME: JSON.stringify(buildTime),
		},
		build: {
			target: "esnext",
			minify: "esbuild",
			chunkSizeWarningLimit: 1000, // 调高警告阈值，因为 Echarts 和 Antd 比较大
			rollupOptions: {
				output: {
					// 静态资源分类
					assetFileNames: (chunkInfo) => {
						const name = chunkInfo.names[0] || "";
						if (name.endsWith(".css")) return "css/[name]-[hash].css";
						const imgExts = ["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"];
						if (imgExts.some((ext) => name.endsWith(`.${ext}`))) {
							return "images/[name]-[hash].[ext]";
						}
						return "assets/[name]-[hash].[ext]";
					},
					// JS 文件分类
					chunkFileNames: (chunkInfo) => {
						// 检查文件路径，如果是 pages 目录下的文件，则修改文件名和路径
						const filePath = chunkInfo.facadeModuleId;

						if (filePath) {
							// 提取文件的父文件夹作为文件名
							if (filePath.includes("/src/pages/")) {
								// 提取文件的父文件夹作为文件名
								const pageName = filePath.split("/src/pages/")[1];
								// 替换 [name] 为  name 因为vite不支持
								const newPath = pageName.replace(/\[([^\]]+)\]/g, "$1");

								const path = newPath.slice(0, newPath.lastIndexOf("/"));

								return `js/pages/${path}/[name]-[hash].js`;
							} else if (filePath.includes("/src/components/")) {
								return `js/components/[name]-[hash].js`;
							}
						}

						return "js/[name]-[hash].js"; // 默认处理方式
					},
					// 智能分包策略
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (id.includes("echarts") || id.includes("zrender")) {
								return "echarts";
							}
							if (id.includes("antd") || id.includes("@ant-design") || id.includes("rc-")) {
								return "antd";
							}

							if (id.includes("motion") || id.includes("framer-motion")) {
								return "motion";
							}
							if (id.includes("react") || id.includes("react-dom") || id.includes("@tanstack")) {
								return "react-core";
							}
							if (id.includes("axios") || id.includes("ahooks") || id.includes("immer")) {
								return "utils";
							}
							return "vendor";
						}
					},
				},
			},
		},
	};
});
