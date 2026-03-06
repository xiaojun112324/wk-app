import { connectFactory, useAppContext } from '@/contexts/contextFactory';
import { apiChat } from '@/apis/chat';
import { useQuery } from '@/hooks/useQuery';

export interface MessageCountContextValue {
  count: number;
  loading: boolean;
}

const KEY = 'messageCount';

const defaultStore: MessageCountContextValue = {
  count: 0,
  loading: true,
};

// 生成 Provider
export const connectMessageCount = connectFactory(KEY, defaultStore);

export const useMessageCountContext = () => {
  const { store, setStore } = useAppContext<MessageCountContextValue>(KEY);

  // 使用 useQuery 请求消息列表
  const { run, loading } = useQuery({
    fetcher: apiChat.selectChatMessage,
    immediate: false,
  });

  // 拉取消息数量
  const fetchCount = async () => {
    setStore({ loading: true });
    try {
      const res: any = await run(); // 如果需要参数，可传 { userId: xxx } 等
      const count = res?.notReadCount ?? 0; // 假设接口返回 { unreadCount: number }
      setStore({ count, loading: false });
    } catch (err) {
      console.error(err);
      setStore({ loading: false });
    }
  };

  const refreshCount = () => fetchCount();
  const setCount = (count: number) => setStore({ count });

  return {
    count: store.count,
    loading: store.loading || loading,
    setCount,
    refreshCount,
    fetchCount,
  };
};
