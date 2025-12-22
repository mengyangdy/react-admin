import { localStg } from "@/utils/storage.ts";

import { themeSettings } from "./theme/settings.ts";
import { getServiceBaseURL } from "./utils/service.ts";

const isDev = import.meta.env.DEV;
const isHttpProxy = isDev && import.meta.env.VITE_HTTP_PROXY === "Y";

const { baseURL, otherBaseURL } = getServiceBaseURL(
  import.meta.env,
  isHttpProxy
);

class GlobalConfig {
  private _defaultDarkMode = false;
  /** - 空函数 */
  private _noop = () => {};
  constructor() {
    this._defaultThemeColor =
      localStg.get("themeColor") || themeSettings.themeColor;
    /** - 初始化默认暗色模式 */
    this._defaultDarkMode = localStg.get("darkMode") || this._defaultDarkMode;
  }
  /** - 默认主题颜色 */
  private _defaultThemeColor = themeSettings.themeColor;
  /** - 是否开发环境 */
  private _isDev = isDev;
  get isDev() {
    return this._isDev;
  }
  /** - 默认主题颜色 */
  get defaultThemeColor() {
    return this._defaultThemeColor;
  }
  /** - 设置默认主题颜色 */
  set defaultThemeColor(themeColor: string) {
    this._defaultThemeColor = themeColor;
  }
  /** - 空函数 */
  get noop() {
    return this._noop;
  }
  /** - 默认暗色模式 */
  get defaultDarkMode() {
    return this._defaultDarkMode;
  }
  /** - 设置默认暗色模式 */
  set defaultDarkMode(darkMode: boolean) {
    this._defaultDarkMode = darkMode;
  }
  /** - 服务基础URL */
  private _serviceBaseURL = baseURL;
  /** - 服务基础URL */
  get serviceBaseURL() {
    return this._serviceBaseURL;
  }
  /** - 服务其他基础URL */
  private _serviceOtherBaseURL = otherBaseURL;
  /** - 服务其他基础URL */
  get serviceOtherBaseURL() {
    return this._serviceOtherBaseURL;
  }
  private _homePath = import.meta.env.VITE_ROUTE_HOME;
  /** - 首页路径 */
  get homePath() {
    return this._homePath;
  }
}
export const globalConfig = new GlobalConfig();
