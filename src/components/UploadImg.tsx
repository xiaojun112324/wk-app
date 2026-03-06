import React, { useState, useEffect } from 'react';
import { Upload, message, Modal, } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { $post } from '@/lib/http';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

/** 将文件转为 Base64 用于预览 */
const getBase64 = (file: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(file);
};

/** 上传前校验 */
const beforeUpload = (file: RcFile, t: (key: string) => string) => {
    const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!isValidType) {
        message.error(t('UploadImg.onlyImage'));
        return Upload.LIST_IGNORE;
    }

    const isLt15M = file.size / 1024 / 1024 < 15;
    if (!isLt15M) {
        message.error(t('UploadImg.maxSize') + '15MB！');
        return Upload.LIST_IGNORE;
    }

    return true;
};

interface UploadSingleImgProps {
    value?: string;
    onChange?: (value?: string) => void;
    disabled?: boolean;
    accept?: string;
    uploadUrl?: string;
    className?: string;
    isModal?: boolean;
}

const UploadSingleImg: React.FC<UploadSingleImgProps> = ({
    value,
    onChange,
    className,
    disabled = false,
    accept = 'image/*',
    uploadUrl = '/user/upload.do',
    isModal = true
}) => {
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<UploadFile[]>(() =>
        value ? [{ uid: '-1', name: '', status: 'done', url: value }] : []
    );
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (value) setFileList([{ uid: '-1', name: '', status: 'done', url: value }]);
        else setFileList([]);
    }, [value]);

    /** 自定义上传 */
    const handleCustomRequest: UploadProps['customRequest'] = async (options) => {
        let { file, onSuccess, onError } = options;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('upload_file', file as RcFile);

            const res: any = await $post(uploadUrl, formData, {
                isForm: false,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 0 && res.data?.url) {
                const newFile: UploadFile = {
                    uid: (file as RcFile).uid,
                    name: (file as RcFile).name,
                    status: 'done',
                    url: res.data.url,
                };
                setFileList([newFile]); // 始终只保留最新上传
                onChange?.(res.data.url);
                onSuccess?.(res, file as RcFile);
            } else {
                const msg = res.msg || t('UploadImg.uploadFailed');
                toast.error(msg);
                onError?.(new Error(msg));
            }
        } catch (err: any) {
            console.error(err);
            toast.error(t('UploadImg.uploadFailed'));
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileList(fileList.slice(-1)); // 保证只保留最新
    };

    const handlePreview = async (file: UploadFile) => {
        if (!isModal) {
            return
        }
        if (!file.url && file.originFileObj) {
            getBase64(file.originFileObj as RcFile, (base64) => {
                setPreviewImage(base64);
                setPreviewVisible(true);
            });
        } else if (file.url) {
            setPreviewImage(file.url);
            setPreviewVisible(true);
        }
    };

    const handleRemove = () => {
        setFileList([]);
        onChange?.(undefined);
    };

    const uploadButton = (
        <div className='flex flex-col justify-center items-center'>
            {loading ? <></> : <CloudArrowUpIcon className='size-6' />}
            <div>点击上传</div>
        </div>
    );

    return (
        <>
            <div className={clsx('p-4  rounded-lg up-wrap', className)}>
                <Upload
                    listType="picture"
                    fileList={fileList}
                    customRequest={handleCustomRequest}
                    beforeUpload={(file) => beforeUpload(file, t)}
                    onChange={handleChange}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    accept={accept}
                    maxCount={1}
                    disabled={disabled || loading}
                    style={{ width: '100%' }}
                >
                    {uploadButton}
                </Upload>
            </div>

            <Modal
                open={previewVisible}
                title={t('UploadImg.preview')}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UploadSingleImg;
