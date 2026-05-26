// WatchDemo/index.tsx
import React from 'react';
import {
  decreaseFontSize,
  increaseFontSize,
  switchLanguage,
  switchTheme,
  themeStore,
} from './themeStore';

function ThemeDemo() {
  // 使用选择性订阅，监听我们需要的字段
  const { theme, language, fontSize, isDarkMode, displayName } =
    themeStore.useGetState([
      'theme',
      'language',
      'fontSize',
      'isDarkMode',
      'displayName',
    ]);

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#333',
        fontSize: `${fontSize}px`,
        transition: 'all 0.3s ease',
      }}
    >
      <h2>🎨 Watch功能演示 - {displayName}</h2>

      {/* 控制按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={switchTheme}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: isDarkMode ? '#555' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          切换主题 ({theme})
        </button>

        <button
          onClick={switchLanguage}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          切换语言 ({language})
        </button>

        <button
          onClick={increaseFontSize}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          字体+
        </button>

        <button
          onClick={decreaseFontSize}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          字体-
        </button>
      </div>

      {/* 状态显示 */}
      <div
        style={{
          background: isDarkMode ? '#444' : '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>📊 当前状态</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <div>
            主题: <strong>{theme}</strong>
          </div>
          <div>
            语言: <strong>{language}</strong>
          </div>
          <div>
            字体大小: <strong>{fontSize}px</strong>
          </div>
          <div>
            暗色模式: <strong>{isDarkMode ? '是' : '否'}</strong>
          </div>
          <div>
            显示名称: <strong>{displayName}</strong>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: isDarkMode ? '#2d5a27' : '#d4edda',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? '#4caf50' : '#c3e6cb'}`,
        }}
      >
        <h4>🎯 观察要点：</h4>
        <ul>
          <li>
            <strong>计算属性</strong>：isDarkMode 和 displayName 会自动计算
          </li>
          <li>
            <strong>Watch副作用</strong>：状态变化时会自动执行副作用操作
          </li>
          <li>
            <strong>打开控制台</strong>：观察计算属性和Watch的执行日志
          </li>
          <li>
            <strong>检查localStorage</strong>：查看偏好设置是否自动保存
          </li>
          <li>
            <strong>页面CSS</strong>：主题切换时body的className会自动更新
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ThemeDemo;
