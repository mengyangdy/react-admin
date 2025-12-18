import type { PluginOption } from "vite";
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { setupUnocss } from "./unocss";
import { setupHtmlPlugin } from "./html";
import { setupAutoImport } from "./auto-import";
import { setupUnPluginIcon } from './unplugin-icon';

export function setupVitePlugins(viteEnv:Env.ImportMeta,buildTime:string){
  const plugins:PluginOption=[
    devtools(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      viteReact({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      setupUnocss(viteEnv),
      setupHtmlPlugin(buildTime),
      setupAutoImport(viteEnv),
    ...setupUnPluginIcon(viteEnv),
  ]
  return plugins
}