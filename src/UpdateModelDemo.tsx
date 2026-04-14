// src/UpdateModelDemo.tsx
import React, { useEffect } from 'react';
import { Model } from './Model';

export default function UpdateModelDemo() {
  useEffect(() => {
    // 创建一个有多个属性的状态
    const counter = new Model({
      count: 0,
      name: 'My Counter',
      theme: 'light',
    });

    console.log('初始状态:', counter.getState());
    // 输出：{ count: 0, name: 'My Counter', theme: 'light' }

    // 只更新 count，其他属性应该保持不变
    counter.setState({ count: 5 });
    console.log('更新count后:', counter.getState());
    // 输出：{ count: 5, name: 'My Counter', theme: 'light' }
    // 看！name 和 theme 都还在！

    // 再更新 theme
    counter.setState({ theme: 'dark' });
    console.log('更新theme后:', counter.getState());
    // 输出：{ count: 5, name: 'My Counter', theme: 'dark' }
  }, []);

  return (
    <div>
      <h3>状态更新测试</h3>
      <p>打开浏览器控制台查看状态更新过程</p>
    </div>
  );
}
