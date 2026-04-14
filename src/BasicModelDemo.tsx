// src/BasicModelDemo.tsx
import { useEffect } from 'react';
import { Model } from './Model';

export default function BasicModelDemo() {
  useEffect(() => {
    // 使用 new 关键字创建Model的实例
    // { count: 0 } 作为初始状态传给构造函数
    const counter = new Model({ count: 0 });

    // 调用getState方法获取状态
    console.log('Model创建成功，状态:', counter.getState());
  }, []);

  return (
    <div>
      <h3>基础Model测试</h3>
      <p>打开浏览器控制台查看输出结果</p>
    </div>
  );
}
