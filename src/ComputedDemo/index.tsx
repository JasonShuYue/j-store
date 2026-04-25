// Computed/index.tsx
import React from 'react';
import {
  addProduct,
  cartStore,
  clearCart,
  removeProduct,
} from './shoppingCartStore';

function ShoppingCartDemo() {
  // 使用选择性订阅，只关心我们需要的字段
  const { products, totalItems, totalPrice, averagePrice, isEmpty } =
    cartStore.useGetState([
      'products',
      'totalItems',
      'totalPrice',
      'averagePrice',
      'isEmpty',
    ]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>🛒 购物车计算属性演示</h2>

      {/* 控制按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            addProduct({ id: '1', name: 'iPhone 15', price: 5999 })
          }
          style={{ margin: '5px', padding: '10px' }}
        >
          添加 iPhone 15 (¥5999)
        </button>
        <button
          onClick={() =>
            addProduct({ id: '2', name: 'MacBook Pro', price: 12999 })
          }
          style={{ margin: '5px', padding: '10px' }}
        >
          添加 MacBook Pro (¥12999)
        </button>
        <button
          onClick={() => addProduct({ id: '3', name: 'AirPods', price: 1299 })}
          style={{ margin: '5px', padding: '10px' }}
        >
          添加 AirPods (¥1299)
        </button>
        <button
          onClick={clearCart}
          style={{
            margin: '5px',
            padding: '10px',
            background: '#ff4444',
            color: 'white',
          }}
        >
          清空购物车
        </button>
      </div>

      {/* 计算属性显示 */}
      <div
        style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>📊 自动计算的统计信息</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <div>
            总商品数量: <strong>{totalItems}</strong>
          </div>
          <div>
            总价格: <strong>¥{totalPrice.toFixed(2)}</strong>
          </div>
          <div>
            平均价格: <strong>¥{averagePrice.toFixed(2)}</strong>
          </div>
          <div>
            购物车状态: <strong>{isEmpty ? '空' : '有商品'}</strong>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div>
        <h3>🛍️ 商品列表</h3>
        {products.length === 0 ? (
          <p style={{ color: '#666' }}>购物车为空</p>
        ) : (
          <div>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <strong>{product.name}</strong> - ¥{product.price} ×{' '}
                  {product.quantity}
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>
                    小计: ¥{(product.price * product.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeProduct(product.id)}
                    style={{
                      background: '#ff6666',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e8f4fd',
          borderRadius: '8px',
        }}
      >
        <h4>🎯 观察要点：</h4>
        <ul>
          <li>添加商品时，统计信息自动更新</li>
          <li>删除商品时，统计信息自动重新计算</li>
          <li>清空购物车时，所有计算属性都会重置</li>
          <li>打开控制台查看计算属性的执行日志</li>
        </ul>
      </div>
    </div>
  );
}

export default ShoppingCartDemo;
