import { message } from "antd";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { globalConfig } from "@/config";

// 1. 定义一个自定义的接口，覆盖默认的 get/post/put/delete 方法
interface CustomAxiosInstance extends Omit<
  AxiosInstance,
  "get" | "post" | "put" | "delete"
> {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
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

// 2. 请求拦截器：注入 Token
request.interceptors.request.use(
  (config) => {
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

export default request;
