import { useTranslation } from "react-i18next";
import AppNav from "@/components/AppNav";
import { useQuery } from "@/hooks/useQuery";
import { News } from "@/apis/news";
import { useParams } from "react-router-dom";
import LoadingOrEmpty from "@/components/LoadingOrEmpty";
import { formatDate } from "@/lib/format-time";


const User = () => {
    const { t } = useTranslation();
    return <main className=" px-5 pb-10">
        <AppNav title="服务协议" />
   {/*      <h2 className="py-4 text-xl font-semibold text-black"></h2> */}

        <div className=" leading-6 text-sm">
            <h1 className="text-xl font-bold">用户协议</h1>

            <p>
                本协议是您(个人或单位)与我们之间关于股票交易软件的法律协议。一旦安装、复制或以其他方式使用本软件产品，即表示同意接受本协议各项条件的约束。
            </p>

            <p>
                如果您不同意本协议的条件，则不能获得使用本软件产品的权力。
            </p>

            <h2 className="text-lg font-semibold mt-4">一．软件产品版权及保护声明</h2>

            <p>
                1、未经授权或者许可，任何个人、单位不得以任何方式将本软件及注册码或注册文件对外发布、复制并传播，或用于商业目的的销售。授权用户或单位限在授权范围内使用。
            </p>
            <p>
                2、任何个人或团体、单位不得试图破解或提供他人破解或反编译本软件，本软件受《著作权法》、《物权法》及《计算机软件保护条例》保护，违者将依法提起诉讼，追究其法律责任，并有权终止其使用权。
            </p>
            <p>
                3、不能保证软件没有任何的瑕疵，但是我们尽可能的减少或避免程序中的错误，对于已出现的错误及时更正，或对软件进行升级并对客户免费提供及时和必要的服务。
            </p>
            <p>
                4、任何公司或个人定制的版本因自身原因或使用不当而造成的损失或纠纷自行承担。
            </p>
            <p>
                5、如果您未遵守本协议的任何一项条款，我们有权立即终止本协议，并保留通过法律手段追究责任的权利。
            </p>

            <h2 className="text-lg font-semibold mt-4">二、软件免责声明</h2>

            <p>
                我们敬请使用者仔细阅读以下内容，以便正确、全面地了解网上股票自动交易的风险。
            </p>
            <p>
                如果使用者购买或使用我们的股票交易软件，我们将认为使用者已完全了解网上股票交易的风险，并自愿承受由此带来的一切可能的损失。 我们已对本软件尽力采取了有效措施保证软件的正确性和安全性。尽管如此，本着对使用者负责的态度，我们在此郑重提醒使用者，网上股票交易除具有普通的手工委托交易方式所共有的风险外，使用者还应充分了解和认识到其存在且不限于以下风险：
            </p>

            <ul className="list-decimal list-inside space-y-1">
                <li>互联网数据传输可能会出现中断、停顿、延迟、数据错误等情况而导致自动交易失败；</li>
                <li>互联网上存在黑客恶意攻击的可能性，网络服务器可能会出现故障及其他不可预测的因素，导致自动交易失败；</li>
                <li>使用者的网络终端设备及软件系统可能会受到非法攻击或病毒感染，导致自动交易失败；</li>
                <li>使用者不熟悉本软件操作方法或缺乏网上委托经验，可能因操作不当造成自动交易失败或失误；</li>
                <li>使用者所开户的证券公司的网络系统和交易系统出错，均会造成自动交易失败或失误；</li>
                <li>互联网上的破解版很可能捆绑了木马或病毒，使用这些版本，可能会造成你帐户密码被盗或资金损失，更有可能使自动交易失败或失误；</li>
                <li>由于长时间离开电脑而造成帐户密码或用户资料被他人窃取，从而使你帐户资金损失，因此请不要在公共场合下使用本软件；</li>
                <li>除以上原因外的其它可能造成自动交易失败的原因。</li>
            </ul>

            <h2 className="text-lg font-semibold mt-4">三、忠告建议</h2>

            <p>股市有风险，入市需谨慎。</p>
        </div>

    </main>
}

export default User;
