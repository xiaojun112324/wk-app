// components/LoadingOrEmpty.tsx
import { Spin, Empty } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';

interface LoadingOrEmptyProps {
    loading?: boolean;
    data?: any[] | null;
    height?: string; // 可自定义高度，默认 20vh
    description?: string;
    className?: string
}

export default function LoadingOrEmpty({
    loading = false,
    data,
    height = '20vh',
    description,
    className,
}: LoadingOrEmptyProps) {
    const { t } = useTranslation();
    const isEmpty = !loading && (!data || data.length === 0);

    return (
        <>
            {loading ? (
                <div className={clsx("flex justify-center items-center", className)}
                    style={{ height }}>  <Loading loading={loading} /></div>

            ) : isEmpty ? (
                <div className={clsx("flex justify-center items-center", className)}
                    style={{ height }}>      <Empty description={description || t('common.noData')} /></div>

            ) : null}
        </>
    );
}
