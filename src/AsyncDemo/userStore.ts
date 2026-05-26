// userStore.ts
import { Model } from '../Model';

// 用户接口
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 用户状态
interface UserState {
  user: User | null;
  userList: User[];

  // 异步状态（自动管理）
  loading: boolean;
  userListLoading: boolean;
  error: Error | null;
  userListError: Error | null;

  // 计算属性（自动计算）
  userCount: number;
  hasUsers: boolean;
}

// 创建用户Store
const userStore = new Model<UserState>({
  state: {
    user: null,
    userList: [],
    loading: false,
    userListLoading: false,
    error: null,
    userListError: null,
    userCount: 0,
    hasUsers: false,
  },

  // 🧮 计算属性（第9章的功能）
  computed: [
    {
      keys: ['userList'],
      handler: (state) => {
        console.log('🧮 计算属性：用户列表统计');
        return {
          userCount: state.userList.length,
          hasUsers: state.userList.length > 0,
        };
      },
    },
  ],

  // 👂 Watch（第10章的功能）
  watch: [
    {
      keys: ['user'],
      handler: (state) => {
        console.log('👂 Watch：用户信息变化');
        if (state.user) {
          // 自动保存用户信息到localStorage
          try {
            localStorage.setItem('currentUser', JSON.stringify(state.user));
            console.log('✅ 用户信息已保存到localStorage');
          } catch (error) {
            console.error('❌ 保存用户信息失败:', error);
          }
        }
      },
    },
  ],
});

// 🆕 Mock数据和API模拟

// Mock用户数据
const mockUsers: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', avatar: '👨‍💼' },
  { id: '2', name: '李四', email: 'lisi@example.com', avatar: '👩‍💻' },
  { id: '3', name: '王五', email: 'wangwu@example.com', avatar: '👨‍🎨' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', avatar: '👩‍🔬' },
  { id: '5', name: '钱七', email: 'qianqi@example.com', avatar: '👨‍🏫' },
];

// Mock API函数
const mockAPI = {
  // 模拟获取单个用户
  async getUser(userId: string): Promise<User> {
    // 模拟网络延迟
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 1200),
    );

    // 模拟错误情况
    if (userId === 'error') {
      throw new Error('用户不存在');
    }

    if (userId === 'network-error') {
      throw new Error('网络连接失败');
    }

    // 查找用户
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw new Error(`用户ID ${userId} 不存在`);
    }

    return user;
  },

  // 模拟获取用户列表
  async getUserList(
    page = 1,
    pageSize = 10,
  ): Promise<{ users: User[]; total: number }> {
    // 模拟网络延迟
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 800),
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const users = mockUsers.slice(start, end);

    return {
      users,
      total: mockUsers.length,
    };
  },

  // 模拟搜索用户
  async searchUsers(query: string): Promise<{ users: User[] }> {
    // 模拟网络延迟
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 500),
    );

    const users = mockUsers.filter(
      (user) => user.name.includes(query) || user.email.includes(query),
    );

    return { users };
  },
};

// 🆕 异步操作方法（使用AsyncManager）

// 获取用户信息
async function fetchUser(userId: string) {
  console.log(`🔄 开始获取用户信息: ${userId}`);

  const asyncManager = userStore.asyncManager('fetchUser', {
    loadingKey: 'loading',
    errorKey: 'error',
    config: {
      retryCount: 2, // 失败时重试2次
      retryInterval: 1000, // 重试间隔1秒
    },
  });

  return asyncManager.exec(async (_, tryCount) => {
    console.log(`📡 第${tryCount + 1}次尝试获取用户信息`);

    // 🎯 使用Mock API而不是真实的fetch
    const user = await mockAPI.getUser(userId);
    console.log('✅ 用户信息获取成功:', user.name);

    // 🎯 关键：返回的数据会自动合并到状态中
    return { user };
  });
}

// 获取用户列表
async function fetchUserList(page = 1, pageSize = 10) {
  console.log(`🔄 开始获取用户列表: 第${page}页`);

  const asyncManager = userStore.asyncManager('fetchUserList', {
    loadingKey: 'userListLoading',
    errorKey: 'userListError',
    config: {
      retryCount: 1,
      retryInterval: 500,
    },
  });

  return asyncManager.exec(async ({ lastAbortController }, tryCount) => {
    // 取消上一个请求
    if (lastAbortController) {
      lastAbortController.abort();
      console.log('🚫 已取消上一个用户列表请求');
    }

    console.log(`📡 第${tryCount + 1}次尝试获取用户列表`);

    // 🎯 使用Mock API
    const data = await mockAPI.getUserList(page, pageSize);
    console.log(`✅ 用户列表获取成功: ${data.users.length}个用户`);

    return { userList: data.users };
  });
}

// 搜索用户（演示竞态条件解决）
async function searchUsers(query: string) {
  console.log(`🔍 搜索用户: "${query}"`);

  if (!query.trim()) {
    userStore.setState({ userList: [] });
    return;
  }

  const asyncManager = userStore.asyncManager('searchUsers', {
    loadingKey: 'userListLoading',
    errorKey: 'userListError',
  });

  return asyncManager.exec(async (_, tryCount) => {
    console.log(`🔍 执行搜索: "${query}" (尝试${tryCount + 1})`);

    // 🎯 使用Mock API
    const data = await mockAPI.searchUsers(query);
    console.log(`✅ 搜索完成: 找到${data.users.length}个用户`);

    return { userList: data.users };
  });
}

export { fetchUser, fetchUserList, searchUsers, userStore };
