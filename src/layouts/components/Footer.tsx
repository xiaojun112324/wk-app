import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FooterLink({ item }: { item: any }) {
    if (item.onclick) {
        return (
            <button
                onClick={item.onclick}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {item.name}
            </button>
        );
    }

    if (item.mailto) {
        return (
            <a
                href={`mailto:${item.mailto}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {item.name}
            </a>
        );
    }

    if (item.href?.startsWith("http")) {
        return (
            <a
                href={item.href}
                target={item.target || "_blank"}
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {item.name}
            </a>
        );
    }

    if (item.href) {
        return (
            <Link
                to={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {item.name}
            </Link>
        );
    }

    return <span className="text-sm text-gray-400">{item.name}</span>;
}

export default function Footer() {
    const { t } = useTranslation();

    const navigation = {
        solutions: [
            { name: t("Footer.solutions.contactUs"), href: '#', mailto: 'support@APP-NAME.com' },
        ],
        support: [
            { name: t("Footer.support.privacyPolicy"), href: '/promote/privacyPolicy' },
            { name: t("Footer.support.returnsPolicy"), href: '/promote/returnsPolicy' },
            { name: t("Footer.support.deliveryInformation"), href: '/promote/deliveryInformation' },
            { name: t("Footer.support.sellerScoreSystem"), href: '/promote/sellerScoreSystem' },
        ],
        company: [
            { name: t("Footer.company.register"), href: '/register' },
            { name: t("Footer.company.orderQuery"), href: '/mine/orders' },
            { name: t("Footer.company.favoriteProducts"), href: '/mine/favorite-products' },
            { name: t("Footer.company.wallet"), href: '/mine/wallet' },
        ],
        legal: [
            { name: t("Footer.legal.aboutUs"), href: '/' },
            { name: t("Footer.legal.careers"), href: 'https://sainsburys.jobs/' },
            { name: t("Footer.legal.news"), href: 'https://corporate.sainsburys.co.uk/news/press-releases/' },
            { name: t("Footer.legal.modernSlavery"), href: 'https://corporate.sainsburys.co.uk/media/zvhapkg4/sainsburys-modern-slavery-statement-2024-25.pdf', target: '_blank' },
        ],
        social: [
            { name: 'Binance', href: 'https://www.binance.com/', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-0.png' },
            { name: 'Huobi', href: 'huobi.com/en-us/', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-1.png' },
            { name: 'OKX', href: 'okx.com', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-2.png' },
            { name: 'KraKen', href: 'kraken.com', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-3.png' },
            { name: 'Coinbase', href: 'coinbase.com', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-4.png' },
            { name: 'MetaMask', href: 'https://metamask.io/', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-5.png' },
            { name: 'KuCoin', href: 'https://www.kucoin.com/', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-6.png' },
            { name: 'Trust', href: 'https://trustwallet.com/', icon: 'https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/image-7.png' },
        ],
    };

    return (
        <footer className="bg-black text-gray-300">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-28">
                <div>
                    <div className="text-2xl font-semibold text-white text-center">APP-NAME</div>

                    {/* 主要导航区域 */}
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center ">
                        <div>
                            <h3 className="text-sm font-semibold text-white">{t("Footer.solutions.title")}</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.solutions.map((item) => (
                                    <li key={item.name}><FooterLink item={item} /></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">{t("Footer.support.title")}</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.support.map((item) => (
                                    <li key={item.name}><FooterLink item={item} /></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">{t("Footer.company.title")}</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.company.map((item) => (
                                    <li key={item.name}><FooterLink item={item} /></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">{t("Footer.legal.title")}</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {navigation.legal.map((item) => (
                                    <li key={item.name}><FooterLink item={item} /></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 社交 & 描述区域 */}
                <section className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row gap-y-6 md:gap-x-6">
                    <div className="grid grid-cols-4 gap-2 justify-center md:justify-start flex-1">
                        {navigation.social.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center text-gray-400 hover:text-white transition-colors text-center"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span
                                    className="block mx-auto w-6 h-6 bg-center bg-contain bg-no-repeat"
                                    style={{ backgroundImage: `url(${item.icon})` }}
                                />
                                <span className="text-xs text-center mt-2">{item.name}</span>
                            </a>
                        ))}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="text-2xl font-semibold text-white mb-2">APP-NAME</div>
                        <p className="text-xs text-gray-400 w-full max-w-[420px] mx-auto md:mx-0">{t("Footer.description")}</p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <img className="w-full max-w-[230px]" src="https://nineu-stock.oss-ap-southeast-1.aliyuncs.com/web/shop/footer/footer-card.png?=1" />
                    </div>
                </section>

                {/* 底部版权 */}
                <div className="mt-10 border-t border-gray-700 pt-4 text-center sm:text-left">
                    <p className="text-sm text-gray-500">{t("Footer.copyright")}</p>
                </div>
            </div>
        </footer>
    );
}
