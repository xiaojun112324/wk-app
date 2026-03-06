import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Spin } from "antd";
import {
    SendOutlined,
    PictureOutlined,
    CustomerServiceOutlined,
    CloseOutlined
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { $post } from "@/lib/http";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { apiChat } from "@/apis/chat";
import { useTranslation } from "react-i18next";
import { useMessageCountContext } from "@/contexts/news/messageCountContext";
import { formatDate, getTimeAgo } from "@/lib/format-time";
import { toast } from "sonner";
import { CheckIcon } from "@heroicons/react/24/outline";
import { getChatUserId } from "@/lib/getChatUserId";

const CustomerServiceChat: React.FC = () => {
    const { count } = useMessageCountContext();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [initialLoading, setInitialLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const pollingRef = useRef<any>(null);
    const prevMessagesRef = useRef<number>(0);

    const uploadUrl = "/api/admin/common/uploadImg";

    /** 获取聊天记录 */
    const { data: messageData, run: getMessageData } = useQuery({
        fetcher: (params) => apiChat.selectChatDetail(params),
        immediate: false,
    });

    /** 滚动到底部 */
    const scrollToBottom = () => {
        setTimeout(() => {
            requestAnimationFrame(() => {
                chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight + 100,
                    behavior: "smooth",
                });
            });
        }, 600)
    };

    /** 发送消息 */
    const { mutate: sendChat, loading } = useMutation({
        fetcher: apiChat.sendChat,
        onSuccess: async () => {
            setMessage("");
            await getMessageData({ userId: getChatUserId() });
        },
    });

    /** 上传图片 */
    const handleUpload = async (file: RcFile) => {
        const isHeicFile = (file: RcFile) => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            return file.type === 'image/heic' || file.type === 'image/heif' || ext === 'heic' || ext === 'heif';
        };

        const convertHeicToJpg = async (file: RcFile) => {
            try {
                const heic2any = (await import('heic2any')).default;
                const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
                return new File([blob as Blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' }) as RcFile;
            } catch (err) {
                throw new Error(t('CustomerServiceChat.heicUnsupported'));
            }
        };

        if (isHeicFile(file)) {
            try {
                file = await convertHeicToJpg(file);
            } catch (err: any) {
                console.error(err);
                toast.warning(err.message || t('CustomerServiceChat.heicUploadFailed'));
                return;
            }
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res: any = await $post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.code == 200 && res.data?.imgUrl) {
                await sendChat({
                    userId: getChatUserId(),
                    messageType: 2,
                    messageContent: res.data.imgUrl,
                });
            }
        } catch (error) {
            console.error('上传错误：', error);
        }
    };

    /** 文件选择 */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] as RcFile | undefined;
        if (file) handleUpload(file);
        e.target.value = "";
    };

    /** 发送文字消息 */
    const handleSend = () => {
        if (!message.trim()) return;
        sendChat({
            userId: getChatUserId(),
            messageType: 1,
            messageContent: message,
        });
    };

    /** 打开弹窗后第一次加载 + 开启轮询 */
    useEffect(() => {
        if (open) {
            setInitialLoading(true);
            getMessageData({userId: getChatUserId()}).finally(() => setInitialLoading(false));

            pollingRef.current = setInterval(() => {
                getMessageData({userId: getChatUserId()});
            }, 5000);
        } else {
            if (pollingRef.current) clearInterval(pollingRef.current);
        }

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [open]);

    /** 监听消息数据变化自动滚动到底部 */
    useEffect(() => {
        if (open && messageData?.length > prevMessagesRef.current) {
            scrollToBottom();
        }
        prevMessagesRef.current = messageData?.length || 0;
    }, [messageData, open]);
    useEffect(() => {
        if (open) {

        } else {

            prevMessagesRef.current = 0
        }
    }, [open]);

    /** 渲染文本消息，换行显示 */
    const renderTextMessage = (content: string) =>
        content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));

    const onOpenService = () => {
        setOpen(true)
    }


    return (
        <>
            {/* 悬浮按钮 */}
            <div className="fixed bottom-30 right-2 sm:right-5 z-10 " onClick={onOpenService}>
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<CustomerServiceOutlined />}
                    className="shadow-lg hover:scale-110 transition-transform"
                />
                {count > 0 ? (
                    <span className="text-red-500 absolute -top-2 -right-1  rounded-full px-1 text-xs">
                        {count}
                    </span>
                ) : null}
            </div>

            {/* 客服弹窗 */}
            <Modal
                open={open}
                footer={null}
                mask={false}
                onCancel={() => setOpen(false)}
                width={580}
                closable={false}
                styles={{ content: { padding: 0 } }}
            >
                {/* 顶部栏 */}
                <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2">
                    <div className="flex items-center space-x-2">
                        <CustomerServiceOutlined />
                        <span className="font-medium">{t('CustomerServiceChat.title')}</span>
                    </div>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setOpen(false)}
                        className="!text-white hover:!text-gray-200"
                    />
                </div>

                {/* 聊天内容 */}
                <div
                    ref={chatContainerRef}
                    className=" flex flex-col gap-3 overflow-y-auto px-3 py-4 h-[60vh] text-sm"
                >
                    {initialLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spin />
                        </div>
                    ) : messageData?.length ? (
                        messageData
                            .sort((a: any, b: any) => a.createTime - b.createTime)
                            .map((msg: any, index: number) => {
                                const isSelf = msg.messageDirection == "0";

                                const messageContent =
                                    msg.messageType == "1"
                                        ? renderTextMessage(msg.messageContent)
                                        : (
                                            <img
                                                src={msg.messageContent}
                                                alt={t('CustomerServiceChat.imageAlt')}
                                                className="rounded-xl max-w-[180px] cursor-pointer"
                                                onClick={() => window.open(msg.messageContent)}
                                            />
                                        );

                                return isSelf ? (
                                    <div key={index} className="flex items-end justify-end">
                                        <div className="flex flex-col items-end">
                                            <div className={msg.messageType == "1" ? "px-3 py-2 rounded-2xl bg-blue-500 text-white" : ""}>
                                                {messageContent}
                                            </div>
                                            {msg.messageType == "1" && (
                                                <div className="text-xs text-gray-500 mt-1 text-right flex ">
                                                    {formatDate(msg.createTime, 'MM-DD HH:mm:ss')}  {msg.isRead ? <CheckIcon className="w-4 font-bold text-blue-500 ml-1" /> : <span />}
                                                </div>
                                            )}
                                        </div>
                                        <img
                                            src={msg.headImg || 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/user-default.jpg'}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full ml-2"
                                        />
                                    </div>
                                ) : (
                                    <div key={index} className="flex items-end justify-start">
                                        <img
                                            src={msg.headImg || 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/stock/cn-2/user-default.jpg'}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div className="flex flex-col items-start">
                                            <div className={msg.messageType == "1" ? "px-3 py-2 rounded-2xl  text-gray-800 shadow" : ""}>
                                                {messageContent}
                                            </div>
                                            {msg.messageType == "1" && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {formatDate(msg.createTime, 'MM-DD HH:mm:ss')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="text-gray-400 text-center my-10">{t('CustomerServiceChat.noMessage')}</div>
                    )}
                </div>

                {/* 输入区域 */}
                <div className="flex items-end border-t  px-3 py-2 gap-2">
                    <div
                        className="cursor-pointer text-gray-500 hover:text-blue-500 text-xl"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <PictureOutlined />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <Input.TextArea
                        placeholder={t('CustomerServiceChat.inputPlaceholder')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        className="flex-1 resize-none focus:shadow-none focus:ring-0"
                        onPressEnter={(e) => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <Button
                        loading={loading}
                        type="text"
                        icon={<SendOutlined className="text-blue-500 text-xl" />}
                        onClick={handleSend}
                    />
                </div>
            </Modal>
        </>
    );
};

export default CustomerServiceChat;
