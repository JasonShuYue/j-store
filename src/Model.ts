import type { IDispatchOptions } from './type';

type IEffects<M extends Model<any, any>> = Record<
  string,
  ((this: M, ...args: any[]) => any) | any
>;

export interface IModelConfig<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends IEffects<Model<TState, TEffects>> = IEffects<Model>,
> {
  state: TState;
  effects?: Partial<TEffects>;
}

type TSubscribeFunc<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> = (state: Model<TState, TEffects>, silent: boolean) => any;

class Model<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> {
  // 基础属性
  isUnMount = false;
  state: TState = {} as TState;
  _preState: TState = {} as TState;
  _subscribes: TSubscribeFunc<TState, TEffects>[] = [];
  _isInited = false;

  // 🔧 关键修正：使用配置对象构造函数
  constructor(public config: IModelConfig<TState, TEffects>) {
    // 注意：不在构造函数中初始化state，而是延迟到init()
  }

  // 🆕 新增：延迟初始化方法
  init() {
    if (!this._isInited) {
      this._isInited = true;
      this.state = { ...this.config.state };
      this._preState = { ...this.state };
    }
  }

  // 获取当前状态
  getState(): TState {
    if (!this._isInited) {
      this.init();
    }
    return this.state;
  }

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
}

export { Model };
