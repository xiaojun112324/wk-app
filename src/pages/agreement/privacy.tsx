import AppNav from "@/components/AppNav";

const sectionTitleClass = "text-lg font-semibold text-[#19325f] mt-8 mb-3";
const subTitleClass = "text-base font-semibold text-[#1d417c] mt-5 mb-2";
const listClass = "list-disc pl-5 space-y-1";

export default function Privacy() {
  return (
    <main className="min-h-screen px-5 pb-12">
      <AppNav title="CServer 隐私协议" backFallback="/login" />

      <div className="mt-3 rounded-2xl border border-[#d8e6ff] bg-white p-4 leading-7 text-[14px] text-[#253858] sm:p-6">
        <h1 className="text-2xl font-bold text-[#163665]">CServer 隐私协议</h1>
        <p className="mt-2">最后更新日期：2024年9月13日</p>
        <p className="mt-3">
          本隐私协议适用于 Fram Farm Inc. 及其附属公司和子公司（以下简称“CServer”、“我们”、“我方”或“我们的”）对个人信息的处理，包括但不限于我们的网站
          {" "}
          <a className="text-blue-600 underline" href="https://cserverapp.com" target="_blank" rel="noreferrer">
            https://cserverapp.com
          </a>
          {" "}
          以及链接到本隐私协议或受本隐私协议约束的其他在线或线下服务（统称为“服务”）。
        </p>
        <p className="mt-3">
          请仔细阅读本隐私协议。使用任何服务即表示您同意按照本隐私协议所述的方式收集、使用和披露您的信息。如果您不同意本隐私协议，请勿使用或访问本服务。如果您代表他人提供个人信息，则本协议亦适用于该等个人。请将本协议内容告知他们或引导他们阅读本协议。
        </p>

        <h2 className={sectionTitleClass}>目录</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>本隐私协议的更新</li>
          <li>我们收集的个人信息</li>
          <li>我们如何使用个人信息</li>
          <li>我们如何披露个人信息</li>
          <li>您的隐私选择权与权利</li>
          <li>个人信息的跨境传输</li>
          <li>个人信息的留存</li>
          <li>EU/UK GDPR 补充协议</li>
          <li>儿童个人信息</li>
        </ol>

        <h2 className={sectionTitleClass}>1. 本隐私协议的更新</h2>
        <p>我们可能不时自行决定更新本隐私协议。如有更新，我们将在网站上公布更新后的隐私协议，并/或通过其他方式通知您。</p>

        <h2 className={sectionTitleClass}>2. 我们收集的个人信息</h2>
        <p>我们收集您直接提供给我们的个人信息、在您使用服务时自动收集的个人信息，以及从第三方来源获得的个人信息，具体如下所述。</p>

        <h3 className={subTitleClass}>A. 您直接提供给我们的个人信息</h3>
        <p>我们可能收集您主动提供给我们的个人信息，包括但不限于：</p>
        <ul className={listClass}>
          <li>账户信息：创建或管理账户时可能收集的信息，例如用户名、电子邮件地址、数字钱包地址、数字钱包中资产的相关信息、身份识别信息以及您存储在账户中的其他信息。</li>
          <li>交易信息：您在使用服务时进行的交易相关个人信息及详情（包括您的数字钱包信息）。</li>
          <li>与我们的沟通：您通过电子邮件或网页聊天工具等与我们沟通时产生的信息（我们及我们的服务提供商可能会收集）。</li>
          <li>问卷调查：我们可能邀请您参与调查，如您参与，我们可能会收集相关个人信息。</li>
          <li>互动功能：您通过消息功能、评论区、论坛、博客、社交媒体账户互动等提交或公开的信息。使用服务的公开分享功能提供的信息将被视为“公开信息”。</li>
          <li>抽奖或竞赛：您参与我们举办的抽奖或竞赛时提供的信息。在某些司法管辖区，我们可能需要公开获奖者信息。</li>
          <li>会议、展会及其他活动：我们在参加或举办会议、展会等活动时收集的个人信息。</li>
          <li>业务开发与战略合作：用于评估和追求潜在商业机会而从个人或第三方收集的信息。</li>
          <li>求职申请：您申请我们职位时提供的联系方式、简历等个人信息。</li>
        </ul>

        <h3 className={subTitleClass}>B. 自动收集的个人信息</h3>
        <ul className={listClass}>
          <li>设备信息：IP地址、用户设置、Cookie标识符、其他唯一标识符、浏览器或设备信息、互联网服务提供商、位置信息（包括通过IP地址推导的大致位置以及精确地理位置信息，如适用）。</li>
          <li>使用信息：您访问的页面、搜索内容、交互的内容类型、点击的链接、使用频率与时长等使用服务相关信息。</li>
          <li>Cookie及类似技术（详见下文）：我们及第三方可能使用Cookie、像素标签（web beacon）等技术自动收集信息。</li>
        </ul>
        <p className="mt-2">Cookie 协议（及其他技术）</p>
        <ul className={listClass}>
          <li>Cookie 是存储在您设备浏览器中的小型文本文件。</li>
          <li>像素标签/网络信标是嵌入服务中的代码片段，用于记录页面访问、广告点击、邮件打开等行为。</li>
          <li>有关这些技术的选择权，请参见下文“您的隐私选择权与权利”部分。</li>
        </ul>

        <h3 className={subTitleClass}>C. 从第三方收集的个人信息</h3>
        <ul className={listClass}>
          <li>通过第三方服务登录时，根据您的隐私设置从该服务获取的信息。</li>
          <li>服务用户上传或提供的关于他人的信息。</li>
          <li>通过区块链数据分析或公开可用来源获得的信息。</li>
        </ul>

        <h2 className={sectionTitleClass}>3. 我们如何使用个人信息</h2>
        <p>我们将个人信息用于多种商业目的，包括提供服务、行政管理以及向您提供营销内容等。</p>

        <h3 className={subTitleClass}>A. 提供服务（履行与您的合同）</h3>
        <ul className={listClass}>
          <li>管理您的信息和账户。</li>
          <li>提供特定区域、功能和特性访问。</li>
          <li>响应支持请求。</li>
          <li>与您沟通。</li>
          <li>为提供服务所需与第三方共享。</li>
          <li>促成您进行的交易。</li>
          <li>验证身份（包括遵守KYC、反洗钱等法律法规）。</li>
          <li>处理求职申请。</li>
          <li>允许您注册活动等。</li>
        </ul>

        <h3 className={subTitleClass}>B. 行政目的</h3>
        <ul className={listClass}>
          <li>追求合法利益（如直接营销、研发、网络与信息安全、欺诈预防）。</li>
          <li>检测安全事件、防范恶意/欺诈/非法活动。</li>
          <li>进行数据分析。</li>
          <li>衡量服务兴趣与参与度。</li>
          <li>改进、升级或增强服务。</li>
          <li>开发新产品和服务。</li>
          <li>创建去标识化/聚合信息（且不会尝试重新识别，除非法律要求）。</li>
          <li>内部质量控制与安全。</li>
          <li>身份验证及权利行使确认。</li>
          <li>调试修复错误。</li>
          <li>审计、执行协议与政策。</li>
          <li>遵守法律义务等。</li>
        </ul>

        <h3 className={subTitleClass}>C. 营销</h3>
        <p>我们可能根据适用法律使用个人信息向您发送定制化营销内容。</p>

        <h3 className={subTitleClass}>D. 基于您的同意或指示</h3>
        <p>在您提供信息时明确告知的其他目的，或经您同意、或您明确指示的目的。</p>

        <h3 className={subTitleClass}>E. 自动化决策</h3>
        <p>我们可能进行包括用户画像在内的自动化决策。如有疑问可联系我们。</p>

        <h2 className={sectionTitleClass}>4. 我们如何披露个人信息</h2>
        <h3 className={subTitleClass}>A. 为提供服务而披露</h3>
        <ul className={listClass}>
          <li>区块链：使用区块链相关功能时，交互/交易信息将被发送至相应区块链网络，并因区块链协议特性可能被第三方访问。</li>
          <li>服务提供商：托管、客服、分析、营销、IT支持、身份验证等服务商。</li>
          <li>向公众披露：如公开热门矿工表现等。</li>
          <li>您互动的第三方服务：链接或集成的第三方服务，受其自身隐私协议约束。</li>
          <li>商业合作伙伴：联合提供产品/服务时共享。</li>
          <li>关联公司。</li>
          <li>广告合作伙伴：用于兴趣类/定向广告（个性化广告）。</li>
        </ul>

        <h3 className={subTitleClass}>B. 为保护我们或他人</h3>
        <p>在善意相信有必要时，为遵守法律请求、保护权利财产安全、执行政策、追收欠款、协助调查等目的披露。</p>

        <h3 className={subTitleClass}>C. 企业交易</h3>
        <p>合并、收购、资产转让、破产等重大交易中，个人信息可能被披露、出售或转移。</p>

        <h2 className={sectionTitleClass}>5. 您的隐私选择权与权利</h2>
        <h3 className={subTitleClass}>隐私选择权</h3>
        <ul className={listClass}>
          <li>电子邮件：可通过邮件底部退订链接取消营销邮件（交易相关邮件及必要通知除外）。</li>
          <li>移动设备：可通过设备设置关闭推送通知、精确位置收集。</li>
          <li>Do Not Track (DNT)：我们目前不响应浏览器DNT信号。</li>
          <li>Cookie：可通过浏览器/设备设置限制或删除，但可能影响服务正常使用。</li>
          <li>可访问 NAI、DAA、EDAA 等网站选择退出部分定向广告（需逐浏览器/设备操作）。</li>
        </ul>

        <h3 className={subTitleClass}>隐私权利（依适用法律）</h3>
        <ul className={listClass}>
          <li>访问、复制（可携权）</li>
          <li>更正</li>
          <li>删除</li>
          <li>限制处理 / 反对处理</li>
          <li>停止/拒绝直接营销</li>
          <li>撤回同意（仅对未来有效）</li>
          <li>向主管监管机构投诉</li>
        </ul>
        <p className="mt-2">行使权利请通过下方“联系我们”方式联系。</p>

        <h2 className={sectionTitleClass}>6. 个人信息的跨境传输</h2>
        <p>
          您的个人信息可能被传输、处理并存储于全球任何地方（包括美国及其他国家），这些国家的数据保护水平可能与您所在国家不同。从欧盟/EEA、瑞士、英国向无充分保护水平国家传输时，我们可能使用欧盟标准合同条款（SCC）等保障措施。详情可联系我们咨询。
        </p>

        <h2 className={sectionTitleClass}>7. 个人信息的留存</h2>
        <p>我们将根据您使用服务期间、收集目的、法律要求、争议解决、审计、合法商业目的等因素决定留存期限。</p>

        <h2 className={sectionTitleClass}>8. EU/UK GDPR 补充协议</h2>
        <p>（仅适用于受欧盟或英国GDPR管辖的个人信息处理）</p>
        <p className="mt-2">
          在某些情况下，提供个人信息可能是法律要求、合同要求或订立合同的必要条件。如您拒绝提供，我们将在当时告知您可能的后果。
        </p>
        <p className="mt-2">我们处理个人信息的合法依据包括：</p>
        <img
          src="/1111.jpg"
          alt="我们处理个人信息的合法依据"
          className="mt-3 w-full max-w-3xl rounded-xl border border-[#d8e6ff] shadow-sm"
        />

        <h2 className={sectionTitleClass}>9. 儿童个人信息</h2>
        <p>服务并非面向18岁以下儿童，我们不会故意收集儿童个人信息。如家长/监护人认为儿童未经允许上传个人信息，请联系我们。</p>

      </div>
    </main>
  );
}
