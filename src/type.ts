// 相等性比较函数类型
export type TEqualityFn<TState extends Record<string, any>> = (
  prevState: TState,
  nextState: TState,
) => boolean;

// 异步值类型
export type TPromiseValue<T> = T | Promise<T>;

// 计算属性处理函数类型
export type TComputedHandler<TState, R = any> = (
  state: TState,
  prevState: TState,
  diff: Record<keyof TState & string, boolean>,
) => R;

// 监听器配置类型
export type TWatch<TState extends Record<string, any>> = {
  keys: (keyof TState)[];
  handler: TComputedHandler<TState, any>;
}[];

// 计算属性配置类型
export type TComputed<TState extends Record<string, any>> = (
  | {
      keys: (keyof TState)[];
      handler: TComputedHandler<TState, Partial<TState>>;
    }
  | ((state: TState, prevState: TState) => Partial<TState>)
)[];

// 分发选项接口
export interface IDispatchOptions {
  silent?: boolean;
}

// 选择器函数类型
export type TSelectorFn<TState> = (state: TState) => Partial<TState>;
