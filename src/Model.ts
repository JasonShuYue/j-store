import { useCallback } from 'react';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
import { useMemoizedFn } from './hooks';
import type { IDispatchOptions, IModelConfig, TEqualityFn } from './type';
import { shallowEqualKeys } from './utils';

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

  constructor(public config: IModelConfig<TState, TEffects>) {}

  init() {
    if (!this._isInited) {
      this._isInited = true;
      this.state = { ...this.config.state };
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
      if (typeof state === 'function') {
        this.state = { ...this._preState, ...state(this.state) };
      } else {
        this.state = { ...this._preState, ...state };
      }
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
}
