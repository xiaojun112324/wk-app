export type GlobalFarmItem = {
  id: string;
  name: string;
  wetSeasonPrice: string;
  drySeasonPrice: string;
  yearPrice: string;
  location: string;
  powerType: string;
  summary: string;
  description: string;
};

export const GLOBAL_FARMS: GlobalFarmItem[] = [
  {
    id: "carefree-mining",
    name: "Carefreemining",
    wetSeasonPrice: "0.48",
    drySeasonPrice: "0.48",
    yearPrice: "0.48",
    location: "挪威",
    powerType: "其他类型",
    summary: "矿场坐落于欧洲大型数据中心园区，100%可再生能源供电。",
    description:
      "矿场坐落于欧洲最大的数据中心园区，临近海港，交通物流便利。场地总电力容量达到200MW，工厂的设施均通过ISO27001认证，以保证安全高效的运营。供电能源是100%可再生能源，通过规模化挖矿，共创资源再利用的双赢局面。\n\n北欧地区的矿场预计2021年11月可以全面投入运营，届时可以容纳100MW的ASIC矿机和显卡矿机，内设仓库可以存放货物。场地全年温度在0℃-20℃之间，适宜矿机工作。运维人员由中国资深经验的运维人员带队，结合当地运维团队一起配合。周边生活设施便利，配套齐全。欢迎新老客户咨询和预定机位。",
  },
  {
    id: "ankr-mining",
    name: "Ankr Mining",
    wetSeasonPrice: "0.65",
    drySeasonPrice: "",
    yearPrice: "",
    location: "宾夕法尼亚州、北卡罗来纳州",
    powerType: "火电",
    summary: "百兆级负荷矿场，覆盖国际物流、设计建设与运维的一站式托管。",
    description:
      "Ankr Mining在建矿场拥有超过百兆负荷，托管主流比特币和以太坊的矿机。矿场包括集装箱矿场和Turnkey厂房矿场两类，托管服务涵盖国际物流、供电、设计、建设与运维等全部环节，真正实现一站式矿场托管服务。已成功实现1个月快速上架开机。\n\n在电力和土地使用方面，矿场选择与北美州区域电网直接签署长期合作的供电合同。与当地政府、土地所有人沟通，购买或长期租赁变电站附近的土地使用权，土地租赁合同均为5年以上，以保障矿场长期稳定运行。",
  },
  {
    id: "poly-mining",
    name: "Poly Mining",
    wetSeasonPrice: "",
    drySeasonPrice: "",
    yearPrice: "0.511",
    location: "海外·蒙古国",
    powerType: "火电",
    summary: "蒙古戈壁低温矿场，物流便捷，网络稳定，无押金托管。",
    description:
      "场地在蒙古戈壁，常年气温低，是非常适合机器运行的环境，地势平坦；物流便捷；仓储安全；并设有专业维修点；电力网络稳定；运维人员由中国人和现地人员组成；无押金，预缴电费1个月。",
  },
  {
    id: "meta-luban",
    name: "Meta-luban",
    wetSeasonPrice: "",
    drySeasonPrice: "",
    yearPrice: "0.39",
    location: "巴拉圭",
    powerType: "水电",
    summary: "巴拉圭东方市矿场，水电供能，24小时中文运维在线。",
    description:
      "矿场位于巴拉圭的东方市，目前总计在运行30MW，并且每个月还会持续建设3MW，所有电力都使用水电，配备有专业的中国维修和运维团队，24小时运维在线处理问题。并且还在建设大型的水冷化矿场。",
  },
];

