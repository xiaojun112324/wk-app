import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    cloneElement,
    useEffect,
    useRef,
} from 'react'
import type { ReactElement, MouseEventHandler } from 'react'
import { useLanguage } from '@/contexts/LanguageProvider'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

interface TriggerProps {
    onClick?: MouseEventHandler<HTMLElement>
    children?: React.ReactNode
}

interface LanguageSwitcherProps {
    children?: ReactElement<TriggerProps>
    onSelect?: (value: string) => void
}

export interface LanguageSwitcherRef {
    open: () => void
    close: () => void
}

const LanguageSwitcher = forwardRef<LanguageSwitcherRef, LanguageSwitcherProps>(
    ({ children, onSelect }, ref) => {
        const { language, changeLanguage, languages } = useLanguage()
        const { t } = useTranslation()
        const [visible, setVisible] = useState(false)
        const drawerRef = useRef<HTMLDivElement>(null)

        const currentLabel =
            languages.find((lng) => lng.code === language)?.label || t('common.language')

        // 暴露方法给父组件
        useImperativeHandle(ref, () => ({
            open: () => setVisible(true),
            close: () => setVisible(false),
        }))

        const handleSelect = (value: string) => {
            changeLanguage(value)
            onSelect?.(value)
            setVisible(false)
        }

        // 锁定页面滚动
        useEffect(() => {
            if (visible && drawerRef.current) {
                // 仅当 drawerRef.current 不为 null 时才调用 disableBodyScroll
              //  disableBodyScroll(drawerRef.current)
                document.body.style.overflow = 'hidden'; // 也可以通过改变 overflow 来阻止页面滚动
            } else if (drawerRef.current) {
                // 恢复滚动
                enableBodyScroll(drawerRef.current)
                document.body.style.overflow = ''; // 恢复正常滚动
            }

            return () => {
                // 清理
                clearAllBodyScrollLocks()
                document.body.style.overflow = ''; // 确保在卸载时恢复
            }
        }, [visible])

        return (
            <div className="relative inline-block">
                {/* 触发按钮 */}
                {children ? (
                    cloneElement(children, {
                        onClick: () => setVisible((v) => !v),
                        children: children.props.children || currentLabel,
                    })
                ) : (
                    <div
                        className="flex items-center text-sm whitespace-nowrap cursor-pointer select-none"
                        onClick={() => setVisible((v) => !v)}
                    >
                        <span className='mr-1 inline-block w-[20px] h-[20px] bg-no-repeat bg-center bg-contain bg-[url(https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/icon/globe-earth-modern.png)]' />
                        <span className="flex-1">{currentLabel}</span>
                    </div>
                )}

                {/* Drawer */}
                <AnimatePresence>
                    {visible && (
                        <>
                            {/* 遮罩 */}
                            <motion.div
                                className="fixed inset-0 bg-black/40 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setVisible(false)}
                            />

                            {/* Drawer 内容 */}
                            <motion.div
                                ref={drawerRef}
                                className="fixed top-0 right-0 h-full  shadow-lg z-50 flex flex-col w-full sm:w-96 overflow-y-auto"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', duration: 0.25 }}
                                drag="x" // 开启拖动
                                dragConstraints={{ left: 0, right: 0 }} // 限制拖动范围
                                onDragEnd={(e, info) => {
                                    if (info.offset.x > 100) { // 偏移超过100px时关闭
                                        setVisible(false)
                                    }
                                }}
                            >
                                {/* 头部 */}
                                <div className="flex items-center justify-between px-4 py-3 border-b">
                                    <span className="font-semibold">{t('common.language')}</span>
                                    <button
                                        className="p-1"
                                        onClick={() => setVisible(false)}
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* 列表 */}
                                <div className="flex-1 overflow-y-auto">
                                    {languages.map((lng) => (
                                        <div
                                            key={lng.code}
                                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 ${lng.code === language ? 'font-semibold' : ''
                                                }`}
                                            onClick={() => handleSelect(lng.code)}
                                        >
                                            {lng.label}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        )
    }
)

export default LanguageSwitcher
