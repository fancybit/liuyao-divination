import { HexagramData, CastResult } from '@/types'

// ========== 八卦基础 ==========
const BA_GUA: Record<string, { name: string; element: string; naJia: string[] }> = {
  '111': { name: '乾', element: '金', naJia: ['甲', '壬'] },
  '000': { name: '坤', element: '土', naJia: ['乙', '癸'] },
  '100': { name: '震', element: '木', naJia: ['庚'] },
  '010': { name: '坎', element: '水', naJia: ['戊'] },
  '001': { name: '艮', element: '土', naJia: ['丙'] },
  '110': { name: '巽', element: '木', naJia: ['辛'] },
  '101': { name: '离', element: '火', naJia: ['己'] },
  '011': { name: '兑', element: '金', naJia: ['丁'] },
}

// 十二地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const DI_ZHI_WU_XING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

// 六亲 (按生克关系)
const LIU_QIN = ['父母', '兄弟', '妻财', '官鬼', '子孙']

// 六兽
const LIU_SHOU = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武']

// 六兽起法: 按日干确定初爻
const LIU_SHOU_START: Record<string, number> = {
  '甲': 0, '乙': 0,  // 甲乙起青龙
  '丙': 2, '丁': 2,  // 丙丁起朱雀
  '戊': 4,           // 戊起勾陈
  '己': 0,           // 己起螣蛇 -> 实际是腾蛇，但按"甲乙起青龙、丙丁起朱雀、戊起勾陈、己起螣蛇、庚辛起白虎、壬癸起玄武"
  '庚': 4, '辛': 4,  // 庚辛起白虎
  '壬': 0, '癸': 0,  // 壬癸起玄武
}

// ========== 八宫卦序（每宫8卦，从本宫到归魂） ==========
// 每宫卦按世爻位置排列: 本宫(6世)、一世、二世、三世、四世、五世、游魂(4世)、归魂(3世)
const GONG_GUA: Record<string, number[]> = {
  '乾': [1, 44, 33, 12, 20, 23, 35, 14],   // 乾宫
  '兑': [58, 47, 45, 31, 60, 41, 54, 17],   // 兑宫
  '离': [30, 56, 50, 21, 22, 36, 6, 64],     // 离宫
  '震': [51, 16, 40, 32, 46, 48, 28, 7],     // 震宫
  '巽': [57, 9, 37, 42, 25, 27, 4, 11],      // 巽宫
  '坎': [29, 60, 3, 63, 49, 55, 8, 5],       // 坎宫 (一世节=60)
  '艮': [52, 18, 26, 38, 36, 19, 61, 15],    // 艮宫
  '坤': [2, 24, 11, 15, 45, 17, 53, 8],      // 坤宫 (一世复=24, 二世临=19已经用了，重新查)
}

// 修正八宫卦序（标准京房八宫）
const PALACE_HEXAGRAMS: Record<string, number[]> = {
  '乾': [1, 44, 33, 12, 20, 23, 35, 14],
  '坎': [29, 60, 3, 63, 49, 55, 36, 7],
  '艮': [52, 22, 26, 41, 61, 19, 56, 15],
  '震': [51, 16, 40, 32, 46, 48, 28, 17],
  '巽': [57, 9, 37, 42, 25, 21, 59, 27],
  '离': [30, 56, 50, 64, 4, 6, 53, 13],
  '坤': [2, 24, 19, 11, 34, 43, 5, 8],
  '兑': [58, 47, 45, 31, 39, 15, 62, 54],
}

// 世应位置: 按在宫中的序号 [世爻位置(1-6), 应爻位置]
const SHI_YING_POS: [number, number][] = [
  [6, 3], [1, 4], [2, 5], [3, 6], [4, 1], [5, 2], [4, 1], [3, 6]
]

// ========== 纳支表：八纯卦上下卦地支（京房纳支法） ==========
// 算法：任意卦的初爻-三爻(下卦)取对应八纯卦下卦地支，四爻-上爻(上卦)取对应八纯卦上卦地支
const TRIGRAM_INNER_ZHI: Record<string, string[]> = {
  '乾': ['子', '寅', '辰'],
  '兑': ['巳', '卯', '丑'],
  '离': ['卯', '丑', '亥'],
  '震': ['子', '寅', '辰'],
  '巽': ['丑', '亥', '酉'],
  '坎': ['寅', '辰', '午'],
  '艮': ['辰', '午', '申'],
  '坤': ['未', '巳', '卯'],
}
const TRIGRAM_OUTER_ZHI: Record<string, string[]> = {
  '乾': ['午', '申', '戌'],
  '兑': ['亥', '酉', '未'],
  '离': ['酉', '未', '巳'],
  '震': ['午', '申', '戌'],
  '巽': ['未', '巳', '卯'],
  '坎': ['申', '戌', '子'],
  '艮': ['戌', '子', '寅'],
  '坤': ['丑', '亥', '酉'],
}

// 按上下卦自动推算纳支（从初爻到上爻）
function computeNaZhi(hexId: number): string[] {
  const hex = HEXAGRAMS[hexId]
  if (!hex) return ['子', '寅', '辰', '午', '申', '戌']
  const inner = TRIGRAM_INNER_ZHI[hex.lowerTrigram] || ['子', '寅', '辰']
  const outer = TRIGRAM_OUTER_ZHI[hex.upperTrigram] || ['午', '申', '戌']
  return [...inner, ...outer]
}

// ========== 纳甲表：每卦六爻天干（初->上） ==========
const NA_JIA: Record<number, string[]> = {}
// 根据八纯卦纳甲自动推导各宫卦
function buildNaJia(): void {
  const pureNaJia: Record<string, string[]> = {
    '乾': ['甲', '甲', '甲', '壬', '壬', '壬'],
    '兑': ['丁', '丁', '丁', '丁', '丁', '丁'],
    '离': ['己', '己', '己', '己', '己', '己'],
    '震': ['庚', '庚', '庚', '庚', '庚', '庚'],
    '巽': ['辛', '辛', '辛', '辛', '辛', '辛'],
    '坎': ['戊', '戊', '戊', '戊', '戊', '戊'],
    '艮': ['丙', '丙', '丙', '丙', '丙', '丙'],
    '坤': ['乙', '乙', '乙', '癸', '癸', '癸'],
  }
  for (const [gong, hexList] of Object.entries(PALACE_HEXAGRAMS)) {
    const baseNaJia = pureNaJia[gong]
    hexList.forEach(hexId => {
      NA_JIA[hexId] = [...baseNaJia]
    })
  }
}
buildNaJia()

// ========== 获取卦所属宫和世应 ==========
function getHexagramPalace(hexId: number): { palace: string; shiYao: number; yingYao: number; position: number } {
  for (const [palace, hexList] of Object.entries(PALACE_HEXAGRAMS)) {
    const idx = hexList.indexOf(hexId)
    if (idx !== -1) {
      const [shi, ying] = SHI_YING_POS[idx]
      return { palace, shiYao: shi, yingYao: ying, position: idx }
    }
  }
  return { palace: '乾', shiYao: 6, yingYao: 3, position: 0 }
}

// ========== 六亲判定 ==========
function getLiuQin(palace: string, lineDiZhi: string): string {
  const woXing = BA_GUA[Object.entries(BA_GUA).find(([_, v]) => v.name === palace)?.[0] || '111'].element
  const zhiXing = DI_ZHI_WU_XING[lineDiZhi] || '土'
  // 生克关系
  const wuXingOrder = ['木', '火', '土', '金', '水']
  const woIdx = wuXingOrder.indexOf(woXing)
  const zhiIdx = wuXingOrder.indexOf(zhiXing)
  const diff = (zhiIdx - woIdx + 5) % 5
  // 0=同我(兄弟), 1=我生(子孙), 2=我克(妻财), 3=克我(官鬼), 4=生我(父母)
  switch (diff) {
    case 0: return '兄弟'
    case 1: return '子孙'
    case 2: return '妻财'
    case 3: return '官鬼'
    case 4: return '父母'
    default: return '兄弟'
  }
}

// ========== 排六兽 ==========
function getLiuShou(dayGan: string): string[] {
  // 按日干起六兽，从初爻排到上爻
  const startOrder = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武']
  let startIdx = 0
  if ('甲乙'.includes(dayGan)) startIdx = 0
  else if ('丙丁'.includes(dayGan)) startIdx = 1
  else if ('戊'.includes(dayGan)) startIdx = 2
  else if ('己'.includes(dayGan)) startIdx = 3
  else if ('庚辛'.includes(dayGan)) startIdx = 4
  else startIdx = 5
  const result: string[] = []
  for (let i = 0; i < 6; i++) {
    result.push(startOrder[(startIdx + i) % 6])
  }
  return result
}

// ========== 获取今日日干 ==========
function getTodayDayGan(): string {
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  // 简化版：用日期推算日干支 (以2020-01-01为甲辰日起点)
  const base = new Date(2020, 0, 1).getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.floor((today.getTime() - base) / (1000 * 60 * 60 * 24))
  return tianGan[((days % 10) + 10) % 10]
}

// ========== 64卦基础数据 ==========
const HEXAGRAMS: Record<number, Omit<HexagramData, 'lines'>> = {
  1: { id: 1, name: '乾为天', symbol: '䷀', upperTrigram: '乾', lowerTrigram: '乾', description: '元亨利贞。', judgment: '大哉乾元，万物资始，乃统天。云行雨施，品物流形。', image: '天行健，君子以自强不息。' },
  2: { id: 2, name: '坤为地', symbol: '䷁', upperTrigram: '坤', lowerTrigram: '坤', description: '元亨，利牝马之贞。', judgment: '至哉坤元，万物资生，乃顺承天。', image: '地势坤，君子以厚德载物。' },
  3: { id: 3, name: '水雷屯', symbol: '䷂', upperTrigram: '坎', lowerTrigram: '震', description: '元亨利贞。勿用有攸往，利建侯。', judgment: '屯，刚柔始交而难生。动乎险中，大亨贞。', image: '云雷屯，君子以经纶。' },
  4: { id: 4, name: '山水蒙', symbol: '䷃', upperTrigram: '艮', lowerTrigram: '坎', description: '亨。匪我求童蒙，童蒙求我。', judgment: '蒙，山下有险，险而止，蒙。', image: '山下出泉，蒙。君子以果行育德。' },
  5: { id: 5, name: '水天需', symbol: '䷄', upperTrigram: '坎', lowerTrigram: '乾', description: '有孚，光亨，贞吉。利涉大川。', judgment: '需，须也。险在前也，刚健而不陷。', image: '云上于天，需。君子以饮食宴乐。' },
  6: { id: 6, name: '天水讼', symbol: '䷅', upperTrigram: '乾', lowerTrigram: '坎', description: '有孚窒惕，中吉，终凶。', judgment: '讼，上刚下险，险而健，讼。', image: '天与水违行，讼。君子以作事谋始。' },
  7: { id: 7, name: '地水师', symbol: '䷆', upperTrigram: '坤', lowerTrigram: '坎', description: '贞，丈人吉，无咎。', judgment: '师，众也。贞，正也。能以众正，可以王矣。', image: '地中有水，师。君子以容民畜众。' },
  8: { id: 8, name: '水地比', symbol: '䷇', upperTrigram: '坎', lowerTrigram: '坤', description: '吉。原筮，元永贞，无咎。', judgment: '比，吉也。比，辅也，下顺从也。', image: '地上有水，比。先王以建万国亲诸侯。' },
  9: { id: 9, name: '风天小畜', symbol: '䷈', upperTrigram: '巽', lowerTrigram: '乾', description: '亨。密云不雨，自我西郊。', judgment: '小畜，柔得位而上下应之。', image: '风行天上，小畜。君子以懿文德。' },
  10: { id: 10, name: '天泽履', symbol: '䷉', upperTrigram: '乾', lowerTrigram: '兑', description: '履虎尾，不咥人，亨。', judgment: '履，柔履刚也。说而应乎乾。', image: '上天下泽，履。君子以辨上下，定民志。' },
  11: { id: 11, name: '地天泰', symbol: '䷊', upperTrigram: '坤', lowerTrigram: '乾', description: '小往大来，吉亨。', judgment: '天地交而万物通也，上下交而其志同也。', image: '天地交，泰。后以财成天地之道。' },
  12: { id: 12, name: '天地否', symbol: '䷋', upperTrigram: '乾', lowerTrigram: '坤', description: '否之匪人，不利君子贞。', judgment: '天地不交而万物不通也。', image: '天地不交，否。君子以俭德辟难。' },
  13: { id: 13, name: '天火同人', symbol: '䷌', upperTrigram: '乾', lowerTrigram: '离', description: '同人于野，亨。利涉大川。', judgment: '同人，柔得位得中而应乎乾。', image: '天与火，同人。君子以类族辨物。' },
  14: { id: 14, name: '火天大有', symbol: '䷍', upperTrigram: '离', lowerTrigram: '乾', description: '元亨。', judgment: '大有，柔得尊位，大中而上下应之。', image: '火在天上，大有。君子以遏恶扬善。' },
  15: { id: 15, name: '地山谦', symbol: '䷎', upperTrigram: '坤', lowerTrigram: '艮', description: '亨，君子有终。', judgment: '谦亨，天道下济而光明。', image: '地中有山，谦。君子以裒多益寡。' },
  16: { id: 16, name: '雷地豫', symbol: '䷏', upperTrigram: '震', lowerTrigram: '坤', description: '利建侯行师。', judgment: '豫，刚应而志行，顺以动，豫。', image: '雷出地奋，豫。先王以作乐崇德。' },
  17: { id: 17, name: '泽雷随', symbol: '䷐', upperTrigram: '兑', lowerTrigram: '震', description: '元亨利贞，无咎。', judgment: '随，刚来而下柔，动而说，随。', image: '泽中有雷，随。君子以向晦入宴息。' },
  18: { id: 18, name: '山风蛊', symbol: '䷑', upperTrigram: '艮', lowerTrigram: '巽', description: '元亨，利涉大川。', judgment: '蛊，刚上而柔下，巽而止，蛊。', image: '山下有风，蛊。君子以振民育德。' },
  19: { id: 19, name: '地泽临', symbol: '䷒', upperTrigram: '坤', lowerTrigram: '兑', description: '元亨利贞。至于八月有凶。', judgment: '临，刚浸而长，说而顺，刚中而应。', image: '泽上有地，临。君子以教思无穷。' },
  20: { id: 20, name: '风地观', symbol: '䷓', upperTrigram: '巽', lowerTrigram: '坤', description: '盥而不荐，有孚颙若。', judgment: '大观在上，顺而巽，中正以观天下。', image: '风行地上，观。先王以省方观民设教。' },
  21: { id: 21, name: '火雷噬嗑', symbol: '䷔', upperTrigram: '离', lowerTrigram: '震', description: '亨，利用狱。', judgment: '颐中有物，曰噬嗑。', image: '雷电噬嗑，先王以明罚敕法。' },
  22: { id: 22, name: '山火贲', symbol: '䷕', upperTrigram: '艮', lowerTrigram: '离', description: '亨。小利有攸往。', judgment: '贲亨，柔来而文刚，故亨。', image: '山下有火，贲。君子以明庶政。' },
  23: { id: 23, name: '山地剥', symbol: '䷖', upperTrigram: '艮', lowerTrigram: '坤', description: '不利有攸往。', judgment: '剥，剥也。柔变刚也。', image: '山附于地，剥。上以厚下安宅。' },
  24: { id: 24, name: '地雷复', symbol: '䷗', upperTrigram: '坤', lowerTrigram: '震', description: '亨。出入无疾，朋来无咎。', judgment: '复亨，刚反。动而以顺行。', image: '雷在地中，复。先王以至日闭关。' },
  25: { id: 25, name: '天雷无妄', symbol: '䷘', upperTrigram: '乾', lowerTrigram: '震', description: '元亨利贞。其匪正有眚。', judgment: '无妄，刚自外来而为主于内。', image: '天下雷行，物与无妄。先王以茂对时育万物。' },
  26: { id: 26, name: '山天大畜', symbol: '䷙', upperTrigram: '艮', lowerTrigram: '乾', description: '利贞。不家食吉，利涉大川。', judgment: '大畜，刚健笃实辉光，日新其德。', image: '天在山中，大畜。君子以多识前言往行。' },
  27: { id: 27, name: '山雷颐', symbol: '䷚', upperTrigram: '艮', lowerTrigram: '震', description: '贞吉。观颐，自求口实。', judgment: '颐，贞吉，养正则吉也。', image: '山下有雷，颐。君子以慎言语，节饮食。' },
  28: { id: 28, name: '泽风大过', symbol: '䷛', upperTrigram: '兑', lowerTrigram: '巽', description: '栋桡，利有攸往，亨。', judgment: '大过，大者过也。栋桡，本末弱也。', image: '泽灭木，大过。君子以独立不惧。' },
  29: { id: 29, name: '坎为水', symbol: '䷜', upperTrigram: '坎', lowerTrigram: '坎', description: '习坎，有孚，维心亨。', judgment: '习坎，重险也。水流而不盈。', image: '水洊至，习坎。君子以常德行，习教事。' },
  30: { id: 30, name: '离为火', symbol: '䷝', upperTrigram: '离', lowerTrigram: '离', description: '利贞，亨。畜牝牛，吉。', judgment: '离，丽也。日月丽乎天。', image: '明两作，离。大人以继明照于四方。' },
  31: { id: 31, name: '泽山咸', symbol: '䷞', upperTrigram: '兑', lowerTrigram: '艮', description: '亨，利贞。取女吉。', judgment: '咸，感也。柔上而刚下。', image: '山上有泽，咸。君子以虚受人。' },
  32: { id: 32, name: '雷风恒', symbol: '䷟', upperTrigram: '震', lowerTrigram: '巽', description: '亨，无咎，利贞。', judgment: '恒，久也。刚上而柔下。', image: '雷风，恒。君子以立不易方。' },
  33: { id: 33, name: '天山遁', symbol: '䷠', upperTrigram: '乾', lowerTrigram: '艮', description: '亨，小利贞。', judgment: '遁亨，遁而亨也。', image: '天下有山，遁。君子以远小人。' },
  34: { id: 34, name: '雷天大壮', symbol: '䷡', upperTrigram: '震', lowerTrigram: '乾', description: '利贞。', judgment: '大壮，大者壮也。刚以动，故壮。', image: '雷在天上，大壮。君子以非礼弗履。' },
  35: { id: 35, name: '火地晋', symbol: '䷢', upperTrigram: '离', lowerTrigram: '坤', description: '康侯用锡马蕃庶，昼日三接。', judgment: '晋，进也。明出地上。', image: '明出地上，晋。君子以自昭明德。' },
  36: { id: 36, name: '地火明夷', symbol: '䷣', upperTrigram: '坤', lowerTrigram: '离', description: '利艰贞。', judgment: '明入地中，明夷。', image: '明入地中，明夷。君子以莅众，用晦而明。' },
  37: { id: 37, name: '风火家人', symbol: '䷤', upperTrigram: '巽', lowerTrigram: '离', description: '利女贞。', judgment: '家人，女正位乎内，男正位乎外。', image: '风自火出，家人。君子以言有物而行有恒。' },
  38: { id: 38, name: '火泽睽', symbol: '䷥', upperTrigram: '离', lowerTrigram: '兑', description: '小事吉。', judgment: '睽，火动而上，泽动而下。', image: '上火下泽，睽。君子以同而异。' },
  39: { id: 39, name: '水山蹇', symbol: '䷦', upperTrigram: '坎', lowerTrigram: '艮', description: '利西南，不利东北。', judgment: '蹇，难也，险在前也。', image: '山上有水，蹇。君子以反身修德。' },
  40: { id: 40, name: '雷水解', symbol: '䷧', upperTrigram: '震', lowerTrigram: '坎', description: '利西南。无所往，其来复吉。', judgment: '解，险以动，动而免乎险。', image: '雷雨作，解。君子以赦过宥罪。' },
  41: { id: 41, name: '山泽损', symbol: '䷨', upperTrigram: '艮', lowerTrigram: '兑', description: '有孚，元吉，无咎。', judgment: '损，损下益上，其道上行。', image: '山下有泽，损。君子以惩忿窒欲。' },
  42: { id: 42, name: '风雷益', symbol: '䷩', upperTrigram: '巽', lowerTrigram: '震', description: '利有攸往，利涉大川。', judgment: '益，损上益下，民说无疆。', image: '风雷，益。君子以见善则迁，有过则改。' },
  43: { id: 43, name: '泽天夬', symbol: '䷪', upperTrigram: '兑', lowerTrigram: '乾', description: '扬于王庭，孚号有厉。', judgment: '夬，决也，刚决柔也。', image: '泽上于天，夬。君子以施禄及下。' },
  44: { id: 44, name: '天风姤', symbol: '䷫', upperTrigram: '乾', lowerTrigram: '巽', description: '女壮，勿用取女。', judgment: '姤，遇也，柔遇刚也。', image: '天下有风，姤。后以施命诰四方。' },
  45: { id: 45, name: '泽地萃', symbol: '䷬', upperTrigram: '兑', lowerTrigram: '坤', description: '亨。王假有庙。', judgment: '萃，聚也。顺以说，刚中而应。', image: '泽上于地，萃。君子以除戎器，戒不虞。' },
  46: { id: 46, name: '地风升', symbol: '䷭', upperTrigram: '坤', lowerTrigram: '巽', description: '元亨，用见大人。南征吉。', judgment: '柔以时升，巽而顺。', image: '地中生木，升。君子以顺德，积小以高大。' },
  47: { id: 47, name: '泽水困', symbol: '䷮', upperTrigram: '兑', lowerTrigram: '坎', description: '亨，贞，大人吉。有言不信。', judgment: '困，刚揜也。险以说。', image: '泽无水，困。君子以致命遂志。' },
  48: { id: 48, name: '水风井', symbol: '䷯', upperTrigram: '坎', lowerTrigram: '巽', description: '改邑不改井，无丧无得。', judgment: '巽乎水而上水，井。', image: '木上有水，井。君子以劳民劝相。' },
  49: { id: 49, name: '泽火革', symbol: '䷰', upperTrigram: '兑', lowerTrigram: '离', description: '己日乃孚。元亨利贞。', judgment: '革，水火相息。', image: '泽中有火，革。君子以治历明时。' },
  50: { id: 50, name: '火风鼎', symbol: '䷱', upperTrigram: '离', lowerTrigram: '巽', description: '元吉，亨。', judgment: '鼎，象也。以木巽火，亨饪也。', image: '木上有火，鼎。君子以正位凝命。' },
  51: { id: 51, name: '震为雷', symbol: '䷲', upperTrigram: '震', lowerTrigram: '震', description: '亨。震来虩虩，笑言哑哑。', judgment: '震，亨。震来虩虩，恐致福也。', image: '洊雷，震。君子以恐惧修省。' },
  52: { id: 52, name: '艮为山', symbol: '䷳', upperTrigram: '艮', lowerTrigram: '艮', description: '艮其背，不获其身。无咎。', judgment: '艮，止也。时止则止，时行则行。', image: '兼山，艮。君子以思不出其位。' },
  53: { id: 53, name: '风山渐', symbol: '䷴', upperTrigram: '巽', lowerTrigram: '艮', description: '女归吉，利贞。', judgment: '渐之进也，女归吉也。', image: '山上有木，渐。君子以居贤德善俗。' },
  54: { id: 54, name: '雷泽归妹', symbol: '䷵', upperTrigram: '震', lowerTrigram: '兑', description: '征凶，无攸利。', judgment: '归妹，天地之大义也。', image: '泽上有雷，归妹。君子以永终知敝。' },
  55: { id: 55, name: '雷火丰', symbol: '䷶', upperTrigram: '震', lowerTrigram: '离', description: '亨，王假之。勿忧，宜日中。', judgment: '丰，大也。明以动，故丰。', image: '雷电皆至，丰。君子以折狱致刑。' },
  56: { id: 56, name: '火山旅', symbol: '䷷', upperTrigram: '离', lowerTrigram: '艮', description: '小亨，旅贞吉。', judgment: '旅，小亨。柔得中乎外而顺乎刚。', image: '山上有火，旅。君子以明慎用刑。' },
  57: { id: 57, name: '巽为风', symbol: '䷸', upperTrigram: '巽', lowerTrigram: '巽', description: '小亨，利有攸往，利见大人。', judgment: '重巽以申命。', image: '随风，巽。君子以申命行事。' },
  58: { id: 58, name: '兑为泽', symbol: '䷹', upperTrigram: '兑', lowerTrigram: '兑', description: '亨，利贞。', judgment: '兑，说也。刚中而柔外。', image: '丽泽，兑。君子以朋友讲习。' },
  59: { id: 59, name: '风水涣', symbol: '䷺', upperTrigram: '巽', lowerTrigram: '坎', description: '亨。王假有庙。利涉大川。', judgment: '涣，亨。刚来而不穷。', image: '风行水上，涣。先王以享于帝立庙。' },
  60: { id: 60, name: '水泽节', symbol: '䷻', upperTrigram: '坎', lowerTrigram: '兑', description: '亨。苦节不可贞。', judgment: '节，亨。刚柔分而刚得中。', image: '泽上有水，节。君子以制数度，议德行。' },
  61: { id: 61, name: '风泽中孚', symbol: '䷼', upperTrigram: '巽', lowerTrigram: '兑', description: '豚鱼吉。利涉大川，利贞。', judgment: '中孚，柔在内而刚得中。', image: '泽上有风，中孚。君子以议狱缓死。' },
  62: { id: 62, name: '雷山小过', symbol: '䷽', upperTrigram: '震', lowerTrigram: '艮', description: '亨，利贞。可小事不可大事。', judgment: '小过，小者过而亨也。', image: '山上有雷，小过。君子以行过乎恭。' },
  63: { id: 63, name: '水火既济', symbol: '䷾', upperTrigram: '坎', lowerTrigram: '离', description: '亨小，利贞。初吉终乱。', judgment: '既济，亨。小者亨也。', image: '水在火上，既济。君子以思患而豫防之。' },
  64: { id: 64, name: '火水未济', symbol: '䷿', upperTrigram: '离', lowerTrigram: '坎', description: '亨。小狐汔济，濡其尾。', judgment: '未济，亨。柔得中也。', image: '火在水上，未济。君子以慎辨物居方。' },
}

// ========== 导出类型 ==========
export interface NaJiaLineInfo {
  position: number     // 爻位 1-6 (1 是初爻)
  naJia: string        // 天干
  naZhi: string        // 地支
  liuQin: string       // 六亲
  liuShou: string      // 六兽
  shiYing: string      // '世' | '应' | ''
  yinYang: string      // 阴阳
  changing: boolean    // 是否为动爻
  value: number        // 原始数值 6/7/8/9
}

export interface NaJiaResult {
  hexagramId: number
  hexagramName: string
  hexagramSymbol: string
  palace: string        // 所属宫
  palaceElement: string // 宫五行
  shiYao: number        // 世爻位置
  yingYao: number       // 应爻位置
  dayGan: string        // 当日天干
  lines: NaJiaLineInfo[]
  changingLines: number[]
  isChangedHexagram: boolean
}

// ========== 核心：三钱起卦 ==========
export function castDivination(): CastResult {
  const lines: number[] = []
  for (let i = 0; i < 6; i++) {
    const c1 = Math.random() < 0.5 ? 3 : 2
    const c2 = Math.random() < 0.5 ? 3 : 2
    const c3 = Math.random() < 0.5 ? 3 : 2
    lines.push(c1 + c2 + c3)
  }

  const originalLines = lines.map(l => l === 6 || l === 8 ? 0 : 1)
  const changedLines = lines.map(l => l === 6 ? 1 : l === 9 ? 0 : (l === 7 ? 1 : 0))

  const originalHexagram = linesToHexagramId(originalLines)
  const changedHexagram = linesToHexagramId(changedLines)

  const changingLines = lines
    .map((l, i) => (l === 6 || l === 9) ? i + 1 : -1)
    .filter(i => i > 0)

  return {
    lines,
    originalHexagram,
    changedHexagram: changingLines.length > 0 ? changedHexagram : null,
    changingLines,
  }
}

// 六条阴阳线 -> 卦序号
function linesToHexagramId(lines: number[]): number {
  const triToName = (tri: number[]) => {
    const key = tri.join('')
    const map: Record<string, string> = {
      '111': '乾', '000': '坤', '100': '震', '010': '坎',
      '001': '艮', '110': '巽', '101': '离', '011': '兑',
    }
    return map[key] || '乾'
  }
  const upper = triToName(lines.slice(0, 3))
  const lower = triToName(lines.slice(3, 6))
  for (let id = 1; id <= 64; id++) {
    const h = HEXAGRAMS[id]
    if (h && h.upperTrigram === upper && h.lowerTrigram === lower) return id
  }
  return 1
}

// ========== 核心：纳甲排盘 ==========
export function buildNaJiaPan(result: CastResult, hexagramId: number, isChanged: boolean = false): NaJiaResult {
  const hex = HEXAGRAMS[hexagramId]
  if (!hex) throw new Error(`卦 ${hexagramId} 不存在`)

  const { palace, shiYao, yingYao } = getHexagramPalace(hexagramId)
  const palaceElement = BA_GUA[Object.entries(BA_GUA).find(([_, v]) => v.name === palace)?.[0] || '111'].element
  const dayGan = getTodayDayGan()
  const liuShouArr = getLiuShou(dayGan)
  const naJiaArr = NA_JIA[hexagramId] || ['甲', '甲', '甲', '壬', '壬', '壬']
  const naZhiArr = computeNaZhi(hexagramId)

  const lines: NaJiaLineInfo[] = []
  // 爻序从初爻(1)到上爻(6)，数据数组索引 0-5 对应初到上
  for (let i = 0; i < 6; i++) {
    const pos = i + 1
    const value = result.lines[i]
    const yinYang = (value === 6 || value === 8) ? '阴' : '阳'
    const changing = (value === 6 || value === 9)
    const naZhi = naZhiArr[i] || '子'
    const liuQin = getLiuQin(palace, naZhi)
    const liuShou = liuShouArr[i]
    const shiYingStr = pos === shiYao ? '世' : pos === yingYao ? '应' : ''

    lines.push({
      position: pos,
      naJia: naJiaArr[i],
      naZhi,
      liuQin,
      liuShou,
      shiYing: shiYingStr,
      yinYang,
      changing,
      value,
    })
  }

  return {
    hexagramId,
    hexagramName: hex.name,
    hexagramSymbol: hex.symbol,
    palace,
    palaceElement,
    shiYao,
    yingYao,
    dayGan,
    lines,
    changingLines: result.changingLines,
    isChangedHexagram: isChanged,
  }
}

// ========== 获取卦基础数据 ==========
export function getHexagram(id: number): HexagramData {
  const base = HEXAGRAMS[id] || HEXAGRAMS[1]
  return {
    ...base,
    lines: [],
  }
}

// ========== 完整的起卦+排盘 ==========
export interface FullDivinationResult {
  castResult: CastResult
  originalPan: NaJiaResult
  changedPan: NaJiaResult | null
  interpretation: string
}

export function performFullDivination(question: string): FullDivinationResult {
  const castResult = castDivination()
  const originalPan = buildNaJiaPan(castResult, castResult.originalHexagram)
  const changedPan = castResult.changedHexagram
    ? buildNaJiaPan(castResult, castResult.changedHexagram, true)
    : null
  const interpretation = ''

  return { castResult, originalPan, changedPan, interpretation }
}

// ========== 解卦 ==========
export function generateInterpretation(
  original: NaJiaResult,
  changed: NaJiaResult | null,
  question: string
): string {
  let text = ''

  text += `【本卦】${original.hexagramSymbol} ${original.hexagramName}\n`
  text += `所属：${original.palace}宫（${original.palaceElement}）\n`
  text += `世爻：第${original.shiYao}爻  应爻：第${original.yingYao}爻\n`
  text += `日干：${original.dayGan}\n\n`

  text += `【纳甲排盘】\n`
  text += `┌────┬────┬────┬────┬────┬────┐\n`
  text += `│ 爻位 │天干│地支│六亲│六兽│世应│\n`
  text += `├────┼────┼────┼────┼────┼────┤\n`
  // 从上爻到初爻显示
  for (let i = 5; i >= 0; i--) {
    const l = original.lines[i]
    text += `│ 第${l.position}爻 │ ${l.naJia}  │ ${l.naZhi}  │${pad(l.liuQin, 4)}│${pad(l.liuShou, 4)}│${pad(l.shiYing || '-', 4)}│${l.changing ? ' ←动' : ''}\n`
  }
  text += `└────┴────┴────┴────┴────┴────┘\n\n`

  if (changed) {
    text += `【变卦】${changed.hexagramSymbol} ${changed.hexagramName}\n`
    text += `所属：${changed.palace}宫（${changed.palaceElement}）\n`
    text += `世爻：第${changed.shiYao}爻  应爻：第${changed.yingYao}爻\n\n`

    text += `【变卦纳甲排盘】\n`
    text += `┌────┬────┬────┬────┬────┬────┐\n`
    text += `│ 爻位 │天干│地支│六亲│六兽│世应│\n`
    text += `├────┼────┼────┼────┼────┼────┤\n`
    for (let i = 5; i >= 0; i--) {
      const l = changed.lines[i]
      text += `│ 第${l.position}爻 │ ${l.naJia}  │ ${l.naZhi}  │${pad(l.liuQin, 4)}│${pad(l.liuShou, 4)}│${pad(l.shiYing || '-', 4)}│\n`
    }
    text += `└────┴────┴────┴────┴────┴────┘\n\n`
  }

  const changingLines = original.changingLines
  text += `【动爻分析】\n`
  if (changingLines.length === 0) {
    text += `六爻安静，以本卦卦辞和世爻为主。\n`
    const shiLine = original.lines.find(l => l.position === original.shiYao)
    if (shiLine) {
      text += `世爻六亲为${shiLine.liuQin}，临${shiLine.liuShou}，`
      if (shiLine.liuQin === '妻财') text += '财运有利。'
      else if (shiLine.liuQin === '官鬼') text += '事业/官运相关。'
      else if (shiLine.liuQin === '父母') text += '文书/长辈方面。'
      else if (shiLine.liuQin === '子孙') text += '晚辈/娱乐/投资方面。'
      else if (shiLine.liuQin === '兄弟') text += '朋友/合伙方面。'
      text += '\n'
    }
  } else {
    text += `动爻：第${changingLines.join('、')}爻\n`
    for (const pos of changingLines) {
      const l = original.lines.find(ln => ln.position === pos)
      if (l) {
        text += `第${pos}爻${l.naJia}${l.naZhi} ${l.liuQin} ${l.liuShou} 发动`
        if (l.value === 6) text += '（老阴化阳）\n'
        else text += '（老阳化阴）\n'
      }
    }
  }

  text += `\n【占问】${question || '未提问'}\n`
  text += `【综合解卦】\n`

  if (changed && changingLines.length === 1) {
    text += `一爻独发，以动爻为主断。`
  } else if (changed && changingLines.length >= 2) {
    text += `多爻发动，以变卦为主，参看本卦。`
  } else {
    text += `静卦以本卦世爻为主。`
  }

  const hex = HEXAGRAMS[original.hexagramId]
  if (hex) {
    text += `\n\n本卦卦辞：${hex.judgment}`
    text += `\n象曰：${hex.image}`
  }

  return text
}

function pad(s: string, len: number): string {
  const l = s.length
  const padding = len - l
  if (padding <= 0) return s
  const left = Math.floor(padding / 2)
  const right = padding - left
  return ' '.repeat(left) + s + ' '.repeat(right)
}

// ========== 辅助 ==========
export function getLineDisplay(value: number): { type: string; label: string; changing: boolean } {
  switch (value) {
    case 6: return { type: '老阴', label: '⚋ → ⚊', changing: true }
    case 7: return { type: '少阳', label: '⚊', changing: false }
    case 8: return { type: '少阴', label: '⚋', changing: false }
    case 9: return { type: '老阳', label: '⚊ → ⚋', changing: true }
    default: return { type: '未知', label: '?', changing: false }
  }
}

// 用神快速参考
export const YONG_SHEN_MAP: Record<string, string> = {
  '财运': '妻财', '事业': '官鬼', '婚姻': '妻财/官鬼', '考试': '父母',
  '健康': '子孙', '出行': '子孙', '官司': '官鬼', '投资': '妻财',
  '子女': '子孙', '父母': '父母', '合伙': '兄弟', '晋升': '官鬼',
  '学业': '父母', '疾病': '官鬼', '失物': '妻财', '求职': '官鬼',
}