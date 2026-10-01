/** Schematic admin history keyed to today's provincial polygons. */

export const PROVINCES = [
  { adcode: 110000, name: "北京", full: "北京市", level: "直轄市", color: "#8e2f2f" },
  { adcode: 120000, name: "天津", full: "天津市", level: "直轄市", color: "#4e89a8" },
  { adcode: 130000, name: "河北", full: "河北省", level: "省", color: "#3e6f8c" },
  { adcode: 140000, name: "山西", full: "山西省", level: "省", color: "#8d5a32" },
  { adcode: 150000, name: "內蒙古", full: "內蒙古自治區", level: "自治區", color: "#6f8a55" },
  { adcode: 210000, name: "遼寧", full: "遼寧省", level: "省", color: "#3d5f86" },
  { adcode: 220000, name: "吉林", full: "吉林省", level: "省", color: "#5a7098" },
  { adcode: 230000, name: "黑龍江", full: "黑龍江省", level: "省", color: "#31445c" },
  { adcode: 310000, name: "上海", full: "上海市", level: "直轄市", color: "#c45c5c" },
  { adcode: 320000, name: "江蘇", full: "江蘇省", level: "省", color: "#5f8f45" },
  { adcode: 330000, name: "浙江", full: "浙江省", level: "省", color: "#1f7e8c" },
  { adcode: 340000, name: "安徽", full: "安徽省", level: "省", color: "#6a9148" },
  { adcode: 350000, name: "福建", full: "福建省", level: "省", color: "#1a6a8a" },
  { adcode: 360000, name: "江西", full: "江西省", level: "省", color: "#3d7a62" },
  { adcode: 370000, name: "山東", full: "山東省", level: "省", color: "#2a8f84" },
  { adcode: 410000, name: "河南", full: "河南省", level: "省", color: "#d09a3a" },
  { adcode: 420000, name: "湖北", full: "湖北省", level: "省", color: "#0f766e" },
  { adcode: 430000, name: "湖南", full: "湖南省", level: "省", color: "#4f9a45" },
  { adcode: 440000, name: "廣東", full: "廣東省", level: "省", color: "#b4232c" },
  { adcode: 450000, name: "廣西", full: "廣西壯族自治區", level: "自治區", color: "#c46b3a" },
  { adcode: 460000, name: "海南", full: "海南省", level: "省", color: "#d4896a" },
  { adcode: 500000, name: "重慶", full: "重慶市", level: "直轄市", color: "#8d5a7a" },
  { adcode: 510000, name: "四川", full: "四川省", level: "省", color: "#7d4e78" },
  { adcode: 520000, name: "貴州", full: "貴州省", level: "省", color: "#a08a3c" },
  { adcode: 530000, name: "雲南", full: "雲南省", level: "省", color: "#c4a04a" },
  { adcode: 540000, name: "西藏", full: "西藏自治區", level: "自治區", color: "#6e6284" },
  { adcode: 610000, name: "陝西", full: "陝西省", level: "省", color: "#b85c38" },
  { adcode: 620000, name: "甘肅", full: "甘肅省", level: "省", color: "#d08a55" },
  { adcode: 630000, name: "青海", full: "青海省", level: "省", color: "#6e8fa4" },
  { adcode: 640000, name: "寧夏", full: "寧夏回族自治區", level: "自治區", color: "#c47b6a" },
  { adcode: 650000, name: "新疆", full: "新疆維吾爾自治區", level: "自治區", color: "#c4622d" },
  { adcode: 710000, name: "臺灣", full: "臺灣", level: "省級地區", color: "#1f6f92" },
  { adcode: 810000, name: "香港", full: "香港特別行政區", level: "特別行政區", color: "#8a3e4a" },
  { adcode: 820000, name: "澳門", full: "澳門特別行政區", level: "特別行政區", color: "#a36b4a" },
];

const C = {
  guan: "#b85c38",
  yu: "#d09a3a",
  ji: "#3e6f8c",
  qi: "#2a8f84",
  jin: "#8d5a32",
  huai: "#5f8f45",
  wu: "#1f7e8c",
  min: "#1a6a8a",
  gan: "#3d7a62",
  jing: "#1f8a6c",
  e: "#0f766e",
  xiang: "#4f9a45",
  yue: "#b4232c",
  gui: "#c46b3a",
  shu: "#7d4e78",
  qian: "#a08a3c",
  dian: "#c4a04a",
  long: "#d08a55",
  ning: "#c47b6a",
  yuqi: "#c4622d",
  zang: "#6e6284",
  sai: "#6f8a55",
  liao: "#3d5f86",
  jilin: "#5a7098",
  hei: "#31445c",
  qinghai: "#6e8fa4",
  tai: "#1f6f92",
  jinDyn: "#a56b2a",
  xia: "#8e9360",
  paper: "#e4d8c4",
};

const QIN_POINTS = [
  { name: "內史", seat: "咸陽", lon: 108.72, lat: 34.33, note: "首都所在，不稱郡", priority: 6 },
  { name: "三川", seat: "洛陽", lon: 112.45, lat: 34.62, priority: 4 },
  { name: "潁川", seat: "陽翟", lon: 113.47, lat: 34.16, priority: 2 },
  { name: "南陽", seat: "宛", lon: 112.53, lat: 33.0, priority: 2 },
  { name: "漢中", seat: "南鄭", lon: 106.94, lat: 33.07, priority: 3 },
  { name: "蜀郡", seat: "成都", lon: 104.07, lat: 30.67, priority: 5 },
  { name: "巴郡", seat: "江州", lon: 106.55, lat: 29.56, priority: 4 },
  { name: "南郡", seat: "江陵", lon: 112.18, lat: 30.35, priority: 4 },
  { name: "長沙", seat: "湘縣", lon: 112.94, lat: 28.23, priority: 4 },
  { name: "九江", seat: "壽春", lon: 116.96, lat: 32.63, priority: 3 },
  { name: "會稽", seat: "吳縣", lon: 120.62, lat: 31.32, priority: 5 },
  { name: "閩中", seat: "冶", lon: 119.3, lat: 26.08, note: "治所多說在今福州，另有異說", priority: 4 },
  { name: "南海", seat: "番禺", lon: 113.26, lat: 23.13, priority: 6 },
  { name: "桂林", seat: "布山", lon: 109.6, lat: 23.11, note: "郡治布山約在今貴港一帶，不是後來的桂林城", priority: 4 },
  { name: "齊郡", seat: "臨淄", lon: 118.35, lat: 36.82, priority: 4 },
  { name: "琅邪", seat: "東武", lon: 119.41, lat: 36.0, priority: 2 },
  { name: "泗水", seat: "相縣", lon: 116.77, lat: 33.91, priority: 2 },
  { name: "邯鄲", seat: "邯鄲", lon: 114.49, lat: 36.61, priority: 3 },
  { name: "太原", seat: "晉陽", lon: 112.55, lat: 37.87, priority: 3 },
  { name: "河東", seat: "安邑", lon: 111.0, lat: 35.12, priority: 2 },
  { name: "上黨", seat: "長子", lon: 112.87, lat: 36.12, priority: 1 },
  { name: "上郡", seat: "膚施", lon: 109.49, lat: 36.65, priority: 2 },
  { name: "北地", seat: "義渠", lon: 107.9, lat: 35.5, priority: 2 },
  { name: "隴西", seat: "狄道", lon: 103.86, lat: 35.37, priority: 3 },
  { name: "遼東", seat: "襄平", lon: 123.17, lat: 41.27, priority: 5 },
  { name: "遼西", seat: "陽樂", lon: 120.45, lat: 41.05, priority: 2 },
  { name: "上谷", seat: "沮陽", lon: 115.52, lat: 40.42, priority: 2 },
  { name: "雲中", seat: "雲中", lon: 111.15, lat: 40.28, priority: 2 },
  { name: "九原", seat: "九原", lon: 109.84, lat: 40.58, priority: 3 },
];

const HISTORICAL = [
  {
    id: "qin",
    year: -214,
    yearText: "前214年",
    dynasty: "秦",
    system: "郡縣",
    tick: "秦",
    headline: "統一之後，全國改成郡縣",
    body: "秦始皇不再分封諸侯，改設郡、縣，長官由朝廷任免。前214年南征嶺南，增置南海、桂林、象郡。秦郡總數歷來有三十六郡、四十八郡等不同說法，圖上只標一批常見郡治。象郡治所爭議很大，所以沒有落點。",
    units: [
      {
        id: "qin-core",
        name: "秦郡縣",
        short: "秦",
        kind: "core",
        color: C.guan,
        adcodes: [110000, 120000, 130000, 140000, 210000, 310000, 320000, 330000, 340000, 350000, 360000, 370000, 410000, 420000, 430000, 440000, 450000, 500000, 510000, 610000, 640000, 810000, 820000],
        note: "一郡往往只相當於今日一省的一部分。顏色表示已置郡，郡與郡的界要看圓點，不是省界。",
      },
      {
        id: "qin-hetao",
        name: "河套邊郡",
        short: "河套",
        kind: "split",
        color: C.sai,
        adcodes: [150000],
        note: "九原、雲中在河套。今日內蒙古大部分當時不屬秦郡。",
      },
      {
        id: "qin-qian",
        name: "黔中郡",
        short: "黔中",
        kind: "frontier",
        color: C.qian,
        adcodes: [520000],
        note: "黔中郡置了又罷，不是穩定內地。",
      },
      {
        id: "qin-long",
        name: "隴西郡",
        short: "隴西",
        kind: "frontier",
        color: C.long,
        adcodes: [620000],
        note: "郡境到臨洮一帶，不是今日整個甘肅。",
      },
      {
        id: "qin-sushen",
        name: "肅慎一帶",
        short: "肅慎",
        kind: "outer",
        adcodes: [220000, 230000],
        note: "東北森林地帶，秦沒有設郡。",
      },
      {
        id: "qin-hainan",
        name: "未置郡",
        short: "未置郡",
        kind: "outer",
        adcodes: [460000],
        note: "海南要到西漢才設珠崖、儋耳。",
      },
      {
        id: "qin-xinan",
        name: "西南夷",
        short: "西南夷",
        kind: "outer",
        adcodes: [530000],
        note: "秦開五尺道，但沒有穩定的郡。",
      },
      {
        id: "qin-zang",
        name: "未置郡",
        short: "未置郡",
        kind: "outer",
        adcodes: [540000],
        note: "青藏高原不在秦郡範圍。",
      },
      {
        id: "qin-qiang",
        name: "羌",
        short: "羌",
        kind: "outer",
        adcodes: [630000],
        note: "河湟以西為羌人居地。",
      },
      {
        id: "qin-xiyu",
        name: "未置郡",
        short: "未置郡",
        kind: "outer",
        adcodes: [650000],
        note: "西域當時不屬秦。",
      },
      {
        id: "qin-tai",
        name: "未置郡",
        short: "未置郡",
        kind: "outer",
        adcodes: [710000],
        note: "秦的郡縣沒有包括臺灣。",
      },
    ],
    points: QIN_POINTS,
  },
  {
    id: "han",
    year: 2,
    yearText: "公元2年",
    dynasty: "西漢",
    system: "十三州",
    tick: "漢",
    headline: "十三刺史部，州的前身",
    body: "武帝以後在郡之上設刺史部，習慣叫做十三州，用來監察郡國。州後來才變成真正的一級政區。元始二年，珠崖郡已經撤銷，海南不在版圖裡。西域都護管的是綠洲城國，不是把今日整個新疆畫成郡縣。",
    units: [
      { id: "han-sili", name: "司隸校尉部", short: "司隸", kind: "core", color: C.guan, adcodes: [610000], note: "監察首都一帶。河東、河南、河內也屬司隸，圖上分別歸在并州、豫州。" },
      { id: "han-yu", name: "豫州", short: "豫州", kind: "core", color: C.yu, adcodes: [410000], note: "今日河南北部有幾郡其實屬司隸。" },
      { id: "han-ji", name: "冀州", short: "冀州", kind: "core", color: C.ji, adcodes: [130000], note: "大致在今日河北中南部。" },
      { id: "han-qing", name: "青州", short: "青州", kind: "core", color: C.qi, adcodes: [370000], note: "山東半島屬青州，西部多屬兗州，南部一部屬徐州。" },
      { id: "han-xu", name: "徐州", short: "徐州", kind: "core", color: C.huai, adcodes: [320000], note: "含今日蘇北和魯南。蘇南則屬揚州。" },
      { id: "han-jing", name: "荊州", short: "荊州", kind: "core", color: C.jing, adcodes: [420000, 430000], note: "湖北、湖南的主體。" },
      { id: "han-yang", name: "揚州", short: "揚州", kind: "core", color: C.wu, adcodes: [340000, 360000, 330000, 350000, 310000], note: "從淮南一直到會稽，福建沿海也掛在會稽南部。" },
      { id: "han-yi", name: "益州", short: "益州", kind: "core", color: C.shu, adcodes: [510000, 500000, 530000, 520000], note: "巴蜀加上西南夷新置的郡，雲南、貴州開始進入這套制度。" },
      { id: "han-liang", name: "涼州", short: "涼州", kind: "core", color: C.long, adcodes: [620000, 640000], note: "河西四郡已經設立。" },
      { id: "han-bing", name: "并州", short: "并州", kind: "core", color: C.jin, adcodes: [140000], note: "太原、上黨一帶。河東郡屬司隸。" },
      { id: "han-you", name: "幽州", short: "幽州", kind: "core", color: C.liao, adcodes: [110000, 120000, 210000], note: "燕地和遼東。今日北京一帶屬幽州，不屬冀州。" },
      { id: "han-jiao", name: "交趾刺史部", short: "交趾", kind: "core", color: C.yue, adcodes: [440000, 450000, 810000, 820000], note: "嶺南。東漢才改稱交州。" },
      { id: "han-xiyu", name: "西域都護府", short: "西域", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "前60年設都護，駐綠洲城國，不管整個天山南北的每一寸地。" },
      { id: "han-hetao", name: "河套／匈奴", short: "河套", kind: "split", color: C.sai, adcodes: [150000], note: "河套有朔方、五原。漠北仍是匈奴。" },
      { id: "han-yilou", name: "挹婁", short: "挹婁", kind: "outer", adcodes: [220000, 230000], note: "玄菟郡只及遼東塞外一部，吉林、黑龍江主體未置郡。" },
      { id: "han-hainan", name: "珠崖已罷", short: "罷郡", kind: "outer", adcodes: [460000], note: "珠崖、儋耳設於前110年左右，前46年罷棄。" },
      { id: "han-qiang", name: "西羌", short: "西羌", kind: "outer", adcodes: [630000], note: "金城郡以外的青海，仍是羌人地方。" },
      { id: "han-zang", name: "未置州", short: "未置州", kind: "outer", adcodes: [540000], note: "高原部族，不在十三州之內。" },
      { id: "han-tai", name: "未置縣", short: "未置縣", kind: "outer", adcodes: [710000], note: "會稽海外，漢朝沒有設縣。" },
    ],
  },
  {
    id: "tang",
    year: 741,
    yearText: "741年",
    dynasty: "唐",
    system: "十五道",
    tick: "唐",
    headline: "開元末年的十五道",
    body: "唐先分十道監察天下，開元年間把山南、江南拆開，成為十五道。道後來越來越像一級政區。同一張圖上，吐蕃、南詔、渤海、後突厥各據一方；安西、北庭都護府則管西域軍鎮。南詔已在738年統一洱海地區。",
    units: [
      { id: "tang-jingji", name: "京畿道", short: "京畿", kind: "core", color: C.guan, adcodes: [610000], note: "長安所在。關內其餘地方另屬關內道。" },
      { id: "tang-duji", name: "都畿道", short: "都畿", kind: "core", color: C.yu, adcodes: [410000], note: "洛陽一帶。河南道仍包括山東和淮北。" },
      { id: "tang-guannei", name: "關內道", short: "關內", kind: "core", color: C.ning, adcodes: [640000], note: "圖上用今日寧夏代表關內道北部，實際還包括隴東和關中外圍。" },
      { id: "tang-henan", name: "河南道", short: "河南道", kind: "core", color: C.qi, adcodes: [370000], note: "今日山東是主體。豫東、淮北也屬河南道。" },
      { id: "tang-hedong", name: "河東道", short: "河東", kind: "core", color: C.jin, adcodes: [140000], note: "大致即今日山西。" },
      { id: "tang-hebei", name: "河北道", short: "河北", kind: "core", color: C.ji, adcodes: [130000, 110000, 120000], note: "含幽州，也就是後來的北京一帶。" },
      { id: "tang-shannan-e", name: "山南東道", short: "山南東", kind: "core", color: C.e, adcodes: [420000], note: "荊襄為主。" },
      { id: "tang-shannan-w", name: "山南西道", short: "山南西", kind: "core", color: C.shu, adcodes: [500000], note: "漢中和巴山。圖上用今日重慶示意，漢中其實在陝西南部。" },
      { id: "tang-longyou", name: "隴右道", short: "隴右", kind: "core", color: C.long, adcodes: [620000], note: "河西、隴右。青海湖以西此時多已入吐蕃。" },
      { id: "tang-huainan", name: "淮南道", short: "淮南", kind: "core", color: C.huai, adcodes: [320000, 340000], note: "淮河和長江之間。" },
      { id: "tang-jiangnan-e", name: "江南東道", short: "江南東", kind: "core", color: C.wu, adcodes: [330000, 350000, 310000], note: "江東、福建。福建尚未單獨成道。" },
      { id: "tang-jiangnan-w", name: "江南西道", short: "江南西", kind: "core", color: C.xiang, adcodes: [360000, 430000], note: "江西和湖南。湖北屬山南，不在這裡。" },
      { id: "tang-qian", name: "黔中道", short: "黔中", kind: "core", color: C.qian, adcodes: [520000], note: "從江南道分出的西南山區。" },
      { id: "tang-jiannan", name: "劍南道", short: "劍南", kind: "core", color: "#6d4570", adcodes: [510000], note: "劍閣以南的四川盆地。雲南已是南詔，不算劍南。" },
      { id: "tang-lingnan", name: "嶺南道", short: "嶺南", kind: "core", color: C.yue, adcodes: [440000, 450000, 460000, 810000, 820000], note: "五嶺以南，含瓊州。" },
      { id: "tang-nanzhao", name: "南詔", short: "南詔", kind: "core", color: C.dian, adcodes: [530000], note: "738年統一，都太和城，在今大理一帶。" },
      { id: "tang-tubo", name: "吐蕃", short: "吐蕃", kind: "core", color: C.zang, adcodes: [540000, 630000], note: "此時控制青藏高原大部，並進迫河湟。" },
      { id: "tang-tujue", name: "後突厥", short: "後突厥", kind: "frontier", color: C.sai, adcodes: [150000], note: "741年後突厥尚未崩潰，回紇稱汗要到745年。" },
      { id: "tang-anxi", name: "安西、北庭", short: "安西", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "都護府控制軍鎮和綠洲，吐蕃也在爭奪塔里木。" },
      { id: "tang-ying", name: "營州／渤海", short: "營州", kind: "split", color: C.liao, adcodes: [210000], note: "遼西仍有營州，遼東大部與渤海相接。安東都護府已經很弱。" },
      { id: "tang-bohai", name: "渤海", short: "渤海", kind: "core", color: C.hei, adcodes: [220000, 230000], note: "靺鞨所建，都上京龍泉府，在今黑龍江寧安一帶。" },
      { id: "tang-tai", name: "流求", short: "流求", kind: "outer", adcodes: [710000], note: "唐代文獻中的流求，沒有設道或州。" },
    ],
  },
  {
    id: "song-liao",
    year: 1111,
    yearText: "1111年",
    dynasty: "宋、遼、西夏",
    system: "路",
    tick: "宋遼",
    headline: "燕雲在遼，河西在西夏",
    body: "北宋把唐的道改成路，例如兩浙路、福建路、廣南東路。但今日的北京不在宋境：燕雲是遼的南京析津府。河西是西夏，雲南是大理。河北一省當時被宋、遼分佔，所以畫成斜線。",
    units: [
      { id: "sl-nanjing", name: "遼南京道", short: "遼南京", kind: "core", color: C.liao, adcodes: [110000, 120000], note: "析津府，就是後來的北京。對宋人來說這是燕雲故地。" },
      { id: "sl-dongjing", name: "遼東京道", short: "遼東京", kind: "core", color: "#2f4f73", adcodes: [210000], note: "遼陽一帶。" },
      { id: "sl-shangjing", name: "遼上京道", short: "遼上京", kind: "core", color: C.hei, adcodes: [220000, 230000, 150000], note: "上京臨潢府在今內蒙古巴林左旗。圖上把東北和內蒙古併在一起，只表示同屬遼的北部。" },
      { id: "sl-jingdong", name: "京東路", short: "京東", kind: "core", color: C.qi, adcodes: [370000], note: "北宋京東東路、京東西路，約今日山東。" },
      { id: "sl-jingxi", name: "京畿、京西路", short: "京西", kind: "core", color: C.yu, adcodes: [410000], note: "開封是京畿。京西北、京西南路延伸到襄鄧。" },
      { id: "sl-hedong", name: "宋河東／遼西京", short: "河東", kind: "split", color: C.jin, adcodes: [140000], note: "太原屬宋河東路，大同（雲州）屬遼西京道。" },
      { id: "sl-shanxi", name: "永興軍、秦鳳路", short: "陝西", kind: "core", color: C.guan, adcodes: [610000], note: "北宋習慣把這一片稱作陝西。北緣與西夏相接。" },
      { id: "sl-huainan", name: "淮南東、西路", short: "淮南", kind: "core", color: C.huai, adcodes: [320000, 340000], note: "皖南實際上多屬江南東路，圖上沒有拆開安徽。" },
      { id: "sl-liangzhe", name: "兩浙路", short: "兩浙", kind: "core", color: C.wu, adcodes: [330000, 310000], note: "含今天的上海。" },
      { id: "sl-fujian", name: "福建路", short: "福建", kind: "core", color: C.min, adcodes: [350000], note: "福建從此穩定地單獨成為一級政區。" },
      { id: "sl-jiangnan", name: "江南西路", short: "江南西", kind: "core", color: C.gan, adcodes: [360000], note: "約今日江西。" },
      { id: "sl-jinghu-n", name: "荊湖北路", short: "荊湖北", kind: "core", color: C.e, adcodes: [420000], note: "江陵、鄂州一帶。" },
      { id: "sl-jinghu-s", name: "荊湖南路", short: "荊湖南", kind: "core", color: C.xiang, adcodes: [430000], note: "潭州，今長沙。" },
      { id: "sl-chuan", name: "川峽四路", short: "川峽", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "成都府、梓州、利州、夔州四路。宋人由此把這裡叫四川。" },
      { id: "sl-guangnan-e", name: "廣南東路", short: "廣南東", kind: "core", color: C.yue, adcodes: [440000, 810000, 820000], note: "廣州。海南不在這一路。" },
      { id: "sl-guangnan-w", name: "廣南西路", short: "廣南西", kind: "core", color: C.gui, adcodes: [450000, 460000], note: "桂林和瓊管。海南屬廣南西路。" },
      { id: "sl-qian", name: "夔州路南部", short: "黔", kind: "frontier", color: C.qian, adcodes: [520000], note: "宋對貴州多是羈縻州，不是內地正州。" },
      { id: "sl-hebei", name: "宋河北路／遼南京", short: "宋／遼", kind: "split", color: C.ji, adcodes: [130000], note: "白溝河以南大致屬宋，以北屬遼。今日河北省無法用一條省界切開。" },
      { id: "sl-gansu", name: "秦鳳路／西夏", short: "宋／夏", kind: "split", color: C.long, adcodes: [620000], note: "隴南、秦州一帶屬宋，河西走廊屬西夏。" },
      { id: "sl-xia", name: "西夏", short: "西夏", kind: "core", color: C.xia, adcodes: [640000], note: "都興慶府，在今日銀川。" },
      { id: "sl-dali", name: "大理", short: "大理", kind: "core", color: C.dian, adcodes: [530000], note: "937年以來的大理國，宋朝沒有把雲南設路。" },
      { id: "sl-tubo", name: "吐蕃諸部", short: "吐蕃", kind: "frontier", color: C.zang, adcodes: [540000], note: "吐蕃帝國崩潰後的各地部族。" },
      { id: "sl-gusiluo", name: "唃廝囉", short: "唃廝囉", kind: "frontier", color: C.qinghai, adcodes: [630000], note: "青唐城，在今日西寧一帶，夾在宋和西夏之間。" },
      { id: "sl-xiyu", name: "高昌、喀喇汗", short: "西域", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "東部多屬西州回鶻，西部與喀喇汗朝相關。不是宋的路。" },
      { id: "sl-tai", name: "流求", short: "流求", kind: "outer", adcodes: [710000], note: "宋朝沒有在島上設路。" },
    ],
  },
  {
    id: "song-jin",
    year: 1142,
    yearText: "1142年",
    dynasty: "南宋、金",
    system: "路",
    tick: "宋金",
    headline: "紹興和議，大致以淮河為界",
    body: "靖康之變後宋室南渡。1141年的和議裡，淮北歸金，淮南歸宋，西邊以大散關附近為界。金在華北沿用路制，南宋也繼續用路。西域這時多在西遼範圍。西夏仍然佔著銀川和河西。",
    units: [
      { id: "sj-zhongdu", name: "金中都、河北路", short: "金河北", kind: "core", color: C.jinDyn, adcodes: [110000, 120000, 130000], note: "金把都城放在中都，就是今日北京。" },
      { id: "sj-shandong", name: "金山東路", short: "金山東", kind: "core", color: "#c48a3a", adcodes: [370000], note: "山東東路、山東西路。" },
      { id: "sj-hedong", name: "金河東路", short: "金河東", kind: "core", color: C.jin, adcodes: [140000], note: "河東北路、河東南路。" },
      { id: "sj-nanjing", name: "金南京路", short: "金南京", kind: "core", color: C.yu, adcodes: [410000], note: "開封在金朝叫南京。" },
      { id: "sj-shanxi", name: "金京兆路", short: "金陝西", kind: "core", color: C.guan, adcodes: [610000], note: "關中屬金。漢中一帶仍屬南宋利州路。" },
      { id: "sj-shangjing", name: "金上京、東京路", short: "金東北", kind: "core", color: C.hei, adcodes: [210000, 220000, 230000], note: "金的龍興之地。上京會寧府在今哈爾濱阿城。" },
      { id: "sj-meng", name: "金西北路邊", short: "金邊", kind: "frontier", color: C.sai, adcodes: [150000], note: "金設招討司。更北的蒙古諸部即將崛起，1206年鐵木真才稱成吉思汗。" },
      { id: "sj-liangzhe", name: "兩浙路", short: "兩浙", kind: "core", color: C.wu, adcodes: [330000, 310000], note: "南宋行在臨安，在今日杭州。" },
      { id: "sj-fujian", name: "福建路", short: "福建", kind: "core", color: C.min, adcodes: [350000], note: "仍是南宋的路。" },
      { id: "sj-jiangnan", name: "江南東西路", short: "江南", kind: "core", color: C.gan, adcodes: [360000], note: "圖上只含今日江西。" },
      { id: "sj-jinghu-n", name: "荊湖北路", short: "荊湖北", kind: "core", color: C.e, adcodes: [420000], note: "襄陽仍在宋境。" },
      { id: "sj-jinghu-s", name: "荊湖南路", short: "荊湖南", kind: "core", color: C.xiang, adcodes: [430000], note: "潭州。" },
      { id: "sj-chuan", name: "川峽四路", short: "川峽", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "南宋西部的支柱，軍政上常稱四川。" },
      { id: "sj-guangnan-e", name: "廣南東路", short: "廣南東", kind: "core", color: C.yue, adcodes: [440000, 810000, 820000], note: "廣州。" },
      { id: "sj-guangnan-w", name: "廣南西路", short: "廣南西", kind: "core", color: C.gui, adcodes: [450000, 460000], note: "桂林、雷瓊。" },
      { id: "sj-qian", name: "羈縻州", short: "羈縻", kind: "frontier", color: C.qian, adcodes: [520000], note: "貴州仍多羈縻，不是南宋的內地州。" },
      { id: "sj-huai", name: "金宋分界", short: "淮河", kind: "split", color: C.huai, adcodes: [320000, 340000], note: "和議以淮河為界。今日江蘇、安徽都被淮河切成兩半。" },
      { id: "sj-xia-ning", name: "西夏", short: "西夏", kind: "core", color: C.xia, adcodes: [640000], note: "夏仁宗在位，國勢仍穩。" },
      { id: "sj-xia-gan", name: "西夏河西", short: "河西", kind: "core", color: "#c4924a", adcodes: [620000], note: "涼州、甘州、肅州屬西夏。隴南一部仍可能屬宋，省界畫不開。" },
      { id: "sj-dali", name: "大理", short: "大理", kind: "core", color: C.dian, adcodes: [530000], note: "大理仍在，1253年才為蒙古所滅。" },
      { id: "sj-tubo", name: "吐蕃諸部", short: "吐蕃", kind: "frontier", color: C.zang, adcodes: [540000], note: "沒有統一的吐蕃王朝。" },
      { id: "sj-qing", name: "吐蕃、西夏邊地", short: "河湟", kind: "frontier", color: C.qinghai, adcodes: [630000], note: "河湟在金、夏和吐蕃部族之間。" },
      { id: "sj-xiliao", name: "西遼", short: "西遼", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "耶律大石1132年稱帝。天山以南並不完全聽命，圖上只標主要政權。" },
      { id: "sj-tai", name: "流求", short: "流求", kind: "outer", adcodes: [710000], note: "南宋沒有設州縣。" },
    ],
  },
  {
    id: "yuan",
    year: 1330,
    yearText: "1330年",
    dynasty: "元",
    system: "行省",
    tick: "元",
    headline: "行中書省，省這一級從這裡開始",
    body: "元朝把地方分成行中書省，簡稱行省。腹裏由中書省直管，不叫行省。西藏一帶歸宣政院。今日廣東屬江西行省，廣西屬湖廣行省，跟後來的省界很不一樣。1330年代的天山南北，多在察合台汗國手裡。",
    units: [
      { id: "yuan-zhongshu", name: "中書省", short: "腹裏", kind: "core", color: C.ji, adcodes: [110000, 120000, 130000, 140000, 370000], note: "大都、上都直轄。含今天的河北、山西、山東。河南不在腹裏。" },
      { id: "yuan-liaoyang", name: "遼陽行省", short: "遼陽", kind: "core", color: C.liao, adcodes: [210000, 220000, 230000], note: "東北第一次整片設行省。" },
      { id: "yuan-henan", name: "河南江北行省", short: "河南江北", kind: "core", color: C.yu, adcodes: [410000, 320000, 340000], note: "名字裡的江北很關鍵：長江以南不屬這個省。今日江蘇、安徽被江切開。" },
      { id: "yuan-jiangzhe", name: "江浙行省", short: "江浙", kind: "core", color: C.wu, adcodes: [330000, 350000, 310000], note: "治杭州。福建也在這個行省裡。" },
      { id: "yuan-jiangxi", name: "江西行省", short: "江西", kind: "core", color: C.yue, adcodes: [360000, 440000, 810000, 820000], note: "治龍興（南昌）。廣東道屬江西行省，所以今日廣東在這一片裡。" },
      { id: "yuan-huguang", name: "湖廣行省", short: "湖廣", kind: "core", color: C.jing, adcodes: [420000, 430000, 450000, 460000, 520000], note: "治武昌。湖北、湖南、廣西、海南、貴州大多挂在這裡。貴州還夾著四川、雲南的地面。" },
      { id: "yuan-chuan", name: "四川行省", short: "四川", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "治成都。" },
      { id: "yuan-yunnan", name: "雲南行省", short: "雲南", kind: "core", color: C.dian, adcodes: [530000], note: "1276年設立。治中慶，今昆明。" },
      { id: "yuan-shaanxi", name: "陝西行省", short: "陝西", kind: "core", color: C.guan, adcodes: [610000], note: "治奉元，今西安。甘肅另有行省。" },
      { id: "yuan-gansu", name: "甘肅行省", short: "甘肅", kind: "core", color: C.long, adcodes: [620000, 640000], note: "治甘州，今張掖。河西是主體。" },
      { id: "yuan-xuanzheng", name: "宣政院轄地", short: "宣政院", kind: "frontier", color: C.zang, adcodes: [540000, 630000], note: "烏思藏、朵甘等。宣政院在大都，不是內地那種行省。" },
      { id: "yuan-lingbei", name: "嶺北行省", short: "嶺北", kind: "frontier", color: C.sai, adcodes: [150000], note: "治和林，主體在漠北。今日內蒙古南部更靠近腹裏，圖上無法拆開。" },
      { id: "yuan-chagatai", name: "察合台汗國", short: "察合台", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "與元朝時戰時和。哈密一帶往來較多。" },
      { id: "yuan-tai", name: "琉求", short: "琉求", kind: "outer", adcodes: [710000], note: "澎湖巡檢司屬江浙行省。臺灣本島沒有設行省。" },
    ],
  },
  {
    id: "ming",
    year: 1582,
    yearText: "1582年",
    dynasty: "明",
    system: "兩京十三省",
    tick: "明",
    headline: "兩京十三布政使司",
    body: "明初把行省改成布政使司，口頭仍叫省。北直隸、南直隸是兩京，加上十三個布政使司。今日的甘肅、寧夏還包在陝西裡面。貴州在1413年已經單獨成省。萬曆年間，奴兒干都司名存實亡，東北大多數地方是女真各部。",
    units: [
      { id: "ming-bei", name: "北直隸", short: "北直隸", kind: "core", color: C.ji, adcodes: [110000, 120000, 130000], note: "京師順天府和北直隸各府。" },
      { id: "ming-nan", name: "南直隸", short: "南直隸", kind: "core", color: C.huai, adcodes: [320000, 340000, 310000], note: "南京和應天、蘇州、鳳陽等府。後來拆成江蘇、安徽。" },
      { id: "ming-lu", name: "山東布政使司", short: "山東", kind: "core", color: C.qi, adcodes: [370000], note: "治濟南。遼東在行政上曾掛山東，地圖上遼東單獨畫都司。" },
      { id: "ming-jin", name: "山西布政使司", short: "山西", kind: "core", color: C.jin, adcodes: [140000], note: "治太原。" },
      { id: "ming-yu", name: "河南布政使司", short: "河南", kind: "core", color: C.yu, adcodes: [410000], note: "治開封。" },
      { id: "ming-shan", name: "陝西布政使司", short: "陝西", kind: "core", color: C.guan, adcodes: [610000, 620000, 640000], note: "治西安。含今日甘肅、寧夏。甘肅要到清代才分省。" },
      { id: "ming-shu", name: "四川布政使司", short: "四川", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "治成都。" },
      { id: "ming-gan", name: "江西布政使司", short: "江西", kind: "core", color: C.gan, adcodes: [360000], note: "治南昌。廣東已經分出去。" },
      { id: "ming-huguang", name: "湖廣布政使司", short: "湖廣", kind: "core", color: C.jing, adcodes: [420000, 430000], note: "治武昌。湖北、湖南仍是一個省，清初才拆開。" },
      { id: "ming-zhe", name: "浙江布政使司", short: "浙江", kind: "core", color: C.wu, adcodes: [330000], note: "治杭州。" },
      { id: "ming-min", name: "福建布政使司", short: "福建", kind: "core", color: C.min, adcodes: [350000], note: "治福州。澎湖屬福建，臺灣本島尚未設府。" },
      { id: "ming-yue", name: "廣東布政使司", short: "廣東", kind: "core", color: C.yue, adcodes: [440000, 460000, 810000, 820000], note: "治廣州，瓊州府屬廣東。1557年起葡萄牙人居留澳門，主權仍屬明朝。" },
      { id: "ming-gui", name: "廣西布政使司", short: "廣西", kind: "core", color: C.gui, adcodes: [450000], note: "治桂林。" },
      { id: "ming-dian", name: "雲南布政使司", short: "雲南", kind: "core", color: C.dian, adcodes: [530000], note: "治雲南府，今昆明。" },
      { id: "ming-qian", name: "貴州布政使司", short: "貴州", kind: "core", color: C.qian, adcodes: [520000], note: "1413年設省，治貴陽。" },
      { id: "ming-liaodong", name: "遼東都司", short: "遼東", kind: "frontier", color: C.liao, adcodes: [210000], note: "軍事系統的都指揮使司，治遼陽，不是布政使司。" },
      { id: "ming-nvzhen", name: "女真諸部", short: "女真", kind: "frontier", color: C.hei, adcodes: [220000, 230000], note: "奴兒干都司設於1409年，正統以後名存實亡。建州女真正在興起。" },
      { id: "ming-meng", name: "蒙古諸部", short: "蒙古", kind: "frontier", color: C.sai, adcodes: [150000], note: "韃靼、瓦剌。明朝在長城一線設九邊，沒有把草原設省。" },
      { id: "ming-wusi", name: "烏思藏都司", short: "烏思藏", kind: "frontier", color: C.zang, adcodes: [540000], note: "羈縻都司，不是布政使司。" },
      { id: "ming-duogan", name: "朵甘都司", short: "朵甘", kind: "frontier", color: C.qinghai, adcodes: [630000], note: "名義上的羈縻都司，約在今日青海、川西。" },
      { id: "ming-xiyu", name: "西域諸國", short: "西域", kind: "outer", adcodes: [650000], note: "吐魯番、葉爾羌等。明朝沒有在這裡設布政使司。" },
      { id: "ming-tai", name: "未設府", short: "未設府", kind: "outer", adcodes: [710000], note: "澎湖巡檢屬福建。荷蘭人1624年才據臺南，已在這個年份之後。" },
    ],
  },
  {
    id: "qing",
    year: 1820,
    yearText: "1820年",
    dynasty: "清",
    system: "十八省",
    tick: "清",
    headline: "內地十八省，東北和藩部還不叫省",
    body: "嘉慶末年，內地是直隸加上十八省裡的其餘各省。臺灣仍是福建省的臺灣府，1885年才建省。新疆1884年才建省，此時由伊犁將軍管轄。東北是盛京、吉林、黑龍江三將軍，蒙古用盟旗，青海、西藏設辦事大臣。",
    units: [
      { id: "qing-zhili", name: "直隸省", short: "直隸", kind: "core", color: C.ji, adcodes: [110000, 120000, 130000], note: "順天府是京師。直隸總督長期駐保定。" },
      { id: "qing-su", name: "江蘇省", short: "江蘇", kind: "core", color: C.huai, adcodes: [320000, 310000], note: "布政使駐蘇州。上海縣屬松江府。" },
      { id: "qing-wan", name: "安徽省", short: "安徽", kind: "core", color: "#6a9148", adcodes: [340000], note: "從南直隸分出，布政使駐安慶。" },
      { id: "qing-jin", name: "山西省", short: "山西", kind: "core", color: C.jin, adcodes: [140000], note: "治太原。" },
      { id: "qing-lu", name: "山東省", short: "山東", kind: "core", color: C.qi, adcodes: [370000], note: "治濟南。" },
      { id: "qing-yu", name: "河南省", short: "河南", kind: "core", color: C.yu, adcodes: [410000], note: "治開封。" },
      { id: "qing-shan", name: "陝西省", short: "陝西", kind: "core", color: C.guan, adcodes: [610000], note: "與甘肅分省之後的陝西。" },
      { id: "qing-long", name: "甘肅省", short: "甘肅", kind: "core", color: C.long, adcodes: [620000, 640000], note: "含今日寧夏。新疆尚未建省。" },
      { id: "qing-zhe", name: "浙江省", short: "浙江", kind: "core", color: C.wu, adcodes: [330000], note: "治杭州。" },
      { id: "qing-gan", name: "江西省", short: "江西", kind: "core", color: C.gan, adcodes: [360000], note: "治南昌。" },
      { id: "qing-e", name: "湖北省", short: "湖北", kind: "core", color: C.e, adcodes: [420000], note: "湖廣拆成兩省之後，湖廣總督仍駐武昌。" },
      { id: "qing-xiang", name: "湖南省", short: "湖南", kind: "core", color: C.xiang, adcodes: [430000], note: "治長沙。" },
      { id: "qing-shu", name: "四川省", short: "四川", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "治成都。今日重慶市大部分當時是重慶府等府縣，不是直轄市。" },
      { id: "qing-min", name: "福建省", short: "福建", kind: "core", color: C.min, adcodes: [350000, 710000], note: "臺灣府屬福建。1684年設府，1885年才單獨建省。" },
      { id: "qing-yue", name: "廣東省", short: "廣東", kind: "core", color: C.yue, adcodes: [440000, 460000, 810000, 820000], note: "瓊州府屬廣東。香港島要到1842年才割讓。澳門已有葡萄牙人居留，此時主權仍屬清朝。" },
      { id: "qing-gui", name: "廣西省", short: "廣西", kind: "core", color: C.gui, adcodes: [450000], note: "治桂林。" },
      { id: "qing-dian", name: "雲南省", short: "雲南", kind: "core", color: C.dian, adcodes: [530000], note: "治雲南府。" },
      { id: "qing-qian", name: "貴州省", short: "貴州", kind: "core", color: C.qian, adcodes: [520000], note: "治貴陽。" },
      { id: "qing-fengtian", name: "盛京", short: "盛京", kind: "frontier", color: C.liao, adcodes: [210000], note: "盛京將軍，一般也叫奉天。1907年才改行省。" },
      { id: "qing-jilin", name: "吉林", short: "吉林", kind: "frontier", color: C.jilin, adcodes: [220000], note: "吉林將軍。1907年建省。" },
      { id: "qing-hei", name: "黑龍江", short: "黑龍江", kind: "frontier", color: C.hei, adcodes: [230000], note: "黑龍江將軍。1907年建省。" },
      { id: "qing-meng", name: "蒙古盟旗", short: "盟旗", kind: "frontier", color: C.sai, adcodes: [150000], note: "內扎薩克各旗，不設省。外蒙古不在今日內蒙古範圍內。" },
      { id: "qing-qinghai", name: "青海", short: "青海", kind: "frontier", color: C.qinghai, adcodes: [630000], note: "西寧辦事大臣。1928年才建青海省。" },
      { id: "qing-zang", name: "西藏", short: "西藏", kind: "frontier", color: C.zang, adcodes: [540000], note: "駐藏大臣與噶廈並存。不是內地的省。" },
      { id: "qing-yili", name: "伊犁將軍", short: "伊犁", kind: "frontier", color: C.yuqi, adcodes: [650000], note: "1884年建新疆省。1820年還沒有這個省名。" },
    ],
  },
  {
    id: "roc",
    year: 1946,
    yearText: "1946年",
    dynasty: "民國",
    system: "省",
    tick: "民國",
    headline: "省名已經很像今天",
    body: "抗戰勝利後的1946年，內地省名大多能對上今日的省。對不上的是那些橫跨今日省界的省：熱河、察哈爾、綏遠、西康，還有東北一度劃出的九省。海南仍屬廣東。重慶城是直轄市，市域卻比今日重慶小得多。臺灣在1945年光復，設臺灣省。",
    units: [
      { id: "roc-ping", name: "北平市", short: "北平", kind: "core", color: "#8e2f2f", adcodes: [110000], note: "1928年改名北平。今日北京市的市界比當時大。" },
      { id: "roc-jin", name: "天津市", short: "天津", kind: "core", color: "#4e89a8", adcodes: [120000], note: "直轄市。市界其後擴大過。" },
      { id: "roc-ji", name: "河北省", short: "河北", kind: "core", color: C.ji, adcodes: [130000], note: "1928年由直隸改名。冀北一部當時屬熱河省。" },
      { id: "roc-shanxi", name: "山西省", short: "山西", kind: "core", color: C.jin, adcodes: [140000], note: "省界與今日相近。" },
      { id: "roc-meng", name: "熱察綏、蒙古地方", short: "熱察綏", kind: "split", color: C.sai, adcodes: [150000], note: "綏遠、察哈爾、熱河三省和蒙古地方，都無法按今日內蒙古邊界一一對上。" },
      { id: "roc-liao", name: "遼寧省", short: "遼寧", kind: "core", color: C.liao, adcodes: [210000], note: "1945年後東北曾劃成九省，包括安東、遼北。圖上沒有拆開。" },
      { id: "roc-jilin", name: "吉林省", short: "吉林", kind: "core", color: C.jilin, adcodes: [220000], note: "九省方案裡旁邊還有松江等省。" },
      { id: "roc-hei", name: "黑龍江省", short: "黑龍江", kind: "core", color: C.hei, adcodes: [230000], note: "九省方案裡還有合江、嫩江、興安。" },
      { id: "roc-hu", name: "上海市", short: "上海", kind: "core", color: "#c45c5c", adcodes: [310000], note: "1927年設直轄市。市界後來又吃進江蘇的縣。" },
      { id: "roc-su", name: "江蘇省", short: "江蘇", kind: "core", color: C.huai, adcodes: [320000], note: "與今日省名相同。" },
      { id: "roc-zhe", name: "浙江省", short: "浙江", kind: "core", color: C.wu, adcodes: [330000], note: "與今日省名相同。" },
      { id: "roc-wan", name: "安徽省", short: "安徽", kind: "core", color: "#6a9148", adcodes: [340000], note: "與今日省名相同。" },
      { id: "roc-min", name: "福建省", short: "福建", kind: "core", color: C.min, adcodes: [350000], note: "臺灣已經分省。" },
      { id: "roc-gan", name: "江西省", short: "江西", kind: "core", color: C.gan, adcodes: [360000], note: "與今日省名相同。" },
      { id: "roc-lu", name: "山東省", short: "山東", kind: "core", color: C.qi, adcodes: [370000], note: "與今日省名相同。" },
      { id: "roc-yu", name: "河南省", short: "河南", kind: "core", color: C.yu, adcodes: [410000], note: "與今日省名相同。" },
      { id: "roc-e", name: "湖北省", short: "湖北", kind: "core", color: C.e, adcodes: [420000], note: "與今日省名相同。" },
      { id: "roc-xiang", name: "湖南省", short: "湖南", kind: "core", color: C.xiang, adcodes: [430000], note: "與今日省名相同。" },
      { id: "roc-yue", name: "廣東省", short: "廣東", kind: "core", color: C.yue, adcodes: [440000, 460000], note: "海南仍是廣東的瓊崖。1988年才設海南省。" },
      { id: "roc-gui", name: "廣西省", short: "廣西", kind: "core", color: C.gui, adcodes: [450000], note: "當時省名不帶「壯族自治區」。1958年改自治區。" },
      { id: "roc-shu", name: "四川省", short: "四川", kind: "core", color: C.shu, adcodes: [510000, 500000], note: "西康省在川西和藏東。重慶城區是直轄市，今日重慶市大部分當時仍屬四川。" },
      { id: "roc-qian", name: "貴州省", short: "貴州", kind: "core", color: C.qian, adcodes: [520000], note: "與今日省名相同。" },
      { id: "roc-dian", name: "雲南省", short: "雲南", kind: "core", color: C.dian, adcodes: [530000], note: "與今日省名相同。" },
      { id: "roc-zang", name: "西藏地方", short: "西藏", kind: "frontier", color: C.zang, adcodes: [540000], note: "當時不設省。" },
      { id: "roc-shaan", name: "陝西省", short: "陝西", kind: "core", color: C.guan, adcodes: [610000], note: "與今日省名相同。" },
      { id: "roc-long", name: "甘肅省", short: "甘肅", kind: "core", color: C.long, adcodes: [620000], note: "寧夏已經分出。" },
      { id: "roc-qing", name: "青海省", short: "青海", kind: "core", color: C.qinghai, adcodes: [630000], note: "1928年建省。" },
      { id: "roc-ning", name: "寧夏省", short: "寧夏", kind: "core", color: C.ning, adcodes: [640000], note: "1928年建省。1958年改自治區。" },
      { id: "roc-xin", name: "新疆省", short: "新疆", kind: "core", color: C.yuqi, adcodes: [650000], note: "1884年建省。1955年改自治區。" },
      { id: "roc-tai", name: "臺灣省", short: "臺灣", kind: "core", color: C.tai, adcodes: [710000], note: "1945年光復後設立。" },
      { id: "roc-hk", name: "香港", short: "香港", kind: "frontier", color: "#8a3e4a", adcodes: [810000], note: "英國管治。1997年設立特別行政區。" },
      { id: "roc-mo", name: "澳門", short: "澳門", kind: "frontier", color: "#a36b4a", adcodes: [820000], note: "葡萄牙管治。1999年設立特別行政區。" },
    ],
  },
];

function presentEra() {
  return {
    id: "now",
    year: 2026,
    yearText: "2026年",
    dynasty: "今日",
    system: "省級行政區",
    tick: "今日",
    headline: "省、自治區、直轄市、特別行政區",
    body: "現行省級單位，就是這張圖的格子。對照前面幾張，可以看到湖廣分成湖北、湖南，南直隸分成江蘇、安徽，陝西分出甘肅，海南、重慶、臺灣、新疆也先後單獨成一級。省界仍會調整，但名稱已經從郡、州、道、路、行省走到現在這一套。",
    units: PROVINCES.map((province) => ({
      id: `now-${province.adcode}`,
      name: province.full,
      short: province.name,
      kind: "core",
      color: province.color,
      adcodes: [province.adcode],
      note: province.level,
    })),
  };
}

export const ERAS = [...HISTORICAL, presentEra()];

export function validate(eras = ERAS, provinces = PROVINCES) {
  const codes = new Set(provinces.map((province) => province.adcode));
  const errors = [];
  const eraIds = new Set();
  for (const era of eras) {
    if (eraIds.has(era.id)) errors.push(`重複時代 ${era.id}`);
    eraIds.add(era.id);
    const seen = new Map();
    for (const unit of era.units) {
      if (!unit.adcodes?.length) errors.push(`${era.id} ${unit.id} 沒有範圍`);
      for (const code of unit.adcodes) {
        if (!codes.has(code)) errors.push(`${era.id} 未知代碼 ${code}`);
        if (seen.has(code)) errors.push(`${era.id} 重複 ${code}（${seen.get(code)} / ${unit.name}）`);
        seen.set(code, unit.name);
      }
    }
    for (const code of codes) {
      if (!seen.has(code)) errors.push(`${era.id} 缺少 ${code}`);
    }
  }
  return errors;
}

export function provinceByCode(adcode) {
  return PROVINCES.find((province) => province.adcode === Number(adcode));
}

export function unitFor(era, adcode) {
  return era.units.find((unit) => unit.adcodes.includes(Number(adcode)));
}

export function summarizeChanges(previous, current) {
  if (!previous) return [];
  const previousByCode = new Map();
  const currentByCode = new Map();
  for (const unit of previous.units) {
    for (const code of unit.adcodes) previousByCode.set(code, unit);
  }
  for (const unit of current.units) {
    for (const code of unit.adcodes) currentByCode.set(code, unit);
  }

  const messages = [];
  for (const oldUnit of previous.units) {
    const nextNames = new Map();
    for (const code of oldUnit.adcodes) {
      const next = currentByCode.get(code);
      if (!next) continue;
      nextNames.set(next.name, (nextNames.get(next.name) || 0) + 1);
    }
    const names = [...nextNames.keys()];
    if (names.length > 1) {
      messages.push({ count: oldUnit.adcodes.length, text: `${oldUnit.name} 拆為 ${joinNames(names)}` });
    } else if (names.length === 1 && names[0] !== oldUnit.name) {
      const nextUnit = current.units.find((unit) => unit.name === names[0]);
      const sameSet = nextUnit
        && nextUnit.adcodes.length === oldUnit.adcodes.length
        && nextUnit.adcodes.every((code) => previousByCode.get(code)?.name === oldUnit.name);
      if (sameSet) {
        messages.push({ count: oldUnit.adcodes.length, text: `${oldUnit.name} 改稱 ${names[0]}` });
      }
    }
  }

  for (const nextUnit of current.units) {
    const oldNames = new Map();
    for (const code of nextUnit.adcodes) {
      const oldUnit = previousByCode.get(code);
      if (!oldUnit) continue;
      oldNames.set(oldUnit.name, (oldNames.get(oldUnit.name) || 0) + 1);
    }
    const names = [...oldNames.keys()];
    if (names.length > 1) {
      messages.push({ count: nextUnit.adcodes.length, text: `${joinNames(names)} 併為 ${nextUnit.name}` });
    }
  }

  messages.sort((a, b) => b.count - a.count);
  const seen = new Set();
  const lines = [];
  for (const message of messages) {
    if (seen.has(message.text)) continue;
    seen.add(message.text);
    lines.push(message.text);
    if (lines.length === 7) break;
  }
  return lines;
}

function joinNames(names) {
  const shown = names.slice(0, 4).join("、");
  return names.length > 4 ? `${shown}等` : shown;
}
