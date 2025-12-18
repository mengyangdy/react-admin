declare namespace StorageType {
	interface Session {
		themeColor: string;
	}
	type ThemeMode = import("ahooks/lib/useTheme").ThemeModeType;
	interface Local {
		darkMode: boolean;
		globalTabs: App.Global.Tab[];
		lang: App.I18n.LangType;
		mixSiderFixed: CommonType.YesOrNo;
		overrideThemeFlag: string;
		previousUserId: string | number;
		refreshToken: string;
		themeColor: string;
		themeScheme: ThemeMode;
		themeSettings: App.Theme.ThemeSetting;
		token: string;
		userInfo: Api.Auth.UserInfo;
	}
}
