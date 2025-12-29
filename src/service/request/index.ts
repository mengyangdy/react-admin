import { message } from "antd";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { globalConfig } from "@/config";
import { trimParams } from "@/utils/common"
// 1. 定义一个自定义的接口，覆盖默认的 get/post/put/delete 方法
interface CustomAxiosInstance extends Omit<
  AxiosInstance,
  "get" | "post" | "put" | "delete"
> {
  // biome-ignore lint/suspicious/noExplicitAny: 基础请求
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // biome-ignore lint/suspicious/noExplicitAny: 基础请求
  post<T = any>(
    url: string,
    // biome-ignore lint/suspicious/noExplicitAny: 基础请求
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  // biome-ignore lint/suspicious/noExplicitAny: 基础请求
  put<T = any>(
    url: string,
    // biome-ignore lint/suspicious/noExplicitAny: 基础请求
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  // biome-ignore lint/suspicious/noExplicitAny: 基础请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // 如果你需要 patch 等其他方法，也可以在这里补上
}

// 1. 创建实例
const request = axios.create({
  baseURL: globalConfig.serviceBaseURL,
  timeout: 10000,
  headers: {
    apifoxToken: "vnoZg5E9AEYMlHivP9X6QSZrNC41Puyx",
  },
}) as unknown as CustomAxiosInstance;

// 2. 请求拦截器：注入 Token + 全局 Trim 去空格
request.interceptors.request.use(
  (config) => {
    if (config.params) {
      config.params = trimParams(config.params);
    }
    if (config.data && !(config.data instanceof FormData)) {
      config.data = trimParams(config.data);
    }

    // 假设 Token 存在 localStorage 或 Zustand 中
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 响应拦截器：脱壳 + 全局错误
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 最佳实践：直接返回 data，不要返回整个 AxiosResponse
    // 这样你在组件里 data.data 这种嵌套就少了一层
    return response.data;
  },
  (error) => {
    // 处理 HTTP 状态码错误
    const status = error.response?.status;
    switch (status) {
      case 401:
        // Token 过期，清除数据并跳转登录
        localStorage.clear();
        window.location.href = "/login";
        break;
      case 403:
        message.error("没有权限访问");
        break;
      case 500:
        message.error("服务器出错了");
        break;
      default:
        message.error(error.message || "网络请求失败");
    }
    return Promise.reject(error);
  }
);

/**
 * 创建其他服务的请求实例
 * @param serviceKey - 服务标识 key，需要在 App.Service.OtherBaseURLKey 中定义
 * @param customConfig - 自定义配置，会覆盖默认配置
 * @returns 配置好的请求实例
 */
export function createOtherServiceRequest(
  serviceKey: App.Service.OtherBaseURLKey,
  customConfig?: AxiosRequestConfig
) {
  const baseURL = globalConfig.serviceOtherBaseURL[serviceKey];
  if (!baseURL) {
    throw new Error(`服务 ${serviceKey} 的 baseURL 未配置`);
  }

  // 创建新的 axios 实例
  const otherRequest = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      apifoxToken: "vnoZg5E9AEYMlHivP9X6QSZrNC41Puyx",
      ...customConfig?.headers,
    },
    ...customConfig,
  }) as unknown as CustomAxiosInstance;

  // 复用相同的请求拦截器
  otherRequest.interceptors.request.use(
    (config) => {
      if (config.params) {
        config.params = trimParams(config.params);
      }
      if (config.data && !(config.data instanceof FormData)) {
        config.data = trimParams(config.data);
      }
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 复用相同的响应拦截器
  otherRequest.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    (error) => {
      const status = error.response?.status;
      switch (status) {
        case 401:
          localStorage.clear();
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问");
          break;
        case 500:
          message.error("服务器出错了");
          break;
        default:
          message.error(error.message || "网络请求失败");
      }
      return Promise.reject(error);
    }
  );

  return otherRequest;
}

export default request;
