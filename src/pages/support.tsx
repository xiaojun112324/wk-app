import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, Spin } from "antd";
import { SendOutlined, PictureOutlined } from "@ant-design/icons";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import type { RcFile } from "antd/es/upload/interface";
import AppNav from "@/components/AppNav";
import { apiChat } from "@/apis/chat";
import { $post } from "@/lib/http";
import { formatDate } from "@/lib/format-time";

const Support: React.FC = () => {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastIdRef = useRef<number>(0);

  const sortedMessages = useMemo(() => {
    const list = [...messages];
    list.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
    return list;
  }, [messages]);

  const scrollBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight + 200,
        behavior,
      });
    });
  };

  const mergeMessages = (rows: any[]) => {
    if (!rows?.length) return;
    setMessages((prev) => {
      const map = new Map<number, any>();
      [...prev, ...rows].forEach((m) => {
        const id = Number(m.id || 0);
        if (id > 0) {
          map.set(id, m);
        }
      });
      const merged = Array.from(map.values());
      const maxId = merged.reduce((acc, cur) => Math.max(acc, Number(cur.id || 0)), lastIdRef.current);
      lastIdRef.current = maxId;
      return merged;
    });
  };

  const pullMessages = async (rid: number, incremental = true) => {
    const res: any = await apiChat.listMessages({
      roomId: rid,
      afterId: incremental ? lastIdRef.current : 0,
      limit: 100,
    });
    const rows = res?.data || [];
    mergeMessages(rows);
    await apiChat.markRead(rid);
  };

  const init = async () => {
    setLoading(true);
    try {
      const roomRes: any = await apiChat.initRoom();
      const rid = Number(roomRes?.data?.roomId || 0);
      if (!rid) return;
      setRoomId(rid);
      await pullMessages(rid, false);
      setTimeout(() => scrollBottom("auto"), 80);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const updateKeyboardInset = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardInset(Math.round(inset));
    };
    updateKeyboardInset();
    vv.addEventListener("resize", updateKeyboardInset);
    vv.addEventListener("scroll", updateKeyboardInset);
    return () => {
      vv.removeEventListener("resize", updateKeyboardInset);
      vv.removeEventListener("scroll", updateKeyboardInset);
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const timer = setInterval(() => {
      pullMessages(roomId, true);
    }, 2000);
    return () => clearInterval(timer);
  }, [roomId]);

  useEffect(() => {
    if (sortedMessages.length) {
      scrollBottom(loading ? "auto" : "smooth");
    }
  }, [sortedMessages.length, loading]);

  const sendMessage = async (messageType: number, messageContent: string) => {
    if (!roomId || !messageContent) return;
    setSending(true);
    try {
      const res: any = await apiChat.sendMessage({ roomId, messageType, messageContent });
      const one = res?.data;
      if (one) {
        mergeMessages([one]);
      }
      if (messageType === 1) {
        setText("");
      }
    } finally {
      setSending(false);
    }
  };

  const onSendText = async () => {
    const msg = text.trim();
    if (!msg) return;
    await sendMessage(1, msg);
  };

  const uploadImage = async (file: RcFile) => {
    const fd = new FormData();
    fd.append("file", file);
    const upRes: any = await $post("/api/file/upload", fd, {
      toast: false,
      headers: { "Content-Type": "multipart/form-data" },
      isCheckToken: true,
    });
    const url = upRes?.data?.url || upRes?.data?.image || upRes?.data?.relativePath;
    if (url) {
      await sendMessage(2, url);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as RcFile | undefined;
    if (file) {
      await uploadImage(file);
    }
    e.target.value = "";
  };

  return (
    <main className="fixed inset-0 z-40 h-[100dvh] overflow-hidden flex flex-col bg-[#f4f8ff]">
      <AppNav
        title={
          <div className="inline-flex items-center justify-center gap-1.5">
            <span>CServer-官方客服</span>
            <CheckBadgeIcon className="h-5 w-5 text-[#1d63dd]" />
          </div>
        }
      />

      <div
        ref={chatRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pt-4 flex flex-col gap-3"
        style={{ paddingBottom: `${12 + keyboardInset}px` }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spin />
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center text-[#7990b2] mt-10">暂无消息</div>
        ) : (
          sortedMessages.map((msg) => {
            const isSelf = !!msg.isSelf;
            const isImage = Number(msg.messageType) === 2;
            return (
              <div key={msg.id} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[78%]">
                  <div className={isSelf ? "rounded-2xl bg-[#1d63dd] text-white px-3 py-2" : "rounded-2xl bg-white text-[#203a64] px-3 py-2 border border-[#d7e5ff]"}>
                    {isImage ? (
                      <button
                        type="button"
                        className="block cursor-zoom-in"
                        onClick={() => setPreviewImage(msg.messageContent)}
                        onTouchEnd={() => setPreviewImage(msg.messageContent)}
                      >
                        <img
                          src={msg.messageContent}
                          alt="chat"
                          className="rounded-xl max-w-[180px] pointer-events-none transition-transform duration-200 hover:scale-[1.02]"
                        />
                      </button>
                    ) : (
                      <span className="whitespace-pre-wrap break-all">{msg.messageContent}</span>
                    )}
                  </div>
                  <div className={`text-[11px] mt-1 ${isSelf ? "text-right text-[#6784ad]" : "text-[#89a0c0]"}`}>
                    {formatDate(msg.createTime)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="border-t border-[#d9e6ff] px-3 py-3 flex items-end gap-2 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]"
        style={{ marginBottom: keyboardInset ? `${keyboardInset}px` : "0px" }}
      >
        <button
          className="h-10 px-3 rounded-xl border border-[#cfe0fb] bg-white text-[#2a66d9] shadow-[0_6px_14px_rgba(39,99,206,0.12)] flex items-center gap-1.5 hover:shadow-[0_10px_20px_rgba(39,99,206,0.18)] transition"
          onClick={() => fileRef.current?.click()}
          type="button"
        >
          <PictureOutlined className="text-base" />
          <span className="text-xs font-semibold">图片</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="请输入消息"
          className="flex-1"
          onFocus={() => setTimeout(() => scrollBottom(), 120)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              onSendText();
            }
          }}
        />

        <button
          type="button"
          onClick={onSendText}
          disabled={sending || !text.trim()}
          className="h-10 px-4 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#1d63dd] to-[#3e8bff] shadow-[0_8px_18px_rgba(29,99,221,0.32)] disabled:opacity-55 disabled:shadow-none transition"
        >
          <span className="inline-flex items-center gap-1.5 text-white">
            <SendOutlined className="!text-white" />
            发送
          </span>
        </button>
      </div>

      <AnimatePresence>
        {previewImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#081120]/80 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            onClick={() => setPreviewImage("")}
          >
            <motion.img
              key={previewImage}
              src={previewImage}
              alt="preview"
              className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.38)] cursor-zoom-out"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage("");
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
};

export default Support;
