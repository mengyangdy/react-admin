import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";

export function setupAutoImport(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv;
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(
    `${VITE_ICON_PREFIX}-`,
    ""
  );
  return AutoImport({
    dirs: ["src/hooks/**", "src/components/**"],
    dts: "src/types/auto-imports.d.ts",
    imports: [
      "react",
      "ahooks",
      { from: "react", imports: ["FC"], type: true },
    ],
    include: [/\.[tj]sx?$/],
    resolvers: [
      IconsResolver({
        componentPrefix: VITE_ICON_PREFIX,
        customCollections: [collectionName],
        extension: "tsx",
        prefix: VITE_ICON_PREFIX,
      }),
    ],
  });
}
