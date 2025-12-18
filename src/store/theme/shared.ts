import { getColorPalette, getRgb } from "@dy/color";

import { globalConfig } from "@/config.ts";
import { DARK_CLASS } from "@/constants/common.ts";
import { overrideThemeSettings, themeSettings } from "@/theme/settings.ts";
import { themeVars } from "@/theme/vars.ts";
import { toggleHtmlClass } from "@/utils/common.ts";
import { localStg } from "@/utils/storage.ts";

export function initThemeSettings() {
	if (globalConfig.isDev) return themeSettings;
	const settings = localStg.get("themeSettings") || themeSettings;
	const isOverride = localStg.get("overrideThemeFlag") === BUILD_TIME;
	if (!isOverride) {
		Object.assign(settings, overrideThemeSettings);
		localStg.set("overrideThemeFlag", BUILD_TIME);
	}
	return settings;
}

export function setupThemeVarsToHtml(
	themeColors: App.Theme.ThemeColor,
	tokens?: App.Theme.ThemeSetting["tokens"],
	recommended = false,
) {
	const { darkThemeTokens, themeTokens } = createThemeToken(themeColors, tokens, recommended);
	addThemeVarsToGlobal(themeTokens, darkThemeTokens);
}

export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
	const cssVarStr = getCssVarByTokens(tokens);
	const darkCssVarStr = getCssVarByTokens(darkTokens);
	const css = `
   :root {
      ${cssVarStr}
    }
  `;

	const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `;

	const styleId = "theme-vars";
	const style = document.querySelector(`#${styleId}`) || document.createElement("style");

	style.id = styleId;

	style.textContent = css + darkCss;

	document.head.appendChild(style);
}

function createThemeToken(
	colors: App.Theme.ThemeColor,
	tokens?: App.Theme.ThemeSetting["tokens"],
	recommended = false,
) {
	const paletteColors = createThemePaletteColors(colors, recommended);

	const { dark, light } = tokens || themeSettings.tokens;

	const themeTokens: App.Theme.ThemeTokenCSSVars = {
		boxShadow: {
			...light.boxShadow,
		},
		colors: {
			...paletteColors,
			nprogress: paletteColors.primary,
			...light.colors,
		},
	};

	const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
		boxShadow: {
			...themeTokens.boxShadow,
			...dark?.boxShadow,
		},
		colors: {
			...themeTokens.colors,
			...dark?.colors,
		},
	};

	return {
		darkThemeTokens,
		themeTokens,
	};
}

function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
	const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[];
	const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

	colorKeys.forEach((key) => {
		const colorMap = getColorPalette(colors[key], recommended);

		colorPaletteVar[key] = colorMap.get(500) ?? "";

		colorMap.forEach((hex, number) => {
			colorPaletteVar[`${key}-${number}`] = hex;
		});
	});

	return colorPaletteVar;
}

function getCssVarByTokens(tokens: App.Theme.BaseToken) {
	const styles: string[] = [];

	function removeVarPrefix(value: string) {
		return value.replace("var(", "").replace(")", "");
	}

	function removeRgbPrefix(value: string) {
		return value.replace("rgb(", "").replace(")", "");
	}

	for (const [key, tokenValues] of Object.entries(themeVars)) {
		for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
			let cssVarsKey = removeVarPrefix(tokenValue);
			let cssValue = tokens[key][tokenKey];

			if (key === "colors") {
				cssVarsKey = removeRgbPrefix(cssVarsKey);
				const { b, g, r } = getRgb(cssValue);
				cssValue = `${r} ${g} ${b}`;
			}

			styles.push(`${cssVarsKey}: ${cssValue}`);
		}
	}

	const styleStr = styles.join(";");

	return styleStr;
}

export function toggleAuxiliaryColorModes(colourWeakness = false) {
	const htmlElement = document.documentElement;
	htmlElement.style.filter = colourWeakness ? "invert(80%)" : "";
}

export function toggleGrayscaleMode(grayscaleMode = false) {
	const GRAYSCALE_CLASS = "grayscale";

	const { add, remove } = toggleHtmlClass(GRAYSCALE_CLASS);

	if (grayscaleMode) {
		add();
	} else {
		remove();
	}
}
