import type { TComputed } from '../type';

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
