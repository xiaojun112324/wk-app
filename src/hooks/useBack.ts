import { useNavigate, useNavigationType } from "react-router-dom";

export function useBack(fallback = "/") {
  const navigate = useNavigate();
  const navigationType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'

  return () => {
    // 如果是直接访问（没有历史）就跳首页
    if (navigationType === "POP" && window.history.length <= 1) {
      navigate(fallback, { replace: true });
    } else {
      navigate(-1);
    }
  };
}
