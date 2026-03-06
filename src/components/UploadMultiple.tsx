import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { $post } from "@/lib/http";
import { useTranslation } from "react-i18next";

interface UploadMultipleProps {
  uploadUrl: string;
  value?: string[];
  maxCount?: number;
  onChange?: (urls: string[]) => void;
}

const UploadMultiple: React.FC<UploadMultipleProps> = ({
  uploadUrl,
  value = [],
  maxCount = 5,
  onChange,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 🔹 仅在外部 value 变化时同步 fileList
  useEffect(() => {
    const newList = (value ?? [])
      .filter(Boolean)
      .map((url, i) => ({
        uid: String(i),
        name: `image-${i}`,
        status: "done" as const,
        url,
      }));
    setFileList(newList);
  }, [JSON.stringify(value)]); // 避免引用相等时无更新

  // 🔹 上传状态变化
  const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
    setFileList(newList);

    const urls = newList
      .filter((f) => f.status === "done" && (f.url || f.response?.data?.imgUrl))
      .map((f) => f.url || f.response?.data?.imgUrl)
      .filter(Boolean) as string[];

    onChange?.(urls);
  };

  // 🔹 上传逻辑
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res: any = await $post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.code === 200 && res.data?.imgUrl) {
        file.url = res.data.imgUrl;
        onSuccess?.(res, file);
        toast.success(t("UploadMultiple.uploadSuccess"));
      } else {
        throw new Error(res.msg || t("UploadMultiple.uploadFailed"));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(t("UploadMultiple.uploadFailed"));
      onError?.(err);
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={customRequest}
      onChange={handleChange}
      multiple
      maxCount={maxCount}
    >
      {fileList.length >= maxCount ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>{t("UploadMultiple.upload")}</div>
        </div>
      )}
    </Upload>
  );
};

export default UploadMultiple;
