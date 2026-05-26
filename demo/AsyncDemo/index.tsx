// AsyncDemo.tsx
import React, { useState } from 'react';
import { fetchUser, fetchUserList, searchUsers, userStore } from './userStore';

function AsyncDemo() {
  const [userId, setUserId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  // 使用选择性订阅，监听我们需要的字段
  const { user, userList, loading, userListLoading, error, userListError } =
    userStore.useGetState([
      'user',
      'userList',
      'loading',
      'userListLoading',
      'error',
      'userListError',
    ]);

  // 处理搜索（防抖）
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 简单的防抖处理
    setTimeout(() => {
      if (query === searchQuery) {
        searchUsers(query);
      }
    }, 300);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>🚀 AsyncManager功能演示</h2>

      {/* 用户信息获取 */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h3>👤 获取用户信息</h3>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="输入用户ID (1-5, 或 'error', 'network-error')"
            style={{ marginRight: '10px', padding: '8px', width: '250px' }}
          />
          <button
            onClick={() => fetchUser(userId)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            {loading ? '获取中...' : '获取用户'}
          </button>

          {/* 测试按钮 */}
          <button
            onClick={() => fetchUser('error')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            测试错误
          </button>

          <button
            onClick={() => fetchUser('network-error')}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            测试重试
          </button>
        </div>

        {/* 用户信息显示 */}
        {user && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <strong>{user.name}</strong> ({user.email})
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
            }}
          >
            错误: {error.message}
          </div>
        )}
      </div>

      {/* 用户列表和搜索 */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h3>📋 用户列表和搜索</h3>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索用户..."
            style={{ marginRight: '10px', padding: '8px', width: '200px' }}
          />
          <button
            onClick={() => fetchUserList(1, 10)}
            disabled={userListLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: userListLoading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            {userListLoading ? '加载中...' : '获取用户列表'}
          </button>

          <button
            onClick={() => {
              // 快速连续搜索，测试竞态条件
              searchUsers('张');
              setTimeout(() => searchUsers('李'), 100);
              setTimeout(() => searchUsers('王'), 200);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            测试竞态条件
          </button>
        </div>

        {/* 用户列表显示 */}
        {userList.length > 0 && (
          <div>
            <h4>用户列表 ({userList.length}个用户)</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {userList.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    <strong>{user.name}</strong>
                  </span>
                  <span style={{ color: '#666' }}>{user.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 列表错误信息 */}
        {userListError && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
            }}
          >
            列表错误: {userListError.message}
          </div>
        )}
      </div>

      {/* 说明 */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#e8f4fd',
          borderRadius: '8px',
          border: '1px solid #bee5eb',
        }}
      >
        <h4>🎯 观察要点：</h4>
        <ul>
          <li>
            <strong>Mock数据测试</strong>：使用内置mock数据，无需真实API
          </li>
          <li>
            <strong>自动状态管理</strong>：loading和error状态自动处理
          </li>
          <li>
            <strong>竞态条件解决</strong>：快速连续请求只显示最新结果
          </li>
          <li>
            <strong>重试机制</strong>：失败时自动重试（查看控制台日志）
          </li>
          <li>
            <strong>错误测试</strong>：点击"测试错误"和"测试重试"按钮
          </li>
          <li>
            <strong>请求取消</strong>：新请求会取消旧请求
          </li>
          <li>
            <strong>计算属性和Watch</strong>：与第9、10章功能完美结合
          </li>
          <li>
            <strong>打开控制台</strong>：观察异步操作的详细执行过程
          </li>
        </ul>

        <h4>📝 可用的测试数据：</h4>
        <ul>
          <li>
            <strong>用户ID 1-5</strong>：正常的用户数据
          </li>
          <li>
            <strong>'error'</strong>：模拟用户不存在错误
          </li>
          <li>
            <strong>'network-error'</strong>：模拟网络连接失败，触发重试机制
          </li>
          <li>
            <strong>搜索关键词</strong>：张、李、王、赵、钱等姓名或邮箱
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AsyncDemo;
