// src/counterStore.ts
import { Model } from '../Model';

interface CounterState {
  count: number;
  name: string;
  lastUpdated: number;
}

const counterStore = new Model<CounterState>({
  state: {
    count: 0,
    name: 'My Counter',
    lastUpdated: Date.now(),
  },
});

// 辅助函数
const increment = () => {
  const currentState = counterStore.getState();
  counterStore.setState({
    count: currentState.count + 1,
    lastUpdated: Date.now(),
  });
};

const decrement = () => {
  const currentState = counterStore.getState();
  counterStore.setState({
    count: currentState.count - 1,
    lastUpdated: Date.now(),
  });
};

const updateName = (name: string) => {
  counterStore.setState({
    name,
    lastUpdated: Date.now(),
  });
};

export { counterStore, decrement, increment, updateName };
