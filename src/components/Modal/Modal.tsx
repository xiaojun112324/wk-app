import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalProps {
    open: boolean;
    title?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function Modal({ open, title, content, onConfirm, onCancel }: ModalProps) {
    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-[360px] rounded-lg bg-white p-6 shadow-xl"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    >
                        {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
                        <div className="mb-6 text-gray-600">{content}</div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onCancel}
                                className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                取消
                            </button>
                            <button
                                onClick={onConfirm}
                                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                确认
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
