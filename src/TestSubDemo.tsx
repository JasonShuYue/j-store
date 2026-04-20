// src/TestSubDemo.tsx
import React, { useEffect } from 'react';
import { Model } from './Model';
const counter = new Model({ count: 0 });
export default function BasicModelDemo() {
  useEffect(() => {
    // 使用 new 关键字创建Model的实例
    // { count: 0 } 作为初始状态传给构造函数

    // 手动添加一些订阅者来测试
    counter._subscribes.push(() => console.log('订阅者1收到通知'));
    counter._subscribes.push(() => console.log('订阅者2收到通知'));
  }, []);

  return (
    <div>
      <h3>基础Model测试</h3>
      <button
        onClick={() => {
          counter.setState({ count: 1 });
        }}
      >
        点击
      </button>
      <p>打开浏览器控制台查看输出结果</p>
    </div>
  );
}
