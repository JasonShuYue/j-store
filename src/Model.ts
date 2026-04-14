class Model<TState extends Record<string, any>> {
  state: TState;

  // 构造函数：创建实例时初始化状态
  constructor(initState: TState) {
    this.state = initState;
    console.log('✅ Model创建成功，初始状态:', this.state);
  }

  // 获取当前状态
  getState(): TState {
    console.log('📖 获取状态:', this.state);
    return this.state;
  }

  // 更新状态（支持部分更新）
  setState(newState: Partial<TState>): void {
    const prevState = this.state;

    this.state = {
      ...this.state,
      ...newState,
    };

    console.log('🔄 状态更新:', {
      之前: prevState,
      现在: this.state,
      变化: newState,
    });
  }
}

export { Model };
