import React, { useState } from "react";
import { Trash2, Minus, Plus, ShoppingCart, X } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  qty: number;
  image: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Goodthreads 男式全棉长袖水洗衬衫",
      spec: "尺码：常规码",
      price: 23.94,
      qty: 1,
      image: "https://via.placeholder.com/80x100",
    },
    {
      id: 2,
      name: "Goodthreads 男式全棉长袖水洗衬衫",
      spec: "尺码：常规码",
      price: 23.94,
      qty: 1,
      image: "https://via.placeholder.com/80x100",
    },
  ]);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart
    .reduce((sum, item) => sum + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <div className="max-w-3xl mx-auto  min-h-screen">
      {/* 顶部标题 */}
      <header className="py-6 text-center text-xl font-bold">APP-NAME</header>

      {/* 购物车头部 */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="flex items-center gap-2 text-sm">
          <ShoppingCart className="w-4 h-4" />
          <span>{totalQty} 件物品</span>
          <span className="text-gray-500">我的购物车</span>
        </div>
        <button className="text-gray-400 hover:text-black">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 商品列表 */}
      <div className="divide-y">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <input type="checkbox" className="w-4 h-4" />
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-24 object-cover rounded border"
            />
            <div className="flex-1 text-sm">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-500">{item.spec}</p>
              <p className="font-semibold">${item.price}</p>
            </div>

            {/* 数量控制 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 删除 */}
            <button
              onClick={() => removeItem(item.id)}
              className="ml-3 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 底部统计 */}
      <div className=" mt-6 p-4 rounded-lg text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">商品共计</span>
          <span>{totalQty} 件</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>合计</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="p-4">
        <button className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900">
          提交订单
        </button>
      </div>
    </div>
  );
};

export default CartPage;
