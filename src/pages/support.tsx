import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Spin } from "antd";
import { SendOutlined, PictureOutlined } from "@ant-design/icons";
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
  const fileRef = useRef<HTMLInputElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const lastIdRef = useRef<number>(0);

  const sortedMessages = useMemo(() => {
    const list = [...messages];
    list.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
    return list;
  }, [messages]);

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight + 100,
        behavior: "smooth",
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
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
      scrollBottom();
    }
  }, [sortedMessages.length]);

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
    <main className="h-screen flex flex-col">
      <AppNav title="在线客服" />

      <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {loading ? (
          <div className="h-full flex items-center justify-center"><Spin /></div>
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
                      <img src={msg.messageContent} alt="chat" className="rounded-xl max-w-[180px]" onClick={() => window.open(msg.messageContent)} />
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
      </div>

      <div className="border-t border-[#d9e6ff] px-3 py-2 flex items-end gap-2 bg-white">
        <button className="text-xl text-[#5c7cab]" onClick={() => fileRef.current?.click()}>
          <PictureOutlined />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="请输入消息"
          className="flex-1"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              onSendText();
            }
          }}
        />

        <Button type="text" loading={sending} icon={<SendOutlined className="text-[#1d63dd] text-xl" />} onClick={onSendText} />
      </div>
    </main>
  );
};

export default Support;

