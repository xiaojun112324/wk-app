import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const Privacy = () => {
    const { t } = useTranslation();
    return <main className=" min-h-screen px-5">
        <AppNav title="隐私协议" />
        <h2 className="py-4 text-xl font-semibold text-black"></h2>
        <div className=" text-sm  leading-6" >

            <section className="mb-12">
                <p className="mb-6">本《隐私政策》将帮助您了解以下内容：</p>
                <ol className="list-decimal list-inside space-y-4 ml-6">
                    <li>我们会遵循隐私政策收集、使用您的信息，但不会仅因您同意本隐私政策而采用强制捆绑的方式一揽子收集个人信息。特别需要指出的是，您首次打开应用时，在未获得您授权同意的情况下，我们不会采集您的个人信息。</li>
                    <li>当您使用或开启相关功能或使用服务时，为实现功能、服务所必需，我们会收集、使用相关信息。除非是为实现基本业务功能或根据法律法规要求所必需的必要信息，您均可以拒绝提供且不影响其他功能或服务。我们将在隐私政策中逐项说明哪些是必要信息。</li>
                    <li>如果您未登录账号，我们会通过设备对应的标识符信息来保障信息推送（例如行情、资讯等）的基本功能。如果您登录了账号，我们会根据账号信息实现信息推送。</li>
                    <li>地理位置、生物识别、相机、麦克风、相册与手机储存、通知、网络与蓝牙、日历权限，均不会默认开启，只有经过您的明示授权才会在为实现特定功能或服务时使用，您也可以撤回授权。</li>
                    <li>我们已经通过了国家信息安全等级保护（三级）的测评和备案。</li>
                </ol>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">目录</h2>
                <ol className="list-decimal list-inside space-y-3 ml-6">
                    <li>我司如何收集和使用您的个人信息</li>
                    <li>关于存储和对外提供您的个人信息</li>
                    <li>我司如何保护您的个人信息</li>
                    <li>您控制个人信息的权利</li>
                    <li>本政策如何更新</li>
                </ol>
            </section>

            <section className="space-y-12">
                <article>
                    <h2 className="text-2xl font-semibold mb-6">一、我司如何收集和使用您的个人信息</h2>

                    <h3 className="text-xl font-medium mb-4">（一）收集和使用个人信息的原则</h3>
                    <p className="mb-6">
                        我司收集使用您的个人信息将遵循合法、正当、必要的原则，按照法律法规要求以及业务需要收集您的个人信息，不会收集与业务无关的信息或采取不正当方式收集信息。
                    </p>

                    <h3 className="text-xl font-medium mb-4">（二）收集和使用个人信息的目的</h3>
                    <p className="mb-6">
                        为了遵守中国法律的规定、以及为了向您提供服务并保障您的账号安全与系统运行安全，提升用户使用体验，我们会收集您在使用我们的服务的过程中产生的相关信息，包括：
                    </p>

                    <ul className="list-disc list-inside space-y-6 ml-6">
                        <li>
                            <strong>1. 注册、登录与认证</strong>
                            <ul className="list-circle list-inside ml-8 mt-2 space-y-2">
                                <li>注册登录：手机号、头像、昵称、密码、第三方账号绑定等信息。</li>
                                <li>实名认证：姓名、手机号、身份证号码（调用第三方API核验身份证有效性）。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>2. 展示、播放与浏览</strong>
                            <ul className="list-circle list-inside ml-8 mt-2 space-y-2">
                                <li>需要网络权限加载金融数据、资讯、视频等内容。</li>
                                <li>未登录状态下使用IMEI等设备标识符提供基础行情、资讯服务。</li>
                                <li>使用第三方视频播放SDK（微吼）和推送SDK（极光push），会涉及设备信息、日志、网络信息等。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>4. 搜索</strong>：收集搜索关键字、日志记录，暂存在本地以提供搜索历史。
                        </li>
                        <li>
                            <strong>5. 消息通知</strong>：需推送、振动等权限，使用极光push SDK。
                        </li>
                        <li>
                            <strong>7. 适当性管理要求</strong>：根据监管规定收集手机号、姓名、身份证号码等信息。
                        </li>
                        <li>
                            <strong>8. 支付功能</strong>：调用第三方支付SDK，涉及姓名、银行卡号、有效期、手机号等敏感信息（拒绝提供将无法使用支付功能）。
                        </li>
                        <li>
                            <strong>10. 安全运行</strong>：收集安装应用列表、运行进程、崩溃信息、设备标识符（IMEI、MAC等）用于防范恶意程序和保障安全。
                        </li>
                    </ul>
                </article>

                <article>
                    <h2 className="text-2xl font-semibold mb-6">三、关于存储和对外提供您的个人信息</h2>
                    <p className="mb-4">个人信息存储于中华人民共和国境内，仅在法律法规要求或实现本政策目的必需的期限内保留。</p>
                    <p className="mb-6">我们不会主动共享或公开披露您的个人信息，除非：</p>
                    <ul className="list-disc list-inside ml-6 space-y-2">
                        <li>获得您的明确同意；</li>
                        <li>法律法规或政府主管部门强制要求；</li>
                        <li>合并、收购等交易中转让个人信息（将要求新持有方继续受本政策约束）。</li>
                    </ul>
                </article>

                <article>
                    <h2 className="text-2xl font-semibold mb-6">四、我司如何保护您的个人信息</h2>
                    <p className="mb-6">
                        我们已采用符合业界标准的安全防护措施（加密、访问控制等）保护您的个人信息。尽管如此，由于技术局限及可能存在的恶意攻击，互联网并非绝对安全的环境。请使用复杂密码配合我们保障账号安全。
                    </p>
                    <p>如发生个人信息安全事件，我们将按法律法规要求及时告知您并上报监管部门。</p>
                </article>

                <article>
                    <h2 className="text-2xl font-semibold mb-6">五、您控制个人信息的权利</h2>
                    <p className="mb-6">您可通过App内功能：</p>
                    <ul className="list-disc list-inside ml-6 space-y-2">
                        <li>访问、更正、更新个人信息；</li>
                        <li>删除个人信息（特定情形下）；</li>
                        <li>注销账号（个人中心 → 账户安全）；</li>
                        <li>撤回授权、清除缓存与搜索历史。</li>
                    </ul>
                    <p className="mt-6">我们将在验证身份后及时响应您的合理请求，但法律法规另有规定或涉及国家安全、公共利益等情形除外。</p>
                </article>

                <article>
                    <h2 className="text-2xl font-semibold mb-6">六、本政策如何更新</h2>
                    <p>
                        根据国家法律法规变化及服务需要，我们将不时修改本政策，更新后的版本将在App及官网公布并取代旧版本。
                        如您不同意更新内容，请立即停止使用服务并注销账号；继续使用即视为接受更新后的政策。
                    </p>
                </article>
            </section>

            <footer className="mt-16 text-center text-gray-600">
                <p>请您在“同意”前仔细阅读本隐私政策。您点击“同意”即表示您已充分理解并接受本政策全部内容。</p>
            </footer>

        </div>

    </main>
}

export default Privacy;
