// src/TypeSafeModelDemo.tsx
import React, { useEffect } from 'react';
import { Model } from './Model';

// 定义状态接口
interface CounterState {
  count: number;
  name: string;
  theme: 'light' | 'dark';
}

export default function TypeSafeModelDemo() {
  useEffect(() => {
    // 创建类型安全的Model
    const counter = new Model<CounterState>({
      count: 0,
      name: 'My Counter',
      theme: 'light',
    });

    console.log('初始状态:', counter.getState());

    // 测试类型检查
    counter.setState({ count: 1 }); // ✅ 正确
    console.log('更新count后:', counter.getState());

    counter.setState({ name: 'New Name' }); // ✅ 正确
    console.log('更新name后:', counter.getState());

    counter.setState({ theme: 'dark' }); // ✅ 正确
    console.log('更新theme后:', counter.getState());

    // 这些会报TypeScript错误（注释掉的代码）：
    // counter.setState({ count: 'hello' });     // ❌ count应该是number
    // counter.setState({ coun: 1 });            // ❌ 属性名错误
    // counter.setState({ theme: 'blue' });      // ❌ theme只能是'light'或'dark'
    // counter.setState({ age: 25 });            // ❌ CounterState中没有age属性
  }, []);

  return (
    <div>
      <h3>类型安全测试</h3>
      <p>打开浏览器控制台查看类型安全的状态更新</p>
      <p>在编辑器中尝试修改代码，体验TypeScript的类型检查</p>
    </div>
  );
}
