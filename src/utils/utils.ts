import type { TComputed, TWatch } from '../type';

// src/utils.ts - 在现有工具函数基础上添加
interface IComputedConfig<TState extends Record<string, any>> {
  prevState: TState;
  nextState: TState;
  computed?: TComputed<TState>;
}

// 🆕 新增：计算属性处理函数
export function calcComputedState<TState extends Record<string, any>>({
  prevState,
  nextState,
  computed,
}: {
  prevState: TState;
  nextState: TState;
  computed?: TComputed<TState>;
}): TState {
  // 如果没有计算属性配置，直接返回
  if (!computed || !computed.length) {
    return nextState;
  }

  let updatedState = { ...nextState };

  // 遍历所有计算属性配置
  for (const computedConfig of computed) {
    if (typeof computedConfig === 'function') {
      // 函数形式：直接执行
      const computedResult = computedConfig(updatedState, prevState);
      updatedState = { ...updatedState, ...computedResult };
    } else {
      // 对象形式：检查依赖字段是否变化
      const { keys, handler } = computedConfig;

      // 检查依赖的字段是否发生变化
      const hasChanged = keys.some((key) => prevState[key] !== nextState[key]);

      if (hasChanged) {
        // 创建diff对象，标记哪些字段发生了变化
        const diff = {} as Record<keyof TState & string, boolean>;
        keys.forEach((key) => {
          diff[key as keyof TState & string] =
            prevState[key] !== nextState[key];
        });

        // 执行计算函数
        const computedResult = handler(updatedState, prevState, diff);

        // 合并计算结果
        updatedState = { ...updatedState, ...computedResult };
      }
    }
  }

  return updatedState;
}

// 🆕 新增：计算字段差异的函数（源码中的实现）
export function calcDiffKeys(
  obj1: object,
  obj2: object,
  keys: (string | number | symbol)[],
) {
  const diffKeysMap: Record<string | number | symbol, boolean> = {};
  let diff = false;

  keys.forEach((key) => {
    // @ts-ignore
    if (!Object.is(obj1[key], obj2[key])) {
      diffKeysMap[key] = true;
      diff = true;
    }
  });

  return {
    diffKeysMap, // 变化字段的映射
    diff, // 是否有变化
  };
}

// 🆕 新增：执行Watch处理函数（源码中的实现）
interface IWatchConfig<TState extends Record<string, any>> {
  prevState: TState;
  nextState: TState;
  watch?: TWatch<TState>;
}
export function execWatchHandler<TState extends Record<string, any>>({
  prevState,
  nextState,
  watch,
}: IWatchConfig<TState>) {
  if (watch) {
    watch.forEach((watchItem) => {
      if (watchItem.keys) {
        // 检查监听的字段是否发生变化
        const { diffKeysMap, diff } = calcDiffKeys(
          prevState,
          nextState,
          watchItem.keys,
        );

        // 只有监听的字段发生变化时才执行handler
        if (diff) {
          // 执行Watch处理函数
          watchItem.handler &&
            watchItem.handler(nextState, prevState, diffKeysMap);
        }
      }
    });
  }
}
