import React, { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

const STORAGE_KEY = "search_history";
interface IProps {
  onClose: () => void;
}

export default function SearchWithHistory({ onClose }: IProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState("goods");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveHistory = (newHistory: string[]) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    let updated = [trimmed, ...history.filter((h) => h !== trimmed)];
    if (updated.length > 10) updated = updated.slice(0, 10);
    saveHistory(updated);

    console.log("🔍 搜索关键词:", trimmed);
    setQuery("");
    inputRef.current?.focus();
    onClose();
    if (searchType == 'goods') {
      navigate(`/search?name=${trimmed}`);
    }
    if (searchType == 'store') {
      navigate(`/search-store?name=${trimmed}`);
    }

  };

  const removeHistoryItem = (item: string) => {
    const updated = history.filter((h) => h !== item);
    saveHistory(updated);
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  const onDisabled = (e: any) => {
    e?.preventDefault();
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4  rounded-xl" onClick={onDisabled}>
      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="relative flex items-center border-b border-gray-300">
        <Select
          value={searchType}
          onChange={(value) => setSearchType(value)}
          options={[
            { value: "store", label: t("common.store") },
            { value: "goods", label: t("common.goods") },
          ]}
        />

        <input
          ref={inputRef}
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch(); // ✅ 直接触发搜索
            }
          }}
          placeholder={t('SearchWithHistory.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={clsx('w-full flex-1 pl-4 pr-4 py-2  outline-none border-none placeholder-gray-400 text-gray-700', history.length > 0 ? '' : '')}
        />
        {query && (
          <XMarkIcon
            className="w-5 h-5 text-gray-400 mr-1 cursor-pointer hover:text-gray-600"
            onClick={() => setQuery("")}
          />
        )}
        <MagnifyingGlassIcon

          className="w-5 h-5 text-gray-400  left-0 cursor-pointer hover:text-gray-600"
          onClick={handleSearch}
        />
      </form>

      {/* 搜索历史 */}
      {history.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {history.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 px-3 py-1  border rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="cursor-pointer" onClick={() => setQuery(item)}>
                {item}
              </span>
              <XMarkIcon
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => removeHistoryItem(item)}
              />
            </div>
          ))}
          <button
            className="px-3 py-1 bg-red-50 text-red-500 rounded-md text-sm hover:bg-red-100"
            onClick={clearAll}
          >
            {t('SearchWithHistory.clearAll')}
          </button>
        </div>
      )}
    </div>
  );
}
