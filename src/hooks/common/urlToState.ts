import { useEffect, useRef } from "react";

/**
 * 自定义 Hook useURLStateSync 它的核心作用是实现状态state与URL查询参数的双向同步
 * 它解决了两个难题：
 * 1. 双向绑定：修改state会更新state，修改url前进后退会更新state
 * 2. 避免死循环：防止state更新触发更新 URL更新又触发state更新的无限loop
 *
 */
interface UseURLStateSyncOptions<TState> {
  /**
   * 是否开启同步功能
   */
  enabled?: boolean;
  /**
   * 当前的 URL 查询参数如 "?page=1&size=10"）
   */
  locationSearch: string;
  /**
   * 路由跳转函数来自tanstack/router
   * @param opts
   * @returns
   */
  navigate: (opts: {
    // biome-ignore lint/suspicious/noExplicitAny: 基建
    search: (prev: any) => any;
    /**
     * 是否替换当前历史记录 不新增 history item
     */
    replace?: boolean;
  }) => void;
  state: TState;
  /**
   * 转换器 把URL字符串解析成state对象
   * @param search
   * @returns
   */
  fromURL: (search: string) => TState;
  /**
   * State 对象转换成 URL 参数对象
   * @param state
   * @returns
   */
  // biome-ignore lint/suspicious/noExplicitAny: 基建
  toURL: (state: TState) => Record<string, any>;
  /**
   * 当检测到 URL 变化需要更新 State 时调用的回调函数
   * @param nextState
   * @returns
   */
  onURLChange: (nextState: TState) => void;
}

/**
 *
 * @param param0
 */
export function useURLStateSync<TState>({
  enabled = true, // 默认开启
  locationSearch,
  navigate,
  state,
  fromURL,
  toURL,
  onURLChange,
}: UseURLStateSyncOptions<TState>) {
  // Ref 1: 竞态锁（关键！）
  // 用于标记“当前的状态变化是否是由 URL 驱动的”。
  // 如果是 true，说明正在同步 URL -> State，此时 State -> URL 的副作用应当被拦截。
  const isUrlDrivingRef = useRef(false);
  // Ref 2: 最新值容器（Latest Ref Pattern）
  // 用来存放所有可能频繁变化的函数和状态，解决 useEffect 闭包陷阱和依赖报警问题。
  const latest = useRef({ fromURL, onURLChange, toURL, state });
  // 每次组件渲染（Render）时，都把最新的 props/state 更新到 Ref 里。
  // 这样 useEffect 执行时，永远能通过 latest.current 拿到最新的值，
  // 而不需要把这些变量写进 useEffect 的依赖数组里（避免死循环）。
  latest.current = { fromURL, onURLChange, toURL, state };

  useEffect(() => {
    // 如果未启用，直接不跑
    if (!enabled) return;
    // 从 Ref 中解构出最新的函数和当前状态
    // 这样做既能拿到最新值，又不会让 Linter 报错说没加依赖
    const {
      fromURL: fnFromURL,
      onURLChange: fnOnURLChange,
      state: currentState,
    } = latest.current;
    // 1. 调用解析函数，算出 URL 此刻代表的 State 是什么
    const targetState = fnFromURL(locationSearch);
    // 2. 比较“URL 算出来的 State”和“当前实际 State”是否一样
    // 使用 JSON.stringify 做简易深比较。如果不比较，可能会导致无意义的重渲染。
    const isStateSynced =
      JSON.stringify(targetState) === JSON.stringify(currentState);
    // 3. 如果不一样，说明 URL 变了（比如用户点了浏览器后退），需要更新内部 State
    if (!isStateSynced) {
      // 🚨 举起旗帜：标记这次更新是由 URL 发起的！
      // 这会告诉下一个 useEffect：“别把这次 State 变化又写回 URL 去”
      isUrlDrivingRef.current = true;
      // 调用回调，真正更新组件内的 State
      fnOnURLChange(targetState);
    }
  }, [locationSearch, enabled]);

  useEffect(() => {
    if (!enabled) return;
    // 1. 检查锁：如果是 URL 驱动引起的 State 变化，这里直接退出。
    // 这就是防止 死循环 的核心逻辑。
    if (isUrlDrivingRef.current) {
      // 消费完这个标记，重置为 false
      isUrlDrivingRef.current = false;
      return;
    }

    // 通过 Ref 获取 toURL
    const { toURL: fnToURL } = latest.current;
    // 2. 将当前 State 转换为 URL 参数对象
    const nextSearchParams = fnToURL(state);
    // 3. 双重检查（性能优化）
    // 比较“当前 URL”和“即将写入的参数”是否逻辑相等。
    // 如果相等，就不要执行 navigate。这能避免重复的 replace 操作，防止浏览器历史记录混乱或页面闪烁。
    if (isQueryEqual(locationSearch, nextSearchParams)) {
      return;
    }
    // 4. 执行路由跳转，更新 URL
    navigate({
      search: () => nextSearchParams,
      replace: true,
    });
  }, [state, enabled, locationSearch, navigate]);
}
/**
 * URL 参数比较器
 * @param currentSearch
 * @param nextParams
 * @returns
 */
// biome-ignore lint/suspicious/noExplicitAny: 基建
function isQueryEqual(currentSearch: string, nextParams: Record<string, any>) {
  // 1. 处理当前的 URL 字符串
  const current = new URLSearchParams(currentSearch);
  // 🔑 关键：排序。保证 "?a=1&b=2" 和 "?b=2&a=1" 被视为相等
  current.sort();
  // 2. 处理即将写入的参数对象
  const next = new URLSearchParams();
  Object.entries(nextParams).forEach(([key, value]) => {
    // 🧹 清洗数据：过滤掉 undefined, null 和 空字符串
    // 保持 URL 干净，且避免 "undefined" 字符串出现
    if (value !== undefined && value !== null && value !== "") {
      next.append(key, String(value));
    }
  });
  // 🔑 关键：同样要排序
  next.sort();
  // 3. 比较字符串形式是否一致
  return current.toString() === next.toString();
}
