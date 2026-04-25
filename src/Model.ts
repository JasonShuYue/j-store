import { useCallback } from 'react';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
import { useMemoizedFn } from './hooks';
import type {
  IDispatchOptions,
  IModelConfig,
  TComputed,
  TEqualityFn,
} from './type';
import { calcComputedState, shallowEqualKeys } from './utils';

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

type TSubscribeFunc<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> = (state: Model<TState, TEffects>, silent: boolean) => any;

export class Model<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> {
  isUnMount = false;
  state: TState = {} as TState;
  _preState: TState = {} as TState;
  _subscribes: TSubscribeFunc<TState, TEffects>[] = [];
  _isInited = false;

  effects?: Partial<TEffects>;
  computed?: TComputed<TState>; // 🆕 新增：计算属性配置

  constructor(public config: IModelConfig<TState, TEffects>) {}

  init() {
    if (!this._isInited) {
      this._isInited = true;
      const config = this.config;

      // 🆕 使用 getActualState 处理初始状态（包含计算属性）
      this.state = this.getActualState({} as TState, config.state || {});
      this._preState = { ...this.state };
    }
  }

  getState = (): TState => {
    if (!this._isInited) {
      this.init();
    }
    return this.state;
  };

  setState(
    state: Partial<TState> | ((state: TState) => Partial<TState>),
    options?: IDispatchOptions,
  ) {
    if (!this._isInited) {
      this.init();
    }

    if (state) {
      // 1. 处理函数形式的state
      let payload: Partial<TState>;
      if (typeof state === 'function') {
        payload = state(this.state);
      } else {
        payload = state;
      }

      // 🆕 2. 使用getActualState处理状态（包含计算属性）
      this.state = this.getActualState(this._preState, payload);

      // 3. 分发更新
      this.dispatch(options);
      this._preState = { ...this.state };
    }
  }

  dispatch(options?: IDispatchOptions): void {
    if (this.isUnMount) return;

    this._subscribes.forEach((func) => func(this, options?.silent || false));
  }

  subscribe(func: TSubscribeFunc<TState, TEffects>): () => void {
    this._subscribes.push(func);
    return () => {
      this.unsubscribe(func);
    };
  }

  unsubscribe(func: TSubscribeFunc<TState, TEffects>): void {
    if (this._subscribes.length) {
      this._subscribes = this._subscribes.filter((fn) => fn !== func);
    }
  }

  useSelector = (equalityFn?: TEqualityFn<TState>) => {
    const subscribe = useCallback(
      (listener: () => void) => {
        return this.subscribe((_, silent) => {
          if (!silent) {
            listener();
          }
        });
      },
      [this],
    );

    const selector = useMemoizedFn((state: TState) => state);
    const isEqual = useMemoizedFn((prevState: TState, nextState: TState) => {
      if (equalityFn) {
        return equalityFn(prevState, nextState);
      }
      return Object.is(prevState, nextState);
    });

    const state = useSyncExternalStoreWithSelector(
      subscribe,
      this.getState,
      this.getState,
      selector,
      isEqual,
    );

    return state;
  };

  useGetState = <Key extends keyof TState & string>(
    keys?: Key[],
    equalityFn?: TEqualityFn<TState>,
  ) => {
    return this.useSelector((prevState, nextState) => {
      if (equalityFn) {
        return equalityFn(prevState, nextState);
      }
      if (keys && shallowEqualKeys(prevState, nextState, keys)) {
        return true;
      }
      return false;
    });
  };

  // 🆕 新增：getActualState方法（源码中的核心方法）
  getActualState(prevState: TState, payload: Partial<TState>): TState {
    // 1. 合并状态
    let nextState = { ...prevState, ...payload };

    // 2. 获取配置
    const { computed } = this.config || {};

    // 🆕 3. 处理计算属性
    nextState = calcComputedState<TState>({
      prevState,
      nextState,
      computed,
    });

    // 4. 执行 watch（后续章节会实现）
    // execWatchHandler({
    //   prevState,
    //   nextState,
    //   watch,
    // });

    return nextState;
  }
}
