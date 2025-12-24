import { keepPreviousData, type QueryKey, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

// ==========================================
// 1. 类型定义
// ==========================================

export type MaybePromise<T> = T | Promise<T>;

export type ApiFn = (args: any) => Promise<unknown>;

export type TableColumnCheck = {
	checked: boolean;
	key: string;
	title: string;
};

export type TableDataWithIndex<T> = T & { index: number };

export type TransformedData<T> = {
	data: TableDataWithIndex<T>[];
	pageNum: number;
	pageSize: number;
	total: number;
};

export type Transformer<T, Response> = (response: Response) => TransformedData<T>;

export type TableConfig<A extends ApiFn, T, C> = {
	/**
	 * React Query 的唯一标识符
	 * @example ['userList']
	 */
	queryKey: QueryKey;

	/** 获取表格数据的 API 函数 */
	apiFn: A;

	/** API 初始参数 (默认 { current: 1, size: 10 }) */
	apiParams?: Parameters<A>[0];

	/** 列配置工厂函数 */
	columns: () => C[];

	/** 获取列的显示状态 */
	getColumnChecks: (columns: C[]) => TableColumnCheck[];

	/** 根据显示状态过滤列 */
	getColumns: (columns: C[], checks: TableColumnCheck[]) => C[];

	/**
	 * 是否立即请求数据
	 * @default true
	 */
	immediate?: boolean;

	/** 是否将参数同步到 URL 地址栏 */
	isChangeURL?: boolean;

	/** 请求成功后的回调 */
	onFetched?: (transformed: TransformedData<T>) => MaybePromise<void>;

	/** 响应数据转换器 */
	transformer: Transformer<T, Awaited<ReturnType<A>>>;

	/** 请求前参数转换 (例如把 params 转换成后端需要的格式) */
	transformParams?: (params: Parameters<A>[0]) => Parameters<A>[0];
};

// ==========================================
// 2. Hook 实现
// ==========================================

export function useHookTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>) {
	const {
		queryKey,
		apiFn,
		apiParams,
		getColumnChecks,
		getColumns,
		immediate = true,
		isChangeURL = false,
		transformer,
		transformParams,
		onFetched,
	} = config;

	const navigate = useNavigate();

	// ----------------------------------------
	// 状态管理
	// ----------------------------------------

	// 1. 搜索参数：使用 useState 替代 useRef，以便 React Query 感知变化
	// 默认值逻辑：优先使用传入的 apiParams，否则使用默认分页
	const [searchParams, setSearchParams] = useState<Parameters<A>[0]>(
		() => apiParams || { current: 1, size: 10 },
	);

	// 2. 列配置管理
	// 使用 useMemo 防止 columns 工厂函数在每次渲染时都被调用
	const allColumns: C[] = useMemo(() => config.columns(), []); // 只初始化一次

	const [columnChecks, setColumnChecks] = useState<TableColumnCheck[]>(() =>
		getColumnChecks(allColumns),
	);

	const columns = useMemo(
		() => getColumns(allColumns, columnChecks),
		[allColumns, columnChecks, getColumns],
	);

	// ----------------------------------------
	// 数据请求逻辑 (Query Function)
	// ----------------------------------------

	const fetchData = async () => {
		// 1. 清洗参数 (去除 null/undefined/空字符串)
		let formattedParams = formatSearchParams(searchParams);

		// 2. 如果有自定义参数转换，执行转换
		if (transformParams) {
			formattedParams = transformParams(formattedParams);
		}

		// 3. 发起请求
		const response = await apiFn(formattedParams);

		// 4. 转换响应数据
		const transformed = transformer(response as Awaited<ReturnType<A>>);

		// 5. 执行回调 (如果有)
		if (onFetched) {
			await onFetched(transformed);
		}

		return transformed;
	};

	// ----------------------------------------
	// React Query 集成
	// ----------------------------------------

	const {
		data: queryData,
		isFetching,
		refetch,
		isError,
	} = useQuery({
		// 将 searchParams 加入 queryKey，当 setSearchParams 更新时自动触发请求
		queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), searchParams],
		queryFn: fetchData,
		enabled: immediate, // 控制是否在组件挂载时立即请求
		placeholderData: keepPreviousData, // 关键：翻页时保留上一页数据，防止表格闪烁
		staleTime: 0, // 总是视为过时，确保数据尽可能新鲜 (可根据需求调整)
	});

	// 构造最终数据 (处理首次加载 data 为 undefined 的情况)
	const finalData: TransformedData<T> = queryData || {
		data: [],
		pageNum: (searchParams as any).current || 1,
		pageSize: (searchParams as any).size || 10,
		total: 0,
	};

	// ----------------------------------------
	// URL 同步逻辑 (TanStack Router)
	// ----------------------------------------

	useEffect(() => {
		if (!isChangeURL) return;

		const cleanParams = formatSearchParams(searchParams);

		navigate({
			to: ".", // 保持当前路由
			search: (old: any) => ({
				...old, // 保留原有的 URL 参数
				...cleanParams, // 覆盖新的查询参数
			}),
			replace: true, // 替换历史记录，避免点后退键时陷入死循环
		});
	}, [searchParams, isChangeURL, navigate]);

	// ----------------------------------------
	// 操作方法
	// ----------------------------------------

	/**
	 * 更新查询参数
	 * @param params 部分参数
	 */
	const updateSearchParams = useCallback(
		(params: Partial<Parameters<A>[0]> | { current?: number; size?: number }) => {
			setSearchParams((prev: any) => ({
				...prev,
				...params,
			}));
			// 注意：不需要手动调用 refetch()，React Query 会因为 key 变化自动触发
		},
		[],
	);

	/**
	 * 重置查询参数
	 */
	const resetSearchParams = useCallback(() => {
		const defaultParams = apiParams || { current: 1, size: 10 };
		setSearchParams(defaultParams as Parameters<A>[0]);
	}, [apiParams]);

	// ----------------------------------------
	// 返回结果
	// ----------------------------------------

	return {
		// 列相关
		columnChecks,
		columns,
		setColumnChecks,

		// 数据相关
		data: finalData.data,
		total: finalData.total,
		pageNum: finalData.pageNum,
		pageSize: finalData.pageSize,
		empty: !isFetching && finalData.data.length === 0,

		// 状态相关
		loading: isFetching, // 使用 isFetching 可以捕捉翻页loading
		error: isError,

		// 操作相关
		getData: refetch, // 暴露手动刷新方法
		searchParams,
		updateSearchParams,
		resetSearchParams,
	};
}

// ==========================================
// 3. 工具函数
// ==========================================

function formatSearchParams(params: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(params).filter(
			([_, value]) => value !== null && value !== undefined && value !== "",
		),
	);
}
