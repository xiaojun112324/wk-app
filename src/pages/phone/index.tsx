import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Phone = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());

        if (isMobile) {
            navigate('/', { replace: true }); // replace: true -> 无法返回上一页
        }
    }, [navigate]);

    return (
        <main className="bg-gray-100 min-h-screen flex  items-center justify-center">
            <iframe
                src="/"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className=" w-[460px] block mx-auto h-screen max-h-[900px]"
            />
        </main>
    );
};

export default Phone;
