import type { IDispatchOptions } from './type';

// 订阅函数的类型定义
type TSubscribeFunc<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> = (state: Model<TState, TEffects>, silent: boolean) => any;

class Model<
  TState extends Record<string, any> = Record<string, any>,
  TEffects extends Record<string, any> = Record<string, any>,
> {
  state: TState = {} as TState;

  _subscribes: TSubscribeFunc<TState, TEffects>[] = []; // 事件总线
  isUnMount: boolean = false; // 添加：标记组件是否已卸载

  // 构造函数：创建实例时初始化状态
  constructor(initState: TState) {
    this.state = initState;
  }

  // 获取当前状态
  getState(): TState {
    return this.state;
  }

  // 更新状态（支持部分更新）
  setState(newState: Partial<TState>): void {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.dispatch(); // 添加：状态更新后，通知所有订阅者
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

  dispatch(options?: IDispatchOptions): void {
    if (this.isUnMount) return;
    this._subscribes.forEach((func) => func(this, options?.silent || false));
  }
}

export { Model };
