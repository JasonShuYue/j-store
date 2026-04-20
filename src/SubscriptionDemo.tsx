import React, { useEffect, useState } from 'react';
import { Model } from './Model';

interface CounterState {
  count: number;
  name: string;
}

export default function SubscriptionDemo() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    // 创建Model实例（使用config模式）
    const counter = new Model<CounterState>({
      count: 0,
      name: 'My Counter',
    });

    addLog('✅ Model创建完成');

    // 模拟组件A订阅
    const unsubscribeA = counter.subscribe((model, silent) => {
      if (!silent) {
        addLog(`🔔 组件A收到通知: count=${model.getState().count}`);
      }
    });

    // 模拟组件B订阅
    const unsubscribeB = counter.subscribe((model, silent) => {
      if (!silent) {
        addLog(`🔔 组件B收到通知: name=${model.getState().name}`);
      }
    });

    // 模拟组件C订阅
    const unsubscribeC = counter.subscribe((model, silent) => {
      if (!silent) {
        addLog(`🔔 组件C收到通知: 状态已更新`);
      }
    });

    addLog('📝 三个组件已订阅状态变化');

    // 测试状态更新
    setTimeout(() => {
      addLog('🔄 开始测试状态更新...');
      counter.setState({ count: 1 });
    }, 1000);

    setTimeout(() => {
      counter.setState({ name: 'Updated Counter' });
    }, 2000);

    setTimeout(() => {
      counter.setState({ count: 5, name: 'Final Counter' });
    }, 3000);

    // 测试取消订阅
    setTimeout(() => {
      addLog('❌ 组件B取消订阅');
      unsubscribeB();
    }, 4000);

    setTimeout(() => {
      addLog('🔄 组件B取消订阅后，再次更新状态...');
      counter.setState({ count: 10 });
    }, 5000);

    // 测试静默更新
    setTimeout(() => {
      addLog('🔇 测试静默更新（不会触发订阅者）...');
      counter.dispatch({ silent: true });
    }, 6000);

    // 测试isUnMount功能
    setTimeout(() => {
      addLog('🚫 模拟组件卸载...');
      counter.isUnMount = true;
      counter.setState({ count: 999 }); // 这次不会触发订阅者
      addLog('📝 组件卸载后，dispatch被阻止执行');
    }, 7000);

    return () => {
      unsubscribeA();
      unsubscribeC();
      // 模拟组件卸载
      counter.isUnMount = true;
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>订阅机制演示</h3>
      <div
        style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <h4>实时日志：</h4>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              marginBottom: '5px',
              padding: '2px 5px',
              background: 'white',
              borderRadius: '3px',
            }}
          >
            {log}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p>📖 观察日志，你会看到：</p>
        <ul>
          <li>三个组件都订阅了状态变化</li>
          <li>每次状态更新时，所有订阅者都收到通知</li>
          <li>组件B取消订阅后，不再收到通知</li>
          <li>其他组件继续正常接收通知</li>
          <li>静默更新时，所有订阅者都不会收到通知</li>
          <li>组件卸载后，dispatch被阻止执行</li>
        </ul>
      </div>
    </div>
  );
}
