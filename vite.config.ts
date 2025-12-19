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
				scss: {
					api: "modern-compiler", // Vite 7 / Sass 推荐使用现代编译器
					// additionalData: `@use "@/styles/variables.scss" as *;`, // 如果有全局变量文件
				},
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
						// 1. 先处理 node_modules 里的内容
						if (id.includes("node_modules")) {
							// 🔥 第一优先：ECharts (体积最大，必须先拆出来)
							// 包含 echarts 核心和 zrender 渲染引擎
							if (id.includes("echarts") || id.includes("zrender")) {
								return "echarts";
							}

							// 🔥 第二优先：Ant Design (体积次大)
							// 包含 antd 组件库和它依赖的图标库、rc-组件
							if (id.includes("antd") || id.includes("@ant-design") || id.includes("rc-")) {
								return "antd";
							}

							// 🚀 第三优先：Framer Motion (动画库)
							if (id.includes("motion") || id.includes("framer-motion")) {
								return "motion";
							}

							// ⚛️ 第四优先：React 核心 + TanStack 全家桶
							// 这些是应用骨架，虽然也不小，但必须首屏加载，所以放一起
							if (id.includes("react") || id.includes("react-dom") || id.includes("@tanstack")) {
								return "react-core";
							}

							// 🛠 第五优先：通用工具库
							if (id.includes("axios") || id.includes("ahooks") || id.includes("immer")) {
								return "utils";
							}

							// 📦 兜底：其他所有 node_modules 里的零碎包
							return "vendor";
						}
					},
				},
			},
		},
	};
});
