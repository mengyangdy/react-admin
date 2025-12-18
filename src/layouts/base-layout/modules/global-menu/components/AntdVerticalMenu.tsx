import { SimpleScrollbar } from "@dy/materials";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Menu, type MenuProps } from "antd";

import { routerStore } from "@/store/router";
import { getLevelKeys, getSelectedMenuKeyPath } from "@/store/router/shared";
import { themeStore, useThemeSettings } from "@/store/theme";

const AntdVerticalMenu = () => {
  const navigate = useNavigate();
  const allMenus = useStore(routerStore, (s) => s.allMenus);
  const childLevelMenus = useStore(routerStore, (s) => s.childLevelMenus);
  const { route, matched } = useCurrentRoute();

  const selectKey = useStore(routerStore, (s) => s.selectKey);

  const levelKeys = useMemo(
    () =>
      getLevelKeys(
        allMenus.filter(
          (item): item is Router.AntdMenuItem & { key: string } =>
            item !== null &&
            typeof item === "object" &&
            "key" in item &&
            typeof item.key === "string"
        ) as Router.LevelKeysProps[]
      ),
    [allMenus]
  );
  const themeSettings = useThemeSettings();
  const isMix = themeSettings.layout.mode.includes("mix");

  // const { navigate } = useRouter();
  const isVerticalMix = themeSettings.layout.mode === "vertical-mix";
  const siderCollapse = useStore(themeStore, (s) => s.siderCollapse);
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(
    siderCollapse ? [] : getSelectedMenuKeyPath(matched)
  );

  const handleClickMenu: MenuProps["onSelect"] = (info) => {
    navigate({
      to: info.key,
    });
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    if (keys.includes("rc-menu-more")) {
      setStateOpenKeys(keys);
      return;
    }

    const currentOpenKey = keys.find((key) => !stateOpenKeys.includes(key));

    // open
    if (currentOpenKey && themeSettings.isOnlyExpandCurrentParentMenu) {
      const repeatIndex = keys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        keys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // // close
      setStateOpenKeys(keys);
    }
  };

  useEffect(() => {
    if (siderCollapse || isVerticalMix) return;
    setStateOpenKeys(getSelectedMenuKeyPath(matched));
  }, [route, siderCollapse, isVerticalMix]);

  useUpdateEffect(() => {
    if (siderCollapse || isVerticalMix) return;

    const names = matched
      .slice(isMix ? 1 : 0, -1)
      .map((item) => item.pathname)
      .filter(Boolean) as string[];

    setStateOpenKeys(names || []);
  }, [isMix, siderCollapse]);

  return (
    <SimpleScrollbar>
      <Menu
        className="size-full transition-300 border-0!"
        inlineCollapsed={isVerticalMix ? false : siderCollapse}
        inlineIndent={18}
        items={isMix ? childLevelMenus : allMenus}
        mode="inline"
        openKeys={stateOpenKeys}
        selectedKeys={selectKey}
        onOpenChange={onOpenChange}
        onSelect={handleClickMenu}
      />
    </SimpleScrollbar>
  );
};

export default AntdVerticalMenu;
