import { HexagramData, CastResult } from '@/types'

// 八卦基础
const TRIGRAMS: Record<string, { name: string; element: string }> = {
  '111': { name: '乾', element: '金' },
  '000': { name: '坤', element: '土' },
  '100': { name: '震', element: '木' },
  '010': { name: '坎', element: '水' },
  '001': { name: '艮', element: '土' },
  '110': { name: '巽', element: '木' },
  '101': { name: '离', element: '火' },
  '011': { name: '兑', element: '金' },
}

// 64卦完整数据
const HEXAGRAMS: Record<number, Omit<HexagramData, 'lines'>> = {
  1: { id: 1, name: '乾为天', symbol: '䷀', upperTrigram: '乾', lowerTrigram: '乾', description: '元亨利贞。', judgment: '大哉乾元，万物资始，乃统天。云行雨施，品物流形。', image: '天行健，君子以自强不息。' },
  2: { id: 2, name: '坤为地', symbol: '䷁', upperTrigram: '坤', lowerTrigram: '坤', description: '元亨，利牝马之贞。', judgment: '至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。', image: '地势坤，君子以厚德载物。' },
  3: { id: 3, name: '水雷屯', symbol: '䷂', upperTrigram: '坎', lowerTrigram: '震', description: '元亨利贞。勿用有攸往，利建侯。', judgment: '屯，刚柔始交而难生。动乎险中，大亨贞。', image: '云雷屯，君子以经纶。' },
  4: { id: 4, name: '山水蒙', symbol: '䷃', upperTrigram: '艮', lowerTrigram: '坎', description: '亨。匪我求童蒙，童蒙求我。', judgment: '蒙，山下有险，险而止，蒙。', image: '山下出泉，蒙。君子以果行育德。' },
  5: { id: 5, name: '水天需', symbol: '䷄', upperTrigram: '坎', lowerTrigram: '乾', description: '有孚，光亨，贞吉。利涉大川。', judgment: '需，须也。险在前也，刚健而不陷。', image: '云上于天，需。君子以饮食宴乐。' },
  6: { id: 6, name: '天水讼', symbol: '䷅', upperTrigram: '乾', lowerTrigram: '坎', description: '有孚窒惕，中吉，终凶。利见大人，不利涉大川。', judgment: '讼，上刚下险，险而健，讼。', image: '天与水违行，讼。君子以作事谋始。' },
  7: { id: 7, name: '地水师', symbol: '䷆', upperTrigram: '坤', lowerTrigram: '坎', description: '贞，丈人吉，无咎。', judgment: '师，众也。贞，正也。能以众正，可以王矣。', image: '地中有水，师。君子以容民畜众。' },
  8: { id: 8, name: '水地比', symbol: '䷇', upperTrigram: '坎', lowerTrigram: '坤', description: '吉。原筮，元永贞，无咎。不宁方来，后夫凶。', judgment: '比，吉也。比，辅也，下顺从也。', image: '地上有水，比。先王以建万国，亲诸侯。' },
  9: { id: 9, name: '风天小畜', symbol: '䷈', upperTrigram: '巽', lowerTrigram: '乾', description: '亨。密云不雨，自我西郊。', judgment: '小畜，柔得位而上下应之，曰小畜。', image: '风行天上，小畜。君子以懿文德。' },
  10: { id: 10, name: '天泽履', symbol: '䷉', upperTrigram: '乾', lowerTrigram: '兑', description: '履虎尾，不咥人，亨。', judgment: '履，柔履刚也。说而应乎乾，是以履虎尾不咥人亨。', image: '上天下泽，履。君子以辨上下，定民志。' },
  11: { id: 11, name: '地天泰', symbol: '䷊', upperTrigram: '坤', lowerTrigram: '乾', description: '小往大来，吉亨。', judgment: '天地交而万物通也，上下交而其志同也。', image: '天地交，泰。后以财成天地之道，辅相天地之宜。' },
  12: { id: 12, name: '天地否', symbol: '䷋', upperTrigram: '乾', lowerTrigram: '坤', description: '否之匪人，不利君子贞。大往小来。', judgment: '天地不交而万物不通也，上下不交而天下无邦也。', image: '天地不交，否。君子以俭德辟难，不可荣以禄。' },
  13: { id: 13, name: '天火同人', symbol: '䷌', upperTrigram: '乾', lowerTrigram: '离', description: '同人于野，亨。利涉大川，利君子贞。', judgment: '同人，柔得位得中而应乎乾。', image: '天与火，同人。君子以类族辨物。' },
  14: { id: 14, name: '火天大有', symbol: '䷍', upperTrigram: '离', lowerTrigram: '乾', description: '元亨。', judgment: '大有，柔得尊位，大中而上下应之。', image: '火在天上，大有。君子以遏恶扬善，顺天休命。' },
  15: { id: 15, name: '地山谦', symbol: '䷎', upperTrigram: '坤', lowerTrigram: '艮', description: '亨，君子有终。', judgment: '谦亨，天道下济而光明，地道卑而上行。', image: '地中有山，谦。君子以裒多益寡，称物平施。' },
  16: { id: 16, name: '雷地豫', symbol: '䷏', upperTrigram: '震', lowerTrigram: '坤', description: '利建侯行师。', judgment: '豫，刚应而志行，顺以动，豫。', image: '雷出地奋，豫。先王以作乐崇德。' },
  17: { id: 17, name: '泽雷随', symbol: '䷐', upperTrigram: '兑', lowerTrigram: '震', description: '元亨利贞，无咎。', judgment: '随，刚来而下柔，动而说，随。', image: '泽中有雷，随。君子以向晦入宴息。' },
  18: { id: 18, name: '山风蛊', symbol: '䷑', upperTrigram: '艮', lowerTrigram: '巽', description: '元亨，利涉大川。先甲三日，后甲三日。', judgment: '蛊，刚上而柔下，巽而止，蛊。', image: '山下有风，蛊。君子以振民育德。' },
  19: { id: 19, name: '地泽临', symbol: '䷒', upperTrigram: '坤', lowerTrigram: '兑', description: '元亨利贞。至于八月有凶。', judgment: '临，刚浸而长，说而顺，刚中而应。', image: '泽上有地，临。君子以教思无穷，容保民无疆。' },
  20: { id: 20, name: '风地观', symbol: '䷓', upperTrigram: '巽', lowerTrigram: '坤', description: '盥而不荐，有孚颙若。', judgment: '大观在上，顺而巽，中正以观天下。', image: '风行地上，观。先王以省方观民设教。' },
  21: { id: 21, name: '火雷噬嗑', symbol: '䷔', upperTrigram: '离', lowerTrigram: '震', description: '亨，利用狱。', judgment: '颐中有物，曰噬嗑。噬嗑而亨。', image: '雷电噬嗑，先王以明罚敕法。' },
  22: { id: 22, name: '山火贲', symbol: '䷕', upperTrigram: '艮', lowerTrigram: '离', description: '亨。小利有攸往。', judgment: '贲亨，柔来而文刚，故亨。', image: '山下有火，贲。君子以明庶政，无敢折狱。' },
  23: { id: 23, name: '山地剥', symbol: '䷖', upperTrigram: '艮', lowerTrigram: '坤', description: '不利有攸往。', judgment: '剥，剥也。柔变刚也。不利有攸往，小人长也。', image: '山附于地，剥。上以厚下安宅。' },
  24: { id: 24, name: '地雷复', symbol: '䷗', upperTrigram: '坤', lowerTrigram: '震', description: '亨。出入无疾，朋来无咎。反复其道，七日来复。', judgment: '复亨，刚反。动而以顺行，是以出入无疾。', image: '雷在地中，复。先王以至日闭关。' },
  25: { id: 25, name: '天雷无妄', symbol: '䷘', upperTrigram: '乾', lowerTrigram: '震', description: '元亨利贞。其匪正有眚，不利有攸往。', judgment: '无妄，刚自外来而为主于内。动而健，刚中而应。', image: '天下雷行，物与无妄。先王以茂对时育万物。' },
  26: { id: 26, name: '山天大畜', symbol: '䷙', upperTrigram: '艮', lowerTrigram: '乾', description: '利贞。不家食吉。利涉大川。', judgment: '大畜，刚健笃实辉光，日新其德。', image: '天在山中，大畜。君子以多识前言往行。' },
  27: { id: 27, name: '山雷颐', symbol: '䷚', upperTrigram: '艮', lowerTrigram: '震', description: '贞吉。观颐，自求口实。', judgment: '颐，贞吉，养正则吉也。观颐，观其所养也。', image: '山下有雷，颐。君子以慎言语，节饮食。' },
  28: { id: 28, name: '泽风大过', symbol: '䷛', upperTrigram: '兑', lowerTrigram: '巽', description: '栋桡，利有攸往，亨。', judgment: '大过，大者过也。栋桡，本末弱也。', image: '泽灭木，大过。君子以独立不惧，遁世无闷。' },
  29: { id: 29, name: '坎为水', symbol: '䷜', upperTrigram: '坎', lowerTrigram: '坎', description: '习坎，有孚，维心亨，行有尚。', judgment: '习坎，重险也。水流而不盈，行险而不失其信。', image: '水洊至，习坎。君子以常德行，习教事。' },
  30: { id: 30, name: '离为火', symbol: '䷝', upperTrigram: '离', lowerTrigram: '离', description: '利贞，亨。畜牝牛，吉。', judgment: '离，丽也。日月丽乎天，百谷草木丽乎土。', image: '明两作，离。大人以继明照于四方。' },
  31: { id: 31, name: '泽山咸', symbol: '䷞', upperTrigram: '兑', lowerTrigram: '艮', description: '亨，利贞。取女吉。', judgment: '咸，感也。柔上而刚下，二气感应以相与。', image: '山上有泽，咸。君子以虚受人。' },
  32: { id: 32, name: '雷风恒', symbol: '䷟', upperTrigram: '震', lowerTrigram: '巽', description: '亨，无咎，利贞。利有攸往。', judgment: '恒，久也。刚上而柔下，雷风相与，巽而动。', image: '雷风，恒。君子以立不易方。' },
  33: { id: 33, name: '天山遁', symbol: '䷠', upperTrigram: '乾', lowerTrigram: '艮', description: '亨，小利贞。', judgment: '遁亨，遁而亨也。刚当位而应，与时行也。', image: '天下有山，遁。君子以远小人，不恶而严。' },
  34: { id: 34, name: '雷天大壮', symbol: '䷡', upperTrigram: '震', lowerTrigram: '乾', description: '利贞。', judgment: '大壮，大者壮也。刚以动，故壮。', image: '雷在天上，大壮。君子以非礼弗履。' },
  35: { id: 35, name: '火地晋', symbol: '䷢', upperTrigram: '离', lowerTrigram: '坤', description: '康侯用锡马蕃庶，昼日三接。', judgment: '晋，进也。明出地上，顺而丽乎大明。', image: '明出地上，晋。君子以自昭明德。' },
  36: { id: 36, name: '地火明夷', symbol: '䷣', upperTrigram: '坤', lowerTrigram: '离', description: '利艰贞。', judgment: '明入地中，明夷。内文明而外柔顺，以蒙大难。', image: '明入地中，明夷。君子以莅众，用晦而明。' },
  37: { id: 37, name: '风火家人', symbol: '䷤', upperTrigram: '巽', lowerTrigram: '离', description: '利女贞。', judgment: '家人，女正位乎内，男正位乎外。', image: '风自火出，家人。君子以言有物而行有恒。' },
  38: { id: 38, name: '火泽睽', symbol: '䷥', upperTrigram: '离', lowerTrigram: '兑', description: '小事吉。', judgment: '睽，火动而上，泽动而下。二女同居，其志不同行。', image: '上火下泽，睽。君子以同而异。' },
  39: { id: 39, name: '水山蹇', symbol: '䷦', upperTrigram: '坎', lowerTrigram: '艮', description: '利西南，不利东北。利见大人，贞吉。', judgment: '蹇，难也，险在前也。见险而能止，知矣哉。', image: '山上有水，蹇。君子以反身修德。' },
  40: { id: 40, name: '雷水解', symbol: '䷧', upperTrigram: '震', lowerTrigram: '坎', description: '利西南。无所往，其来复吉。有攸往，夙吉。', judgment: '解，险以动，动而免乎险，解。', image: '雷雨作，解。君子以赦过宥罪。' },
  41: { id: 41, name: '山泽损', symbol: '䷨', upperTrigram: '艮', lowerTrigram: '兑', description: '有孚，元吉，无咎，可贞。利有攸往。', judgment: '损，损下益上，其道上行。', image: '山下有泽，损。君子以惩忿窒欲。' },
  42: { id: 42, name: '风雷益', symbol: '䷩', upperTrigram: '巽', lowerTrigram: '震', description: '利有攸往，利涉大川。', judgment: '益，损上益下，民说无疆。自上下下，其道大光。', image: '风雷，益。君子以见善则迁，有过则改。' },
  43: { id: 43, name: '泽天夬', symbol: '䷪', upperTrigram: '兑', lowerTrigram: '乾', description: '扬于王庭，孚号有厉。告自邑，不利即戎。', judgment: '夬，决也，刚决柔也。健而说，决而和。', image: '泽上于天，夬。君子以施禄及下。' },
  44: { id: 44, name: '天风姤', symbol: '䷫', upperTrigram: '乾', lowerTrigram: '巽', description: '女壮，勿用取女。', judgment: '姤，遇也，柔遇刚也。勿用取女，不可与长也。', image: '天下有风，姤。后以施命诰四方。' },
  45: { id: 45, name: '泽地萃', symbol: '䷬', upperTrigram: '兑', lowerTrigram: '坤', description: '亨。王假有庙。利见大人，亨，利贞。用大牲吉。', judgment: '萃，聚也。顺以说，刚中而应，故聚也。', image: '泽上于地，萃。君子以除戎器，戒不虞。' },
  46: { id: 46, name: '地风升', symbol: '䷭', upperTrigram: '坤', lowerTrigram: '巽', description: '元亨，用见大人，勿恤。南征吉。', judgment: '柔以时升，巽而顺，刚中而应，是以大亨。', image: '地中生木，升。君子以顺德，积小以高大。' },
  47: { id: 47, name: '泽水困', symbol: '䷮', upperTrigram: '兑', lowerTrigram: '坎', description: '亨，贞，大人吉，无咎。有言不信。', judgment: '困，刚揜也。险以说，困而不失其所亨。', image: '泽无水，困。君子以致命遂志。' },
  48: { id: 48, name: '水风井', symbol: '䷯', upperTrigram: '坎', lowerTrigram: '巽', description: '改邑不改井，无丧无得。往来井井。', judgment: '巽乎水而上水，井。井养而不穷也。', image: '木上有水，井。君子以劳民劝相。' },
  49: { id: 49, name: '泽火革', symbol: '䷰', upperTrigram: '兑', lowerTrigram: '离', description: '己日乃孚。元亨利贞，悔亡。', judgment: '革，水火相息。二女同居，其志不相得曰革。', image: '泽中有火，革。君子以治历明时。' },
  50: { id: 50, name: '火风鼎', symbol: '䷱', upperTrigram: '离', lowerTrigram: '巽', description: '元吉，亨。', judgment: '鼎，象也。以木巽火，亨饪也。', image: '木上有火，鼎。君子以正位凝命。' },
  51: { id: 51, name: '震为雷', symbol: '䷲', upperTrigram: '震', lowerTrigram: '震', description: '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。', judgment: '震，亨。震来虩虩，恐致福也。', image: '洊雷，震。君子以恐惧修省。' },
  52: { id: 52, name: '艮为山', symbol: '䷳', upperTrigram: '艮', lowerTrigram: '艮', description: '艮其背，不获其身。行其庭，不见其人。无咎。', judgment: '艮，止也。时止则止，时行则行。', image: '兼山，艮。君子以思不出其位。' },
  53: { id: 53, name: '风山渐', symbol: '䷴', upperTrigram: '巽', lowerTrigram: '艮', description: '女归吉，利贞。', judgment: '渐之进也，女归吉也。进得位，往有功也。', image: '山上有木，渐。君子以居贤德善俗。' },
  54: { id: 54, name: '雷泽归妹', symbol: '䷵', upperTrigram: '震', lowerTrigram: '兑', description: '征凶，无攸利。', judgment: '归妹，天地之大义也。天地不交而万物不兴。', image: '泽上有雷，归妹。君子以永终知敝。' },
  55: { id: 55, name: '雷火丰', symbol: '䷶', upperTrigram: '震', lowerTrigram: '离', description: '亨，王假之。勿忧，宜日中。', judgment: '丰，大也。明以动，故丰。', image: '雷电皆至，丰。君子以折狱致刑。' },
  56: { id: 56, name: '火山旅', symbol: '䷷', upperTrigram: '离', lowerTrigram: '艮', description: '小亨，旅贞吉。', judgment: '旅，小亨。柔得中乎外而顺乎刚。', image: '山上有火，旅。君子以明慎用刑而不留狱。' },
  57: { id: 57, name: '巽为风', symbol: '䷸', upperTrigram: '巽', lowerTrigram: '巽', description: '小亨，利有攸往，利见大人。', judgment: '重巽以申命。刚巽乎中正而志行。', image: '随风，巽。君子以申命行事。' },
  58: { id: 58, name: '兑为泽', symbol: '䷹', upperTrigram: '兑', lowerTrigram: '兑', description: '亨，利贞。', judgment: '兑，说也。刚中而柔外，说以利贞。', image: '丽泽，兑。君子以朋友讲习。' },
  59: { id: 59, name: '风水涣', symbol: '䷺', upperTrigram: '巽', lowerTrigram: '坎', description: '亨。王假有庙。利涉大川，利贞。', judgment: '涣，亨。刚来而不穷，柔得位乎外而上同。', image: '风行水上，涣。先王以享于帝立庙。' },
  60: { id: 60, name: '水泽节', symbol: '䷻', upperTrigram: '坎', lowerTrigram: '兑', description: '亨。苦节不可贞。', judgment: '节，亨。刚柔分而刚得中。苦节不可贞，其道穷也。', image: '泽上有水，节。君子以制数度，议德行。' },
  61: { id: 61, name: '风泽中孚', symbol: '䷼', upperTrigram: '巽', lowerTrigram: '兑', description: '豚鱼吉。利涉大川，利贞。', judgment: '中孚，柔在内而刚得中。说而巽，孚乃化邦也。', image: '泽上有风，中孚。君子以议狱缓死。' },
  62: { id: 62, name: '雷山小过', symbol: '䷽', upperTrigram: '震', lowerTrigram: '艮', description: '亨，利贞。可小事，不可大事。', judgment: '小过，小者过而亨也。过以利贞，与时行也。', image: '山上有雷，小过。君子以行过乎恭，丧过乎哀。' },
  63: { id: 63, name: '水火既济', symbol: '䷾', upperTrigram: '坎', lowerTrigram: '离', description: '亨小，利贞。初吉终乱。', judgment: '既济，亨。小者亨也。利贞，刚柔正而位当也。', image: '水在火上，既济。君子以思患而豫防之。' },
  64: { id: 64, name: '火水未济', symbol: '䷿', upperTrigram: '离', lowerTrigram: '坎', description: '亨。小狐汔济，濡其尾，无攸利。', judgment: '未济，亨。柔得中也。小狐汔济，未出中也。', image: '火在水上，未济。君子以慎辨物居方。' },
}

// 爻辞
function getLineTexts(hexagramId: number): { position: number; text: string; meaning: string }[] {
  const map: Record<number, string[]> = {
    1: ['潜龙勿用。', '见龙在田，利见大人。', '君子终日乾乾，夕惕若厉，无咎。', '或跃在渊，无咎。', '飞龙在天，利见大人。', '亢龙有悔。'],
    2: ['履霜，坚冰至。', '直方大，不习无不利。', '含章可贞，或从王事，无成有终。', '括囊，无咎无誉。', '黄裳，元吉。', '龙战于野，其血玄黄。'],
  }

  const texts = map[hexagramId] || [
    '初爻：谨慎行事，静观其变。', '二爻：时机渐至，积极准备。', '三爻：反复警醒，戒慎恐惧。',
    '四爻：进退有度，择机而动。', '五爻：中正得位，大展宏图。', '上爻：物极必反，守正防凶。'
  ]

  return texts.map((text, i) => ({
    position: i + 1,
    text,
    meaning: text.includes('吉') ? '吉' : text.includes('凶') ? '凶' : text.includes('悔') ? '悔' : text.includes('咎') ? '无咎' : '平'
  }))
}

// 根据上下卦计算卦序号
function getHexagramId(upper: string, lower: string): number {
  const upperLines = Object.entries(TRIGRAMS).find(([_, v]) => v.name === upper)?.[0] || ''
  const lowerLines = Object.entries(TRIGRAMS).find(([_, v]) => v.name === lower)?.[0] || ''

  for (let id = 1; id <= 64; id++) {
    const h = HEXAGRAMS[id]
    if (h.upperTrigram === upper && h.lowerTrigram === lower) return id
  }
  return 1 // fallback
}

// 将六条线(1阳0阴)转为上下卦
function linesToTrigrams(lines: number[]): { upper: string; lower: string } {
  const triToBin = (tri: number[]) => tri.join('')
  const upperKey = triToBin(lines.slice(0, 3))
  const lowerKey = triToBin(lines.slice(3, 6))
  return {
    upper: TRIGRAMS[upperKey]?.name || '乾',
    lower: TRIGRAMS[lowerKey]?.name || '乾',
  }
}

// 核心起卦函数
export function castDivination(): CastResult {
  const lines: number[] = []
  for (let i = 0; i < 6; i++) {
    // 三枚铜钱: 正面=3, 反面=2
    const c1 = Math.random() < 0.5 ? 3 : 2
    const c2 = Math.random() < 0.5 ? 3 : 2
    const c3 = Math.random() < 0.5 ? 3 : 2
    lines.push(c1 + c2 + c3)
    // 6=老阴(变阳) 7=少阳 8=少阴 9=老阳(变阴)
  }

  // 本卦 (老阳变阴，老阴变阳 之前的状态: 9→7, 6→8)
  const originalLines = lines.map(l => l === 6 || l === 8 ? 0 : 1)
  const changedLines = lines.map(l => l === 6 ? 1 : l === 9 ? 0 : (l === 7 ? 1 : 0))

  const origTri = linesToTrigrams(originalLines)
  const changTri = linesToTrigrams(changedLines)

  const originalId = getHexagramId(origTri.upper, origTri.lower)
  const changedId = getHexagramId(changTri.upper, changTri.lower)

  const changingLines = lines
    .map((l, i) => (l === 6 || l === 9) ? i + 1 : -1)
    .filter(i => i > 0)

  return {
    lines,
    originalHexagram: originalId,
    changedHexagram: changingLines.length > 0 ? changedId : null,
    changingLines,
  }
}

// 获取卦完整数据
export function getHexagram(id: number): HexagramData {
  const base = HEXAGRAMS[id] || HEXAGRAMS[1]
  return {
    ...base,
    lines: getLineTexts(id),
  }
}

// 生成解卦文本
export function generateInterpretation(
  original: HexagramData,
  changed: HexagramData | null,
  changingLines: number[],
  question: string
): string {
  let interpretation = ''

  interpretation += `【本卦】${original.symbol} ${original.name}\n`
  interpretation += `${original.judgment}\n\n`

  if (changed) {
    interpretation += `【变卦】${changed.symbol} ${changed.name}\n`
    interpretation += `${changed.judgment}\n\n`
  }

  if (changingLines.length > 0) {
    interpretation += `【动爻】第${changingLines.join('、')}爻发动\n`
    for (const pos of changingLines) {
      const line = original.lines.find(l => l.position === pos)
      if (line) {
        interpretation += `第${pos}爻：${line.text}（${line.meaning}）\n`
      }
    }
    interpretation += '\n'
  } else {
    interpretation += '【静卦】六爻安静，以本卦卦辞为主。\n\n'
  }

  interpretation += `【占问】${question || '未提问'}\n`
  interpretation += `【解卦】\n`

  if (changed && changingLines.length === 1) {
    interpretation += `此卦以动爻之辞为主，参考本卦卦辞。${original.name}之${changed.name}，预示着事物处于变化之中。`
    const line = original.lines.find(l => l.position === changingLines[0])
    if (line) interpretation += `动爻"${line.text}"提示：${line.meaning === '吉' ? '此事前景光明，宜积极进取。' : line.meaning === '凶' ? '需谨慎行事，避免冒进。' : '宜保持中道，稳步推进。'}`
  } else if (changed && changingLines.length > 1) {
    interpretation += `此卦有多个动爻，以变卦${changed.name}卦辞为主。变化多端，需综合考量各方因素。${changed.description}`
  } else {
    interpretation += `此卦六爻安静，以本卦${original.name}卦辞为主。${original.description} 提示当前局势稳定，${original.judgment.includes('亨') ? '总体运势亨通，宜顺势而为。' : '宜守正待时，静观其变。'}`
  }

  return interpretation
}

// 根据六条线的结果获取阴阳显示
export function getLineDisplay(value: number): { type: string; label: string; changing: boolean } {
  switch (value) {
    case 6: return { type: '老阴', label: '⚋ ⟳', changing: true }
    case 7: return { type: '少阳', label: '⚊', changing: false }
    case 8: return { type: '少阴', label: '⚋', changing: false }
    case 9: return { type: '老阳', label: '⚊ ⟳', changing: true }
    default: return { type: '未知', label: '?', changing: false }
  }
}