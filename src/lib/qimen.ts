/**
 * 奇门遁甲 · 时家转盘排盘引擎
 * Qimen Dunjia — Time-Based Revolving Disk Chart Engine
 *
 * 实现拆补法排盘：
 *   1. 阴阳遁判断（冬至后阳遁，夏至后阴遁）
 *   2. 局数确定（节气 + 三元）
 *   3. 排地盘（六仪三奇在九宫分布）
 *   4. 排天盘九星（值符星落时干宫）
 *   5. 排八门（值使门落时支宫）
 *   6. 排八神（值符神与时干同宫）
 *   7. 排天盘天干
 *   8. 计算空亡和马星
 */

// ============================================================
// 基础常量
// ============================================================

/** 十天干 */
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

/** 十二地支 */
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/** 六十甲子 */
const SEXAGENARY: string[] = []
for (let i = 0; i < 60; i++) {
  SEXAGENARY.push(STEMS[i % 10] + BRANCHES[i % 12])
}

/** 六仪三奇（地盘排列顺序） */
const YI_QI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙']

/** 九宫 → 原始九星 */
const PALACE_STAR: Record<number, string> = {
  1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅',
  5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英',
}

/** 九宫 → 原始八门（中5寄坤2） */
const PALACE_DOOR: Record<number, string> = {
  1: '休门', 2: '死门', 3: '伤门', 4: '杜门',
  5: '死门', 6: '开门', 7: '惊门', 8: '生门', 9: '景门',
}

/** 九宫名称 */
const PALACE_NAMES: Record<number, string> = {
  1: '坎一宫', 2: '坤二宫', 3: '震三宫', 4: '巽四宫',
  5: '中五宫', 6: '乾六宫', 7: '兑七宫', 8: '艮八宫', 9: '离九宫',
}

/** 阳遁八神（顺排） */
const GODS_YANG = ['值符', '螣蛇', '太阴', '六合', '勾陈', '朱雀', '九地', '九天']

/** 阴遁八神（逆排） */
const GODS_YIN = ['值符', '九天', '九地', '朱雀', '勾陈', '六合', '太阴', '螣蛇']

/** 洛书九宫顺排路径（阳遁） */
const SHUN_PATH = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/** 洛书九宫逆排路径（阴遁） */
const NI_PATH = [1, 9, 8, 7, 6, 5, 4, 3, 2]

// ============================================================
// 节气数据
// ============================================================

interface SolarTermInfo {
  name: string
  /** 阳遁 true / 阴遁 false */
  yangDun: boolean
  /** 上元 / 中元 / 下元 对应的局数 */
  juShang: number
  juZhong: number
  juXia: number
  /** 近似开始日期 (MM-DD) */
  start: string
}

/** 24 节气奇门用局表（拆补法） */
const SOLAR_TERMS: SolarTermInfo[] = [
  { name: '冬至', yangDun: true,  juShang: 1, juZhong: 7, juXia: 4, start: '12-22' },
  { name: '小寒', yangDun: true,  juShang: 2, juZhong: 8, juXia: 5, start: '01-05' },
  { name: '大寒', yangDun: true,  juShang: 3, juZhong: 9, juXia: 6, start: '01-20' },
  { name: '立春', yangDun: true,  juShang: 8, juZhong: 5, juXia: 2, start: '02-04' },
  { name: '雨水', yangDun: true,  juShang: 9, juZhong: 6, juXia: 3, start: '02-19' },
  { name: '惊蛰', yangDun: true,  juShang: 1, juZhong: 7, juXia: 4, start: '03-06' },
  { name: '春分', yangDun: true,  juShang: 3, juZhong: 9, juXia: 6, start: '03-21' },
  { name: '清明', yangDun: true,  juShang: 4, juZhong: 1, juXia: 7, start: '04-05' },
  { name: '谷雨', yangDun: true,  juShang: 5, juZhong: 2, juXia: 8, start: '04-20' },
  { name: '立夏', yangDun: true,  juShang: 4, juZhong: 1, juXia: 7, start: '05-06' },
  { name: '小满', yangDun: true,  juShang: 5, juZhong: 2, juXia: 8, start: '05-21' },
  { name: '芒种', yangDun: true,  juShang: 6, juZhong: 3, juXia: 9, start: '06-06' },
  { name: '夏至', yangDun: false, juShang: 9, juZhong: 3, juXia: 6, start: '06-21' },
  { name: '小暑', yangDun: false, juShang: 8, juZhong: 2, juXia: 5, start: '07-07' },
  { name: '大暑', yangDun: false, juShang: 7, juZhong: 1, juXia: 4, start: '07-23' },
  { name: '立秋', yangDun: false, juShang: 2, juZhong: 5, juXia: 8, start: '08-08' },
  { name: '处暑', yangDun: false, juShang: 1, juZhong: 4, juXia: 7, start: '08-23' },
  { name: '白露', yangDun: false, juShang: 9, juZhong: 3, juXia: 6, start: '09-08' },
  { name: '秋分', yangDun: false, juShang: 7, juZhong: 1, juXia: 4, start: '09-23' },
  { name: '寒露', yangDun: false, juShang: 6, juZhong: 9, juXia: 3, start: '10-08' },
  { name: '霜降', yangDun: false, juShang: 5, juZhong: 8, juXia: 2, start: '10-24' },
  { name: '立冬', yangDun: false, juShang: 6, juZhong: 9, juXia: 3, start: '11-08' },
  { name: '小雪', yangDun: false, juShang: 5, juZhong: 8, juXia: 2, start: '11-22' },
  { name: '大雪', yangDun: false, juShang: 4, juZhong: 7, juXia: 1, start: '12-07' },
]

// ============================================================
// 干支计算工具
// ============================================================

/** 计算日干支索引（0-based, 0=甲子） */
function getDayStemBranchIndex(date: Date): number {
  // 以 1900-01-01 为甲戌日（索引 10）作为基准
  const base = new Date(1900, 0, 1)
  const diffDays = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24))
  let idx = (diffDays + 10) % 60
  if (idx < 0) idx += 60
  return idx
}

/** 根据日干和时辰获取时干支索引 */
function getHourStemBranchIndex(dayStemIdx: number, hour: number): number {
  // 时支：子时 23-1, 丑时 1-3, ...
  const branchIdx = Math.floor(((hour + 1) % 24) / 2)
  // 日干决定子时起始天干：甲己→甲子(0), 乙庚→丙子(12), 丙辛→戊子(24), 丁壬→庚子(36), 戊癸→壬子(48)
  const ziShiIdx = ((dayStemIdx % 5) * 12) % 60
  return (ziShiIdx + branchIdx) % 60
}

function getDayGanZhi(date: Date): string {
  return SEXAGENARY[getDayStemBranchIndex(date)]
}

function getHourGanZhi(date: Date): string {
  const dayIdx = getDayStemBranchIndex(date)
  const dayStemIdx = dayIdx % 10
  return SEXAGENARY[getHourStemBranchIndex(dayStemIdx, date.getHours())]
}

/** 拆分干支字符串 */
function splitGZ(gz: string): { stem: string; branch: string } {
  return { stem: gz[0], branch: gz[1] }
}

// ============================================================
// 节气与局数
// ============================================================

/** 根据日期确定节气 */
function getSolarTerm(date: Date): SolarTermInfo {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    if (mmdd >= SOLAR_TERMS[i].start) return SOLAR_TERMS[i]
  }
  // 12-22 之前（12-07 ~ 12-21）属于大雪
  return SOLAR_TERMS[SOLAR_TERMS.length - 1]
}

/** 确定三元（上元/中元/下元） */
function getYuan(date: Date, term: SolarTermInfo): string {
  // 计算从节气开始日起的天数偏移
  const [m, d] = term.start.split('-').map(Number)
  const termDate = new Date(date.getFullYear(), m - 1, d)
  if (date < termDate) {
    // 跨年情况：用上一年的节气日
    termDate.setFullYear(termDate.getFullYear() - 1)
  }
  let diffDays = Math.floor((date.getTime() - termDate.getTime()) / (1000 * 60 * 60 * 24))

  // 节气周期约 15 天，分三元，每元 5 天
  // 但拆补法下，元的分界由甲子/甲午/己卯/己酉日决定
  // 简化处理：直接用甲子日作为上元开始的标志
  const dayIndex = getDayStemBranchIndex(date)

  // 甲子(0)、甲午(30)、己卯(15)、己酉(45) 是换元标志
  // 找到最近的换元日
  const huanYuanOffsets = [0, 15, 30, 45] // 甲子/己卯/甲午/己酉
  let nearest = 0
  let minDist = 60
  for (const offset of huanYuanOffsets) {
    let dist = (dayIndex - offset + 60) % 60
    if (dist > 30) dist = 60 - dist
    if (dist < minDist) {
      minDist = dist
      nearest = offset
    }
  }

  // 根据最近的换元日与节气开始的关系判断元
  // 简化：直接用 day offset from term start
  // 每个元的跨度约 5 天
  if (diffDays < 0) diffDays = 0
  const yuanIndex = Math.floor(diffDays / 5) % 3
  return ['上元', '中元', '下元'][yuanIndex]
}

/** 获取局数 */
function getJuNumber(term: SolarTermInfo, yuan: string): number {
  if (yuan === '上元') return term.juShang
  if (yuan === '中元') return term.juZhong
  return term.juXia
}

// ============================================================
// 排盘核心
// ============================================================

export interface QimenPalace {
  gong: number
  gongName: string
  diPan: string
  tianPan: string
  star: string
  door: string
  god: string
  isEmpty: boolean
  isHorse: boolean
}

export interface QimenChart {
  dunType: string
  juNumber: number
  palaces: QimenPalace[]
  timeInfo: {
    solarTerm: string
    yuan: string
    dayStem: string
    hourStem: string
    hourBranch: string
  }
}

export function generateQimenChart(date?: Date): QimenChart {
  const now = date || new Date()
  const term = getSolarTerm(now)
  const yuan = getYuan(now, term)
  const ju = getJuNumber(term, yuan)
  const dunType = term.yangDun ? '阳遁' : '阴遁'
  const path = term.yangDun ? SHUN_PATH : NI_PATH

  const dayGZ = getDayGanZhi(now)
  const hourGZ = getHourGanZhi(now)
  const { stem: dayStem, branch: dayBranch } = splitGZ(dayGZ)
  const { stem: hourStem, branch: hourBranch } = splitGZ(hourGZ)

  // ── 排地盘 ──
  // 戊落 ju 宫，其余按阴阳遁顺/逆排
  const diPan: Record<number, string> = {}
  {
    // 找到 戊 在 path 中的起始位置
    let startIdx = path.indexOf(ju)
    if (startIdx === -1) startIdx = 0
    for (let i = 0; i < 9; i++) {
      const gong = path[(startIdx + i) % 9]
      diPan[gong] = YI_QI[i]
    }
  }

  // ── 确定值符星 ──
  // 时干所在宫位对应的原始星
  let valueStarGong = 1
  for (let g = 1; g <= 9; g++) {
    if (diPan[g] === hourStem) {
      valueStarGong = g
      break
    }
  }
  const valueStar = PALACE_STAR[valueStarGong]

  // ── 排天盘九星 ──
  // 值符星落时干宫，其余按阴阳遁顺/逆排
  const starOnGong: Record<number, string> = {}
  {
    // 九星按宫序排列: 1蓬→2芮→3冲→4辅→5禽→6心→7柱→8任→9英
    const starOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const valueStarNum = valueStarGong // 值符星的宫号
    // 找到值符星在顺序中的 index
    let starStartIdx = starOrder.indexOf(valueStarNum)

    for (let i = 0; i < 9; i++) {
      const starNum = starOrder[(starStartIdx + i) % 9]
      const targetGong = path[(path.indexOf(hourStemGong(diPan, hourStem)) + i) % 9]
      starOnGong[targetGong] = PALACE_STAR[starNum]
    }
  }

  // 辅助：时干所在的宫
  function hourStemGong(dp: Record<number, string>, hs: string): number {
    for (let g = 1; g <= 9; g++) {
      if (dp[g] === hs) return g
    }
    return 1
  }

  const hsGong = hourStemGong(diPan, hourStem)

  // ── 重算天盘九星（修正）──
  // 值符星先确定，然后从值符星的宫位开始按阴阳遁顺逆排
  {
    const starSeq = term.yangDun
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]  // 阳遁顺: 1→2→3→4→5→6→7→8→9
      : [1, 9, 8, 7, 6, 5, 4, 3, 2]  // 阴遁逆: 1→9→8→7→6→5→4→3→2

    // 值符星落时干宫
    // 从值符星的原始宫号开始，按 starSeq 顺序映射
    const valueStarOrigGong = valueStarGong
    // 找到 valueStarOrigGong 在 starSeq 中的位置
    let seqIdx = starSeq.indexOf(valueStarOrigGong)
    if (seqIdx === -1) seqIdx = 0

    // 以 hsGong 为值符星的落地宫，其余顺排
    const starLandOrder = term.yangDun ? SHUN_PATH : NI_PATH
    let landStartIdx = starLandOrder.indexOf(hsGong)
    if (landStartIdx === -1) landStartIdx = 0

    for (let i = 0; i < 9; i++) {
      const starOrigGong = starSeq[(seqIdx + i) % 9]
      const landGong = starLandOrder[(landStartIdx + i) % 9]
      starOnGong[landGong] = PALACE_STAR[starOrigGong]
    }
  }

  // ── 排八门 ──
  // 值使门：值符星宫对应的原始门
  const valueDoor = PALACE_DOOR[valueStarGong]
  const doorOnGong: Record<number, string> = {}
  {
    // 八门顺序（按宫序）: 1休→2死→3伤→4杜→5死(寄)→6开→7惊→8生→9景
    const doorSeq = term.yangDun
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
      : [1, 9, 8, 7, 6, 5, 4, 3, 2]

    // 值使门落时支宫
    const hourBranchIdx = BRANCHES.indexOf(hourBranch)
    // 时支对应的宫：子=1坎, 丑寅=8艮, 卯=3震, 辰巳=4巽, 午=9离, 未申=2坤, 酉=7兑, 戌亥=6乾
    const branchGongMap: Record<string, number> = {
      '子': 1, '丑': 8, '寅': 8, '卯': 3, '辰': 4, '巳': 4,
      '午': 9, '未': 2, '申': 2, '酉': 7, '戌': 6, '亥': 6,
    }
    const hourBranchGong = branchGongMap[hourBranch]

    // 值使门的原始宫号
    const valueDoorOrigGong = valueStarGong
    let doorSeqIdx = doorSeq.indexOf(valueDoorOrigGong)
    if (doorSeqIdx === -1) doorSeqIdx = 0

    const landOrder = term.yangDun ? SHUN_PATH : NI_PATH
    let doorLandStart = landOrder.indexOf(hourBranchGong)
    if (doorLandStart === -1) doorLandStart = 0

    for (let i = 0; i < 9; i++) {
      const doorOrigGong = doorSeq[(doorSeqIdx + i) % 9]
      const landGong = landOrder[(doorLandStart + i) % 9]
      doorOnGong[landGong] = PALACE_DOOR[doorOrigGong]
    }
  }

  // ── 排八神 ──
  const godOnGong: Record<number, string> = {}
  {
    const gods = term.yangDun ? GODS_YANG : GODS_YIN
    const landOrder = term.yangDun ? SHUN_PATH : NI_PATH
    const landStart = landOrder.indexOf(hsGong)
    // 值符落时干宫
    godOnGong[hsGong] = gods[0]
    let godIdx = 1
    // 从时干宫后一宫开始顺/逆排其余7神，跳过已有时干宫，中5宫不跳过（若时干不在中5且中5已被占用仅跳过）
    for (let i = 1; godIdx < 8; i++) {
      const landGong = landOrder[(landStart + i) % 9]
      if (landGong === hsGong) continue
      godOnGong[landGong] = gods[godIdx++]
    }
  }

  // ── 排天盘天干 ──
  // 旬首的六仪落在时干宫
  const tianPan: Record<number, string> = {}
  {
    // 确定时柱所在旬首
    const hourGZIdx = SEXAGENARY.indexOf(hourGZ)
    const xunStartIdx = Math.floor(hourGZIdx / 10) * 10
    const xunStartGZ = SEXAGENARY[xunStartIdx]
    const xunStartStem = xunStartGZ[0] // 甲x → 对应六仪 x

    // 六仪映射：甲子→戊, 甲戌→己, 甲申→庚, 甲午→辛, 甲辰→壬, 甲寅→癸
    const jiaToYi: Record<string, string> = {
      '子': '戊', '戌': '己', '申': '庚', '午': '辛', '辰': '壬', '寅': '癸',
    }
    const xunYi = jiaToYi[xunStartGZ[1]]

    // 在地盘上找到 xunYi 所在宫
    let xunYiGong = 1
    for (let g = 1; g <= 9; g++) {
      if (diPan[g] === xunYi) {
        xunYiGong = g
        break
      }
    }

    // 天盘天干：旬首六仪落时干宫，其余按阴阳遁顺逆排
    const landOrder = term.yangDun ? SHUN_PATH : NI_PATH
    let landStart = landOrder.indexOf(hsGong)
    if (landStart === -1) landStart = 0

    // 从地盘 xunYi 宫开始，在天盘按顺序排
    let yiStartIdx = -1
    for (let i = 0; i < 9; i++) {
      if (YI_QI[i] === xunYi) { yiStartIdx = i; break }
    }
    if (yiStartIdx === -1) yiStartIdx = 0

    const yiOrder = term.yangDun
      ? [...YI_QI.slice(yiStartIdx), ...YI_QI.slice(0, yiStartIdx)]
      : [...YI_QI.slice(0, yiStartIdx + 1).reverse(), ...YI_QI.slice(yiStartIdx + 1).reverse()]

    for (let i = 0; i < 9; i++) {
      const landGong = landOrder[(landStart + i) % 9]
      tianPan[landGong] = yiOrder[i]
    }
  }

  // ── 空亡 ──
  // 根据旬首确定空亡地支
  const xunKongMap: Record<string, string[]> = {
    '子': ['戌', '亥'], '戌': ['申', '酉'], '申': ['午', '未'],
    '午': ['辰', '巳'], '辰': ['寅', '卯'], '寅': ['子', '丑'],
  }
  const hourGZIdx = SEXAGENARY.indexOf(hourGZ)
  const xunStartIdx2 = Math.floor(hourGZIdx / 10) * 10
  const xunStartBranch = SEXAGENARY[xunStartIdx2][1]
  const kongBranches = xunKongMap[xunStartBranch] || []

  // 空亡地支对应的宫
  function branchToGong(br: string): number {
    const map: Record<string, number> = {
      '子': 1, '丑': 8, '寅': 8, '卯': 3, '辰': 4, '巳': 4,
      '午': 9, '未': 2, '申': 2, '酉': 7, '戌': 6, '亥': 6,
    }
    return map[br] || 0
  }

  const kongGongs = new Set(kongBranches.map(branchToGong).filter(g => g > 0))

  // ── 马星 ──
  const horseMap: Record<string, string> = {
    '寅': '申', '午': '申', '戌': '申',
    '申': '寅', '子': '寅', '辰': '寅',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳',
  }
  const horseBranch = horseMap[dayBranch] || ''
  const horseGong = branchToGong(horseBranch)

  // ── 组装结果 ──
  const palaces: QimenPalace[] = []
  for (let g = 1; g <= 9; g++) {
    palaces.push({
      gong: g,
      gongName: PALACE_NAMES[g],
      diPan: diPan[g] || '',
      tianPan: tianPan[g] || diPan[g] || '',
      star: starOnGong[g] || '',
      door: doorOnGong[g] || '',
      god: godOnGong[g] || '',
      isEmpty: kongGongs.has(g),
      isHorse: g === horseGong,
    })
  }

  return {
    dunType,
    juNumber: ju,
    palaces,
    timeInfo: {
      solarTerm: term.name,
      yuan,
      dayStem: dayGZ,
      hourStem: hourGZ,
      hourBranch,
    },
  }
}
