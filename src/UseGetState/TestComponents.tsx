// src/UseGetState/TestComponent.tsx

import React from 'react';
import { counterStore, decrement, increment, updateName } from './counterStore';

// 完整状态组件
function FullStateComponent() {
  const state = counterStore.useGetState();
  console.log('FullStateComponent 重新渲染');

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
      <h3>完整状态组件</h3>
      <div>计数: {state.count}</div>
      <div>名称: {state.name}</div>
      <div>更新时间: {new Date(state.lastUpdated).toLocaleTimeString()}</div>
    </div>
  );
}

// 只关心count的组件
function CountOnlyComponent() {
  const state = counterStore.useGetState(['count']);
  console.log('CountOnlyComponent 重新渲染');

  return (
    <div style={{ padding: '10px', border: '1px solid #00f', margin: '5px' }}>
      <h3>只关心Count的组件</h3>
      <div>计数: {state.count}</div>
    </div>
  );
}

// 只关心name的组件
function NameOnlyComponent() {
  const state = counterStore.useGetState(['name']);
  console.log('NameOnlyComponent 重新渲染');

  return (
    <div style={{ padding: '10px', border: '1px solid #0f0', margin: '5px' }}>
      <h3>只关心Name的组件</h3>
      <div>名称: {state.name}</div>
    </div>
  );
}

// 自定义相等性检查的组件
function CustomEqualityComponent() {
  // 只有当count变化超过5时才重新渲染
  const state = counterStore.useGetState(undefined, (prev, next) => {
    return Math.abs(prev.count - next.count) < 5;
  });
  console.log('CustomEqualityComponent 重新渲染');

  return (
    <div style={{ padding: '10px', border: '1px solid #f00', margin: '5px' }}>
      <h3>自定义相等性检查组件</h3>
      <div>计数: {state.count} (只有变化超过5才重新渲染)</div>
    </div>
  );
}

// 控制面板
function ControlPanel() {
  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px' }}>
      <h3>控制面板</h3>
      <button onClick={increment} style={{ margin: '5px' }}>
        增加计数
      </button>
      <button onClick={decrement} style={{ margin: '5px' }}>
        减少计数
      </button>
      <button
        onClick={() => updateName('Updated Name')}
        style={{ margin: '5px' }}
      >
        更新名称
      </button>
      <button
        onClick={() => updateName('My Counter')}
        style={{ margin: '5px' }}
      >
        重置名称
      </button>
    </div>
  );
}

export {
  ControlPanel,
  CountOnlyComponent,
  CustomEqualityComponent,
  FullStateComponent,
  NameOnlyComponent,
};
