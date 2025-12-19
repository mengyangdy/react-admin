import json5 from "json5";

/**
 * 根据当前环境变量创建服务配置对象
 * 解析环境变量中的 URL 配置，并生成对应的代理匹配规则
 *
 * @param env - 当前的环境变量对象 (通常来自 import.meta.env)
 * @returns 处理后的服务配置对象，包含主服务和其他服务的详细信息
 */
export function createServiceConfig(env: Env.ImportMeta) {
	// 从环境变量中解构出：额外服务的 Base URL (JSON 字符串) 和 主服务的 Base URL
	const { VITE_OTHER_SERVICE_BASE_URL, VITE_SERVICE_BASE_URL } = env;

	// 用于存储解析后的其他服务 URL 键值对
	let other = {} as Record<App.Service.OtherBaseURLKey, string>;
	try {
		// 使用 json5 解析，因为它比标准 JSON 更宽松（支持单引号、尾随逗号等），适合写在 .env 文件中
		other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
	} catch {
		// 如果解析失败，默认为空对象，不做处理
	}

	// 构建基础的 HTTP 配置对象
	const httpConfig: App.Service.SimpleServiceConfig = {
		baseURL: VITE_SERVICE_BASE_URL,
		other,
	};

	// 获取所有额外服务的 key (例如: 'demo', 'upload' 等)
	const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

	// 遍历额外服务，为每个服务生成详细配置（包含真实 URL 和代理匹配前缀）
	const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map((key) => {
		return {
			baseURL: httpConfig.other[key], // 真实的远程 URL
			key, // 服务的标识 key
			proxyPattern: createProxyPattern(key), // 生成代理前缀，如 '/proxy-upload'
		};
	});

	// 组装最终的配置对象
	const config: App.Service.ServiceConfig = {
		baseURL: httpConfig.baseURL, // 主服务真实 URL
		other: otherConfig, // 其他服务配置列表
		proxyPattern: createProxyPattern(), // 主服务的代理前缀 (默认为 /proxy-default)
	};

	return config;
}

/**
 * 获取后端服务的 Base URL
 * 根据 isProxy 参数决定是返回“本地代理地址”还是“远程真实地址”
 *
 * @param env - 当前环境变量
 * @param isProxy - 是否开启代理 (开发环境通常为 true，生产环境通常为 false)
 * @returns 包含主服务和其他服务最终可用的 URL 对象
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
	// 1. 先获取完整的配置信息
	const { baseURL, other } = createServiceConfig(env);

	// 用于存储最终计算出的其他服务 URL
	const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

	// 2. 遍历其他服务，根据是否开启代理来赋值
	other.forEach((item) => {
		// 如果开启代理，使用 '/proxy-xxx'；否则使用 'https://api.xxx.com'
		otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
	});

	return {
		// 3. 决定主服务的 URL
		// 如果开启代理，返回 '/proxy-default'；否则返回环境变量里的真实地址
		baseURL: isProxy ? createProxyPattern() : baseURL,
		otherBaseURL,
	};
}

/**
 * 生成后端服务的代理匹配规则（Proxy Pattern）
 * 用于 Vite 的 server.proxy 匹配，也用于前端发起请求时的路径前缀
 *
 * @param key - 服务的标识 key (可选)
 * @returns 代理前缀字符串
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
	// 如果没有传 key，说明是主服务（默认服务），返回默认前缀
	if (!key) {
		return "/proxy-default";
	}

	// 如果有 key，返回对应服务的专用前缀，例如 "/proxy-upload"
	return `/proxy-${key}`;
}
