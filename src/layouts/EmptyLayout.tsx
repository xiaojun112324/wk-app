// src/layouts/EmptyLayout.tsx
import { ReactNode } from "react";
interface EmptyLayoutProps {
  children: ReactNode;
}

export default function EmptyLayout({ children }: EmptyLayoutProps) {
  return (
    <div className="empty-layout">
      {children}
    </div>
  );
}
