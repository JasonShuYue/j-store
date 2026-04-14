// src/CompleteModelDemo.tsx
import React, { useEffect } from 'react';
import { Model } from './Model';

// 定义一个复杂的状态接口
interface AppState {
  user: {
    name: string;
    age: number;
  };
  settings: {
    theme: 'light' | 'dark';
    language: 'zh' | 'en';
  };
  counters: {
    likes: number;
    views: number;
  };
}

export default function CompleteModelDemo() {
  useEffect(() => {
    // 创建实例
    const app = new Model<AppState>({
      user: {
        name: 'John',
        age: 25,
      },
      settings: {
        theme: 'light',
        language: 'zh',
      },
      counters: {
        likes: 0,
        views: 0,
      },
    });

    // 测试各种更新操作
    console.log('=== 初始状态 ===');
    console.log(app.getState());

    console.log('=== 更新用户信息 ===');
    app.setState({
      user: {
        name: 'Jane',
        age: 28,
      },
    });

    console.log('=== 更新设置 ===');
    app.setState({
      settings: {
        theme: 'dark',
        language: 'en',
      },
    });

    console.log('=== 更新计数器 ===');
    app.setState({
      counters: {
        likes: 10,
        views: 100,
      },
    });

    console.log('=== 只更新部分属性 ===');
    app.setState({
      user: {
        name: 'Bob',
        age: 30,
      },
    });
    console.log('注意：settings和counters保持不变');
  }, []);

  return (
    <div>
      <h3>完整功能测试</h3>
      <p>打开浏览器控制台查看完整的状态管理演示</p>
      <p>这个演示展示了复杂状态的创建、更新和合并功能</p>
    </div>
  );
}
