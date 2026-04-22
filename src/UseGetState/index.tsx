// src/UseGetState/index.tsx
import React from 'react';
import {
  ControlPanel,
  CountOnlyComponent,
  CustomEqualityComponent,
  FullStateComponent,
  NameOnlyComponent,
} from './TestComponents';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useGetState Hook 测试</h1>

      <ControlPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <FullStateComponent />
        <CountOnlyComponent />
        <NameOnlyComponent />
        <CustomEqualityComponent />
      </div>

      <div
        style={{ marginTop: '20px', padding: '15px', background: '#fff3cd' }}
      >
        <h3>测试说明：</h3>
        <ul>
          <li>
            <strong>点击"增加计数"</strong>：FullStateComponent 和
            CountOnlyComponent 会重新渲染
          </li>
          <li>
            <strong>点击"更新名称"</strong>：FullStateComponent 和
            NameOnlyComponent 会重新渲染
          </li>
          <li>
            <strong>CustomEqualityComponent</strong>
            ：只有计数变化超过5时才重新渲染
          </li>
          <li>
            <strong>打开控制台</strong>：观察各组件的重新渲染日志
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
