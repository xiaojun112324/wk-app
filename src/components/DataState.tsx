// components/DataState.tsx
import { Spin, Empty } from 'antd';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';

interface DataStateProps {
  loading?: boolean;
  data?: any[] | null;
  height?: string | number;
  description?: string;

  /** 自定义 loading / empty */
  loadingNode?: ReactNode;
  emptyNode?: ReactNode;

  className?: string;
  children?: ReactNode;
}

export default function DataState({
  loading = false,
  data,
  height = '20vh',
  description,
  loadingNode,
  emptyNode,
  className,
  children,
}: DataStateProps) {
  const { t } = useTranslation();

  const isEmpty = !loading && (!data || data.length === 0);

  if (loading) {
    return (
      <div
        className={clsx('flex items-center justify-center', className)}
        style={{ height }}
      >
        {loadingNode ?? <Loading loading={loading} />}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={clsx('flex items-center justify-center', className)}
        style={{ height }}
      >
        {emptyNode ?? (
          <Empty description={description ?? t('common.noData')} />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
