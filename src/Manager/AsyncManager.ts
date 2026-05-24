// AsyncManager配置选项
export interface AsyncManagerOptions {
  retryCount?: number; // 重试次数
  retryInterval?: number; // 重试间隔（毫秒）
}

// 执行函数的类型定义
type AsyncExecFunction<T> = (
  aborts: {
    lastAbortController: AbortController | null; // 上一个请求的控制器
    abortController: AbortController; // 当前请求的控制器
  },
  tryCount: number, // 当前重试次数
) => Promise<T>;
