import process from "node:process";
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";

import { getBuildTime } from "./build/config";
import { setupVitePlugins } from "./build/plugins";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
	const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;
	const buildTime = getBuildTime();
	return {
		plugins: setupVitePlugins(viteEnv, buildTime),
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"~": fileURLToPath(new URL("./", import.meta.url)),
			},
		},
		define: {
			BUILD_TIME: JSON.stringify(buildTime),
		},
	};
});
