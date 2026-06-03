// 六十四卦爻辞数据（周易原文）
// 每个卦的每条爻辞对应爻位 1(初)-6(上)，null 表示无独立爻辞（用卦辞替代）

export interface HexagramLineText {
  position: number   // 1-6
  title: string      // 初九/六二 等
  text: string       // 爻辞原文
}

export const HEXAGRAM_LINE_TEXTS: Record<number, { guaCi: string; tuanZhuan: string; xiangZhuan: string; lines: HexagramLineText[] }> = {
  1: {
    guaCi: '元亨利贞。',
    tuanZhuan: '大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成，时乘六龙以御天。乾道变化，各正性命，保合太和，乃利贞。首出庶物，万国咸宁。',
    xiangZhuan: '天行健，君子以自强不息。',
    lines: [
      { position: 1, title: '初九', text: '潜龙勿用。' },
      { position: 2, title: '九二', text: '见龙在田，利见大人。' },
      { position: 3, title: '九三', text: '君子终日乾乾，夕惕若厉，无咎。' },
      { position: 4, title: '九四', text: '或跃在渊，无咎。' },
      { position: 5, title: '九五', text: '飞龙在天，利见大人。' },
      { position: 6, title: '上九', text: '亢龙有悔。' },
    ]
  },
  2: {
    guaCi: '元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。',
    tuanZhuan: '至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。含弘光大，品物咸亨。牝马地类，行地无疆，柔顺利贞。',
    xiangZhuan: '地势坤，君子以厚德载物。',
    lines: [
      { position: 1, title: '初六', text: '履霜，坚冰至。' },
      { position: 2, title: '六二', text: '直方大，不习无不利。' },
      { position: 3, title: '六三', text: '含章可贞，或从王事，无成有终。' },
      { position: 4, title: '六四', text: '括囊，无咎无誉。' },
      { position: 5, title: '六五', text: '黄裳，元吉。' },
      { position: 6, title: '上六', text: '龙战于野，其血玄黄。' },
    ]
  },
  3: {
    guaCi: '元亨利贞。勿用有攸往，利建侯。',
    tuanZhuan: '屯，刚柔始交而难生。动乎险中，大亨贞。雷雨之动满盈，天造草昧，宜建侯而不宁。',
    xiangZhuan: '云雷屯，君子以经纶。',
    lines: [
      { position: 1, title: '初九', text: '磐桓，利居贞，利建侯。' },
      { position: 2, title: '六二', text: '屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。' },
      { position: 3, title: '六三', text: '即鹿无虞，惟入于林中，君子几不如舍，往吝。' },
      { position: 4, title: '六四', text: '乘马班如，求婚媾，往吉，无不利。' },
      { position: 5, title: '九五', text: '屯其膏，小贞吉，大贞凶。' },
      { position: 6, title: '上六', text: '乘马班如，泣血涟如。' },
    ]
  },
  4: {
    guaCi: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    tuanZhuan: '蒙，山下有险，险而止，蒙。蒙亨，以亨行时中也。匪我求童蒙，童蒙求我，志应也。',
    xiangZhuan: '山下出泉，蒙。君子以果行育德。',
    lines: [
      { position: 1, title: '初六', text: '发蒙，利用刑人，用说桎梏，以往吝。' },
      { position: 2, title: '九二', text: '包蒙吉，纳妇吉，子克家。' },
      { position: 3, title: '六三', text: '勿用取女，见金夫，不有躬，无攸利。' },
      { position: 4, title: '六四', text: '困蒙，吝。' },
      { position: 5, title: '六五', text: '童蒙，吉。' },
      { position: 6, title: '上九', text: '击蒙，不利为寇，利御寇。' },
    ]
  },
  5: {
    guaCi: '有孚，光亨，贞吉。利涉大川。',
    tuanZhuan: '需，须也。险在前也，刚健而不陷，其义不困穷矣。需有孚光亨贞吉，位乎天位，以正中也。',
    xiangZhuan: '云上于天，需。君子以饮食宴乐。',
    lines: [
      { position: 1, title: '初九', text: '需于郊，利用恒，无咎。' },
      { position: 2, title: '九二', text: '需于沙，小有言，终吉。' },
      { position: 3, title: '九三', text: '需于泥，致寇至。' },
      { position: 4, title: '六四', text: '需于血，出自穴。' },
      { position: 5, title: '九五', text: '需于酒食，贞吉。' },
      { position: 6, title: '上六', text: '入于穴，有不速之客三人来，敬之终吉。' },
    ]
  },
  6: {
    guaCi: '有孚窒惕，中吉，终凶。利见大人，不利涉大川。',
    tuanZhuan: '讼，上刚下险，险而健，讼。讼有孚窒惕中吉，刚来而得中也。终凶，讼不可成也。',
    xiangZhuan: '天与水违行，讼。君子以作事谋始。',
    lines: [
      { position: 1, title: '初六', text: '不永所事，小有言，终吉。' },
      { position: 2, title: '九二', text: '不克讼，归而逋，其邑人三百户，无眚。' },
      { position: 3, title: '六三', text: '食旧德，贞厉，终吉。或从王事，无成。' },
      { position: 4, title: '九四', text: '不克讼，复即命，渝安贞，吉。' },
      { position: 5, title: '九五', text: '讼，元吉。' },
      { position: 6, title: '上九', text: '或锡之鞶带，终朝三褫之。' },
    ]
  },
  7: {
    guaCi: '贞，丈人吉，无咎。',
    tuanZhuan: '师，众也。贞，正也。能以众正，可以王矣。刚中而应，行险而顺。',
    xiangZhuan: '地中有水，师。君子以容民畜众。',
    lines: [
      { position: 1, title: '初六', text: '师出以律，否臧凶。' },
      { position: 2, title: '九二', text: '在师中，吉无咎，王三锡命。' },
      { position: 3, title: '六三', text: '师或舆尸，凶。' },
      { position: 4, title: '六四', text: '师左次，无咎。' },
      { position: 5, title: '六五', text: '田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶。' },
      { position: 6, title: '上六', text: '大君有命，开国承家，小人勿用。' },
    ]
  },
  8: {
    guaCi: '吉。原筮，元永贞，无咎。不宁方来，后夫凶。',
    tuanZhuan: '比，吉也。比，辅也，下顺从也。原筮元永贞无咎，以刚中也。不宁方来，上下应也。',
    xiangZhuan: '地上有水，比。先王以建万国亲诸侯。',
    lines: [
      { position: 1, title: '初六', text: '有孚比之，无咎。有孚盈缶，终来有它，吉。' },
      { position: 2, title: '六二', text: '比之自内，贞吉。' },
      { position: 3, title: '六三', text: '比之匪人。' },
      { position: 4, title: '六四', text: '外比之，贞吉。' },
      { position: 5, title: '九五', text: '显比，王用三驱，失前禽。邑人不诫，吉。' },
      { position: 6, title: '上六', text: '比之无首，凶。' },
    ]
  },
  9: {
    guaCi: '亨。密云不雨，自我西郊。',
    tuanZhuan: '小畜，柔得位而上下应之，曰小畜。健而巽，刚中而志行，乃亨。',
    xiangZhuan: '风行天上，小畜。君子以懿文德。',
    lines: [
      { position: 1, title: '初九', text: '复自道，何其咎，吉。' },
      { position: 2, title: '九二', text: '牵复，吉。' },
      { position: 3, title: '九三', text: '舆说辐，夫妻反目。' },
      { position: 4, title: '六四', text: '有孚，血去惕出，无咎。' },
      { position: 5, title: '九五', text: '有孚挛如，富以其邻。' },
      { position: 6, title: '上九', text: '既雨既处，尚德载，妇贞厉。月几望，君子征凶。' },
    ]
  },
  10: {
    guaCi: '履虎尾，不咥人，亨。',
    tuanZhuan: '履，柔履刚也。说而应乎乾，是以履虎尾不咥人亨。刚中正，履帝位而不疚，光明也。',
    xiangZhuan: '上天下泽，履。君子以辨上下，定民志。',
    lines: [
      { position: 1, title: '初九', text: '素履，往无咎。' },
      { position: 2, title: '九二', text: '履道坦坦，幽人贞吉。' },
      { position: 3, title: '六三', text: '眇能视，跛能履，履虎尾，咥人凶。武人为于大君。' },
      { position: 4, title: '九四', text: '履虎尾，愬愬终吉。' },
      { position: 5, title: '九五', text: '夬履，贞厉。' },
      { position: 6, title: '上九', text: '视履考祥，其旋元吉。' },
    ]
  },
  11: {
    guaCi: '小往大来，吉亨。',
    tuanZhuan: '天地交而万物通也，上下交而其志同也。内阳而外阴，内健而外顺，内君子而外小人。',
    xiangZhuan: '天地交，泰。后以财成天地之道，辅相天地之宜，以左右民。',
    lines: [
      { position: 1, title: '初九', text: '拔茅茹，以其汇，征吉。' },
      { position: 2, title: '九二', text: '包荒，用冯河，不遐遗，朋亡，得尚于中行。' },
      { position: 3, title: '九三', text: '无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福。' },
      { position: 4, title: '六四', text: '翩翩，不富以其邻，不戒以孚。' },
      { position: 5, title: '六五', text: '帝乙归妹，以祉元吉。' },
      { position: 6, title: '上六', text: '城复于隍，勿用师，自邑告命，贞吝。' },
    ]
  },
  12: {
    guaCi: '否之匪人，不利君子贞。大往小来。',
    tuanZhuan: '天地不交而万物不通也，上下不交而天下无邦也。内阴而外阳，内柔而外刚，内小人而外君子。',
    xiangZhuan: '天地不交，否。君子以俭德辟难，不可荣以禄。',
    lines: [
      { position: 1, title: '初六', text: '拔茅茹，以其汇，贞吉亨。' },
      { position: 2, title: '六二', text: '包承，小人吉，大人否亨。' },
      { position: 3, title: '六三', text: '包羞。' },
      { position: 4, title: '九四', text: '有命无咎，畴离祉。' },
      { position: 5, title: '九五', text: '休否，大人吉。其亡其亡，系于苞桑。' },
      { position: 6, title: '上九', text: '倾否，先否后喜。' },
    ]
  },
  13: {
    guaCi: '同人于野，亨。利涉大川，利君子贞。',
    tuanZhuan: '同人，柔得位得中而应乎乾，曰同人。同人于野亨利涉大川，乾行也。文明以健，中正而应，君子正也。',
    xiangZhuan: '天与火，同人。君子以类族辨物。',
    lines: [
      { position: 1, title: '初九', text: '同人于门，无咎。' },
      { position: 2, title: '六二', text: '同人于宗，吝。' },
      { position: 3, title: '九三', text: '伏戎于莽，升其高陵，三岁不兴。' },
      { position: 4, title: '九四', text: '乘其墉，弗克攻，吉。' },
      { position: 5, title: '九五', text: '同人先号咷而后笑，大师克相遇。' },
      { position: 6, title: '上九', text: '同人于郊，无悔。' },
    ]
  },
  14: {
    guaCi: '元亨。',
    tuanZhuan: '大有，柔得尊位，大中而上下应之，曰大有。其德刚健而文明，应乎天而时行，是以元亨。',
    xiangZhuan: '火在天上，大有。君子以遏恶扬善，顺天休命。',
    lines: [
      { position: 1, title: '初九', text: '无交害，匪咎，艰则无咎。' },
      { position: 2, title: '九二', text: '大车以载，有攸往，无咎。' },
      { position: 3, title: '九三', text: '公用亨于天子，小人弗克。' },
      { position: 4, title: '九四', text: '匪其彭，无咎。' },
      { position: 5, title: '六五', text: '厥孚交如，威如，吉。' },
      { position: 6, title: '上九', text: '自天祐之，吉无不利。' },
    ]
  },
  15: {
    guaCi: '亨，君子有终。',
    tuanZhuan: '谦亨，天道下济而光明，地道卑而上行。天道亏盈而益谦，地道变盈而流谦。',
    xiangZhuan: '地中有山，谦。君子以裒多益寡，称物平施。',
    lines: [
      { position: 1, title: '初六', text: '谦谦君子，用涉大川，吉。' },
      { position: 2, title: '六二', text: '鸣谦，贞吉。' },
      { position: 3, title: '九三', text: '劳谦君子，有终吉。' },
      { position: 4, title: '六四', text: '无不利，撝谦。' },
      { position: 5, title: '六五', text: '不富以其邻，利用侵伐，无不利。' },
      { position: 6, title: '上六', text: '鸣谦，利用行师，征邑国。' },
    ]
  },
  16: {
    guaCi: '利建侯行师。',
    tuanZhuan: '豫，刚应而志行，顺以动，豫。豫顺以动，故天地如之，而况建侯行师乎。',
    xiangZhuan: '雷出地奋，豫。先王以作乐崇德，殷荐之上帝，以配祖考。',
    lines: [
      { position: 1, title: '初六', text: '鸣豫，凶。' },
      { position: 2, title: '六二', text: '介于石，不终日，贞吉。' },
      { position: 3, title: '六三', text: '盱豫悔，迟有悔。' },
      { position: 4, title: '九四', text: '由豫，大有得。勿疑，朋盍簪。' },
      { position: 5, title: '六五', text: '贞疾，恒不死。' },
      { position: 6, title: '上六', text: '冥豫，成有渝，无咎。' },
    ]
  },
  17: {
    guaCi: '元亨利贞，无咎。',
    tuanZhuan: '随，刚来而下柔，动而说，随。大亨贞无咎，而天下随时，随时之义大矣哉。',
    xiangZhuan: '泽中有雷，随。君子以向晦入宴息。',
    lines: [
      { position: 1, title: '初九', text: '官有渝，贞吉。出门交有功。' },
      { position: 2, title: '六二', text: '系小子，失丈夫。' },
      { position: 3, title: '六三', text: '系丈夫，失小子。随有求得，利居贞。' },
      { position: 4, title: '九四', text: '随有获，贞凶。有孚在道，以明，何咎。' },
      { position: 5, title: '九五', text: '孚于嘉，吉。' },
      { position: 6, title: '上六', text: '拘系之，乃从维之。王用亨于西山。' },
    ]
  },
  18: {
    guaCi: '元亨，利涉大川。先甲三日，后甲三日。',
    tuanZhuan: '蛊，刚上而柔下，巽而止，蛊。蛊元亨而天下治也。利涉大川，往有事也。',
    xiangZhuan: '山下有风，蛊。君子以振民育德。',
    lines: [
      { position: 1, title: '初六', text: '干父之蛊，有子，考无咎，厉终吉。' },
      { position: 2, title: '九二', text: '干母之蛊，不可贞。' },
      { position: 3, title: '九三', text: '干父之蛊，小有悔，无大咎。' },
      { position: 4, title: '六四', text: '裕父之蛊，往见吝。' },
      { position: 5, title: '六五', text: '干父之蛊，用誉。' },
      { position: 6, title: '上九', text: '不事王侯，高尚其事。' },
    ]
  },
  19: {
    guaCi: '元亨利贞。至于八月有凶。',
    tuanZhuan: '临，刚浸而长，说而顺，刚中而应。大亨以正，天之道也。至于八月有凶，消不久也。',
    xiangZhuan: '泽上有地，临。君子以教思无穷，容保民无疆。',
    lines: [
      { position: 1, title: '初九', text: '咸临，贞吉。' },
      { position: 2, title: '九二', text: '咸临，吉无不利。' },
      { position: 3, title: '六三', text: '甘临，无攸利。既忧之，无咎。' },
      { position: 4, title: '六四', text: '至临，无咎。' },
      { position: 5, title: '六五', text: '知临，大君之宜，吉。' },
      { position: 6, title: '上六', text: '敦临，吉无咎。' },
    ]
  },
  20: {
    guaCi: '盥而不荐，有孚颙若。',
    tuanZhuan: '大观在上，顺而巽，中正以观天下。观盥而不荐有孚颙若，下观而化也。',
    xiangZhuan: '风行地上，观。先王以省方观民设教。',
    lines: [
      { position: 1, title: '初六', text: '童观，小人无咎，君子吝。' },
      { position: 2, title: '六二', text: '窥观，利女贞。' },
      { position: 3, title: '六三', text: '观我生，进退。' },
      { position: 4, title: '六四', text: '观国之光，利用宾于王。' },
      { position: 5, title: '九五', text: '观我生，君子无咎。' },
      { position: 6, title: '上九', text: '观其生，君子无咎。' },
    ]
  },
  21: {
    guaCi: '亨，利用狱。',
    tuanZhuan: '颐中有物，曰噬嗑。噬嗑而亨，刚柔分，动而明，雷电合而章。',
    xiangZhuan: '雷电噬嗑，先王以明罚敕法。',
    lines: [
      { position: 1, title: '初九', text: '屦校灭趾，无咎。' },
      { position: 2, title: '六二', text: '噬肤灭鼻，无咎。' },
      { position: 3, title: '六三', text: '噬腊肉，遇毒，小吝，无咎。' },
      { position: 4, title: '九四', text: '噬干胏，得金矢，利艰贞，吉。' },
      { position: 5, title: '六五', text: '噬干肉，得黄金，贞厉，无咎。' },
      { position: 6, title: '上九', text: '何校灭耳，凶。' },
    ]
  },
  22: {
    guaCi: '亨。小利有攸往。',
    tuanZhuan: '贲亨，柔来而文刚，故亨。分刚上而文柔，故小利有攸往。天文也，文明以止，人文也。',
    xiangZhuan: '山下有火，贲。君子以明庶政，无敢折狱。',
    lines: [
      { position: 1, title: '初九', text: '贲其趾，舍车而徒。' },
      { position: 2, title: '六二', text: '贲其须。' },
      { position: 3, title: '九三', text: '贲如濡如，永贞吉。' },
      { position: 4, title: '六四', text: '贲如皤如，白马翰如，匪寇婚媾。' },
      { position: 5, title: '六五', text: '贲于丘园，束帛戋戋，吝，终吉。' },
      { position: 6, title: '上九', text: '白贲，无咎。' },
    ]
  },
  23: {
    guaCi: '不利有攸往。',
    tuanZhuan: '剥，剥也。柔变刚也。不利有攸往，小人长也。顺而止之，观象也。',
    xiangZhuan: '山附于地，剥。上以厚下安宅。',
    lines: [
      { position: 1, title: '初六', text: '剥床以足，蔑贞凶。' },
      { position: 2, title: '六二', text: '剥床以辨，蔑贞凶。' },
      { position: 3, title: '六三', text: '剥之，无咎。' },
      { position: 4, title: '六四', text: '剥床以肤，凶。' },
      { position: 5, title: '六五', text: '贯鱼，以宫人宠，无不利。' },
      { position: 6, title: '上九', text: '硕果不食，君子得舆，小人剥庐。' },
    ]
  },
  24: {
    guaCi: '亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。',
    tuanZhuan: '复亨，刚反。动而以顺行，是以出入无疾，朋来无咎。反复其道，七日来复，天行也。',
    xiangZhuan: '雷在地中，复。先王以至日闭关，商旅不行，后不省方。',
    lines: [
      { position: 1, title: '初九', text: '不远复，无祗悔，元吉。' },
      { position: 2, title: '六二', text: '休复，吉。' },
      { position: 3, title: '六三', text: '频复，厉，无咎。' },
      { position: 4, title: '六四', text: '中行独复。' },
      { position: 5, title: '六五', text: '敦复，无悔。' },
      { position: 6, title: '上六', text: '迷复，凶，有灾眚。用行师，终有大败。' },
    ]
  },
  25: {
    guaCi: '元亨利贞。其匪正有眚，不利有攸往。',
    tuanZhuan: '无妄，刚自外来而为主于内。动而健，刚中而应。大亨以正，天之命也。',
    xiangZhuan: '天下雷行，物与无妄。先王以茂对时育万物。',
    lines: [
      { position: 1, title: '初九', text: '无妄，往吉。' },
      { position: 2, title: '六二', text: '不耕获，不菑畬，则利有攸往。' },
      { position: 3, title: '六三', text: '无妄之灾，或系之牛，行人之得，邑人之灾。' },
      { position: 4, title: '九四', text: '可贞，无咎。' },
      { position: 5, title: '九五', text: '无妄之疾，勿药有喜。' },
      { position: 6, title: '上九', text: '无妄，行有眚，无攸利。' },
    ]
  },
  26: {
    guaCi: '利贞。不家食吉，利涉大川。',
    tuanZhuan: '大畜，刚健笃实辉光，日新其德。刚上而尚贤，能止健，大正也。',
    xiangZhuan: '天在山中，大畜。君子以多识前言往行，以畜其德。',
    lines: [
      { position: 1, title: '初九', text: '有厉利已。' },
      { position: 2, title: '九二', text: '舆说輹。' },
      { position: 3, title: '九三', text: '良马逐，利艰贞。曰闲舆卫，利有攸往。' },
      { position: 4, title: '六四', text: '童牛之牿，元吉。' },
      { position: 5, title: '六五', text: '豮豕之牙，吉。' },
      { position: 6, title: '上九', text: '何天之衢，亨。' },
    ]
  },
  27: {
    guaCi: '贞吉。观颐，自求口实。',
    tuanZhuan: '颐贞吉，养正则吉也。观颐，观其所养也。自求口实，观其自养也。',
    xiangZhuan: '山下有雷，颐。君子以慎言语，节饮食。',
    lines: [
      { position: 1, title: '初九', text: '舍尔灵龟，观我朵颐，凶。' },
      { position: 2, title: '六二', text: '颠颐，拂经于丘颐，征凶。' },
      { position: 3, title: '六三', text: '拂颐，贞凶，十年勿用，无攸利。' },
      { position: 4, title: '六四', text: '颠颐，吉。虎视眈眈，其欲逐逐，无咎。' },
      { position: 5, title: '六五', text: '拂经，居贞吉，不可涉大川。' },
      { position: 6, title: '上九', text: '由颐，厉吉，利涉大川。' },
    ]
  },
  28: {
    guaCi: '栋桡，利有攸往，亨。',
    tuanZhuan: '大过，大者过也。栋桡，本末弱也。刚过而中，巽而说行，利有攸往乃亨。',
    xiangZhuan: '泽灭木，大过。君子以独立不惧，遁世无闷。',
    lines: [
      { position: 1, title: '初六', text: '藉用白茅，无咎。' },
      { position: 2, title: '九二', text: '枯杨生稊，老夫得其女妻，无不利。' },
      { position: 3, title: '九三', text: '栋桡，凶。' },
      { position: 4, title: '九四', text: '栋隆，吉。有它吝。' },
      { position: 5, title: '九五', text: '枯杨生华，老妇得其士夫，无咎无誉。' },
      { position: 6, title: '上六', text: '过涉灭顶，凶，无咎。' },
    ]
  },
  29: {
    guaCi: '习坎，有孚，维心亨，行有尚。',
    tuanZhuan: '习坎，重险也。水流而不盈，行险而不失其信。维心亨，乃以刚中也。',
    xiangZhuan: '水洊至，习坎。君子以常德行，习教事。',
    lines: [
      { position: 1, title: '初六', text: '习坎，入于坎窞，凶。' },
      { position: 2, title: '九二', text: '坎有险，求小得。' },
      { position: 3, title: '六三', text: '来之坎坎，险且枕，入于坎窞，勿用。' },
      { position: 4, title: '六四', text: '樽酒簋贰，用缶，纳约自牖，终无咎。' },
      { position: 5, title: '九五', text: '坎不盈，祗既平，无咎。' },
      { position: 6, title: '上六', text: '系用徽纆，寘于丛棘，三岁不得，凶。' },
    ]
  },
  30: {
    guaCi: '利贞，亨。畜牝牛，吉。',
    tuanZhuan: '离，丽也。日月丽乎天，百谷草木丽乎土。重明以丽乎正，乃化成天下。',
    xiangZhuan: '明两作，离。大人以继明照于四方。',
    lines: [
      { position: 1, title: '初九', text: '履错然，敬之无咎。' },
      { position: 2, title: '六二', text: '黄离，元吉。' },
      { position: 3, title: '九三', text: '日昃之离，不鼓缶而歌，则大耋之嗟，凶。' },
      { position: 4, title: '九四', text: '突如其来如，焚如，死如，弃如。' },
      { position: 5, title: '六五', text: '出涕沱若，戚嗟若，吉。' },
      { position: 6, title: '上九', text: '王用出征，有嘉折首，获匪其丑，无咎。' },
    ]
  },
  31: {
    guaCi: '亨，利贞，取女吉。',
    tuanZhuan: '咸，感也。柔上而刚下，二气感应以相与。止而说，男下女，是以亨利贞取女吉也。',
    xiangZhuan: '山上有泽，咸。君子以虚受人。',
    lines: [
      { position: 1, title: '初六', text: '咸其拇。' },
      { position: 2, title: '六二', text: '咸其腓，凶，居吉。' },
      { position: 3, title: '九三', text: '咸其股，执其随，往吝。' },
      { position: 4, title: '九四', text: '贞吉悔亡，憧憧往来，朋从尔思。' },
      { position: 5, title: '九五', text: '咸其脢，无悔。' },
      { position: 6, title: '上六', text: '咸其辅颊舌。' },
    ]
  },
  32: {
    guaCi: '亨，无咎，利贞，利有攸往。',
    tuanZhuan: '恒，久也。刚上而柔下，雷风相与，巽而动，刚柔皆应，恒。',
    xiangZhuan: '雷风，恒。君子以立不易方。',
    lines: [
      { position: 1, title: '初六', text: '浚恒，贞凶，无攸利。' },
      { position: 2, title: '九二', text: '悔亡。' },
      { position: 3, title: '九三', text: '不恒其德，或承之羞，贞吝。' },
      { position: 4, title: '九四', text: '田无禽。' },
      { position: 5, title: '六五', text: '恒其德，贞，妇人吉，夫子凶。' },
      { position: 6, title: '上六', text: '振恒，凶。' },
    ]
  },
  33: {
    guaCi: '亨，小利贞。',
    tuanZhuan: '遁亨，遁而亨也。刚当位而应，与时行也。小利贞，浸而长也。',
    xiangZhuan: '天下有山，遁。君子以远小人，不恶而严。',
    lines: [
      { position: 1, title: '初六', text: '遁尾，厉，勿用有攸往。' },
      { position: 2, title: '六二', text: '执之用黄牛之革，莫之胜说。' },
      { position: 3, title: '九三', text: '系遁，有疾厉，畜臣妾吉。' },
      { position: 4, title: '九四', text: '好遁，君子吉，小人否。' },
      { position: 5, title: '九五', text: '嘉遁，贞吉。' },
      { position: 6, title: '上九', text: '肥遁，无不利。' },
    ]
  },
  34: {
    guaCi: '利贞。',
    tuanZhuan: '大壮，大者壮也。刚以动，故壮。大壮利贞，大者正也。正大而天地之情可见矣。',
    xiangZhuan: '雷在天上，大壮。君子以非礼弗履。',
    lines: [
      { position: 1, title: '初九', text: '壮于趾，征凶，有孚。' },
      { position: 2, title: '九二', text: '贞吉。' },
      { position: 3, title: '九三', text: '小人用壮，君子用罔，贞厉。羝羊触藩，羸其角。' },
      { position: 4, title: '九四', text: '贞吉悔亡，藩决不羸，壮于大舆之輹。' },
      { position: 5, title: '六五', text: '丧羊于易，无悔。' },
      { position: 6, title: '上六', text: '羝羊触藩，不能退，不能遂，无攸利，艰则吉。' },
    ]
  },
  35: {
    guaCi: '康侯用锡马蕃庶，昼日三接。',
    tuanZhuan: '晋，进也。明出地上，顺而丽乎大明，柔进而上行。',
    xiangZhuan: '明出地上，晋。君子以自昭明德。',
    lines: [
      { position: 1, title: '初六', text: '晋如摧如，贞吉。罔孚，裕无咎。' },
      { position: 2, title: '六二', text: '晋如愁如，贞吉。受兹介福，于其王母。' },
      { position: 3, title: '六三', text: '众允，悔亡。' },
      { position: 4, title: '九四', text: '晋如鼫鼠，贞厉。' },
      { position: 5, title: '六五', text: '悔亡，失得勿恤，往吉无不利。' },
      { position: 6, title: '上九', text: '晋其角，维用伐邑，厉吉无咎，贞吝。' },
    ]
  },
  36: {
    guaCi: '利艰贞。',
    tuanZhuan: '明入地中，明夷。内文明而外柔顺，以蒙大难，文王以之。利艰贞，晦其明也。',
    xiangZhuan: '明入地中，明夷。君子以莅众，用晦而明。',
    lines: [
      { position: 1, title: '初九', text: '明夷于飞，垂其翼。君子于行，三日不食，有攸往，主人有言。' },
      { position: 2, title: '六二', text: '明夷，夷于左股，用拯马壮，吉。' },
      { position: 3, title: '九三', text: '明夷于南狩，得其大首，不可疾贞。' },
      { position: 4, title: '六四', text: '入于左腹，获明夷之心，于出门庭。' },
      { position: 5, title: '六五', text: '箕子之明夷，利贞。' },
      { position: 6, title: '上六', text: '不明晦，初登于天，后入于地。' },
    ]
  },
  37: {
    guaCi: '利女贞。',
    tuanZhuan: '家人，女正位乎内，男正位乎外。男女正，天地之大义也。家人有严君焉，父母之谓也。',
    xiangZhuan: '风自火出，家人。君子以言有物而行有恒。',
    lines: [
      { position: 1, title: '初九', text: '闲有家，悔亡。' },
      { position: 2, title: '六二', text: '无攸遂，在中馈，贞吉。' },
      { position: 3, title: '九三', text: '家人嗃嗃，悔厉吉。妇子嘻嘻，终吝。' },
      { position: 4, title: '六四', text: '富家，大吉。' },
      { position: 5, title: '九五', text: '王假有家，勿恤吉。' },
      { position: 6, title: '上九', text: '有孚威如，终吉。' },
    ]
  },
  38: {
    guaCi: '小事吉。',
    tuanZhuan: '睽，火动而上，泽动而下。二女同居，其志不同行。说而丽乎明，柔进而上行。',
    xiangZhuan: '上火下泽，睽。君子以同而异。',
    lines: [
      { position: 1, title: '初九', text: '悔亡，丧马勿逐，自复。见恶人无咎。' },
      { position: 2, title: '九二', text: '遇主于巷，无咎。' },
      { position: 3, title: '六三', text: '见舆曳，其牛掣，其人天且劓，无初有终。' },
      { position: 4, title: '九四', text: '睽孤，遇元夫，交孚，厉无咎。' },
      { position: 5, title: '六五', text: '悔亡，厥宗噬肤，往何咎。' },
      { position: 6, title: '上九', text: '睽孤，见豕负涂，载鬼一车，先张之弧，后说之弧。匪寇婚媾，往遇雨则吉。' },
    ]
  },
  39: {
    guaCi: '利西南，不利东北。利见大人，贞吉。',
    tuanZhuan: '蹇，难也，险在前也。见险而能止，知矣哉。蹇利西南，往得中也。',
    xiangZhuan: '山上有水，蹇。君子以反身修德。',
    lines: [
      { position: 1, title: '初六', text: '往蹇，来誉。' },
      { position: 2, title: '六二', text: '王臣蹇蹇，匪躬之故。' },
      { position: 3, title: '九三', text: '往蹇来反。' },
      { position: 4, title: '六四', text: '往蹇来连。' },
      { position: 5, title: '九五', text: '大蹇朋来。' },
      { position: 6, title: '上六', text: '往蹇来硕，吉。利见大人。' },
    ]
  },
  40: {
    guaCi: '利西南。无所往，其来复吉。有攸往，夙吉。',
    tuanZhuan: '解，险以动，动而免乎险，解。解利西南，往得众也。其来复吉，乃得中也。',
    xiangZhuan: '雷雨作，解。君子以赦过宥罪。',
    lines: [
      { position: 1, title: '初六', text: '无咎。' },
      { position: 2, title: '九二', text: '田获三狐，得黄矢，贞吉。' },
      { position: 3, title: '六三', text: '负且乘，致寇至，贞吝。' },
      { position: 4, title: '九四', text: '解而拇，朋至斯孚。' },
      { position: 5, title: '六五', text: '君子维有解，吉。有孚于小人。' },
      { position: 6, title: '上六', text: '公用射隼于高墉之上，获之，无不利。' },
    ]
  },
  41: {
    guaCi: '有孚，元吉，无咎，可贞，利有攸往。曷之用，二簋可用享。',
    tuanZhuan: '损，损下益上，其道上行。损而有孚，元吉无咎可贞。',
    xiangZhuan: '山下有泽，损。君子以惩忿窒欲。',
    lines: [
      { position: 1, title: '初九', text: '已事遄往，无咎，酌损之。' },
      { position: 2, title: '九二', text: '利贞，征凶，弗损益之。' },
      { position: 3, title: '六三', text: '三人行，则损一人。一人行，则得其友。' },
      { position: 4, title: '六四', text: '损其疾，使遄有喜，无咎。' },
      { position: 5, title: '六五', text: '或益之十朋之龟，弗克违，元吉。' },
      { position: 6, title: '上九', text: '弗损益之，无咎，贞吉，利有攸往，得臣无家。' },
    ]
  },
  42: {
    guaCi: '利有攸往，利涉大川。',
    tuanZhuan: '益，损上益下，民说无疆。自上下下，其道大光。利有攸往，中正有庆。',
    xiangZhuan: '风雷，益。君子以见善则迁，有过则改。',
    lines: [
      { position: 1, title: '初九', text: '利用为大作，元吉，无咎。' },
      { position: 2, title: '六二', text: '或益之十朋之龟，弗克违，永贞吉。王用享于帝，吉。' },
      { position: 3, title: '六三', text: '益之用凶事，无咎。有孚中行，告公用圭。' },
      { position: 4, title: '六四', text: '中行，告公从。利用为依迁国。' },
      { position: 5, title: '九五', text: '有孚惠心，勿问元吉。有孚惠我德。' },
      { position: 6, title: '上九', text: '莫益之，或击之，立心勿恒，凶。' },
    ]
  },
  43: {
    guaCi: '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。',
    tuanZhuan: '夬，决也，刚决柔也。健而说，决而和。扬于王庭，柔乘五刚也。',
    xiangZhuan: '泽上于天，夬。君子以施禄及下，居德则忌。',
    lines: [
      { position: 1, title: '初九', text: '壮于前趾，往不胜为咎。' },
      { position: 2, title: '九二', text: '惕号，莫夜有戎，勿恤。' },
      { position: 3, title: '九三', text: '壮于頄，有凶。君子夬夬，独行遇雨若濡，有愠，无咎。' },
      { position: 4, title: '九四', text: '臀无肤，其行次且。牵羊悔亡，闻言不信。' },
      { position: 5, title: '九五', text: '苋陆夬夬，中行无咎。' },
      { position: 6, title: '上六', text: '无号，终有凶。' },
    ]
  },
  44: {
    guaCi: '女壮，勿用取女。',
    tuanZhuan: '姤，遇也，柔遇刚也。勿用取女，不可与长也。天地相遇，品物咸章也。',
    xiangZhuan: '天下有风，姤。后以施命诰四方。',
    lines: [
      { position: 1, title: '初六', text: '系于金柅，贞吉。有攸往，见凶，羸豕孚蹢躅。' },
      { position: 2, title: '九二', text: '包有鱼，无咎，不利宾。' },
      { position: 3, title: '九三', text: '臀无肤，其行次且，厉，无大咎。' },
      { position: 4, title: '九四', text: '包无鱼，起凶。' },
      { position: 5, title: '九五', text: '以杞包瓜，含章，有陨自天。' },
      { position: 6, title: '上九', text: '姤其角，吝，无咎。' },
    ]
  },
  45: {
    guaCi: '亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。',
    tuanZhuan: '萃，聚也。顺以说，刚中而应，故聚也。王假有庙，致孝享也。',
    xiangZhuan: '泽上于地，萃。君子以除戎器，戒不虞。',
    lines: [
      { position: 1, title: '初六', text: '有孚不终，乃乱乃萃，若号一握为笑，勿恤，往无咎。' },
      { position: 2, title: '六二', text: '引吉，无咎，孚乃利用禴。' },
      { position: 3, title: '六三', text: '萃如嗟如，无攸利，往无咎，小吝。' },
      { position: 4, title: '九四', text: '大吉，无咎。' },
      { position: 5, title: '九五', text: '萃有位，无咎。匪孚，元永贞，悔亡。' },
      { position: 6, title: '上六', text: '赍咨涕洟，无咎。' },
    ]
  },
  46: {
    guaCi: '元亨，用见大人，勿恤，南征吉。',
    tuanZhuan: '柔以时升，巽而顺，刚中而应，是以大亨。用见大人勿恤，有庆也。南征吉，志行也。',
    xiangZhuan: '地中生木，升。君子以顺德，积小以高大。',
    lines: [
      { position: 1, title: '初六', text: '允升，大吉。' },
      { position: 2, title: '九二', text: '孚乃利用禴，无咎。' },
      { position: 3, title: '九三', text: '升虚邑。' },
      { position: 4, title: '六四', text: '王用亨于岐山，吉无咎。' },
      { position: 5, title: '六五', text: '贞吉，升阶。' },
      { position: 6, title: '上六', text: '冥升，利于不息之贞。' },
    ]
  },
  47: {
    guaCi: '亨，贞，大人吉，无咎。有言不信。',
    tuanZhuan: '困，刚揜也。险以说，困而不失其所亨，其唯君子乎。贞大人吉，以刚中也。',
    xiangZhuan: '泽无水，困。君子以致命遂志。',
    lines: [
      { position: 1, title: '初六', text: '臀困于株木，入于幽谷，三岁不觌。' },
      { position: 2, title: '九二', text: '困于酒食，朱绂方来，利用享祀，征凶，无咎。' },
      { position: 3, title: '六三', text: '困于石，据于蒺藜，入于其宫，不见其妻，凶。' },
      { position: 4, title: '九四', text: '来徐徐，困于金车，吝，有终。' },
      { position: 5, title: '九五', text: '劓刖，困于赤绂，乃徐有说，利用祭祀。' },
      { position: 6, title: '上六', text: '困于葛藟，于臲卼，曰动悔。有悔，征吉。' },
    ]
  },
  48: {
    guaCi: '改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。',
    tuanZhuan: '巽乎水而上水，井。井养而不穷也。改邑不改井，乃以刚中也。',
    xiangZhuan: '木上有水，井。君子以劳民劝相。',
    lines: [
      { position: 1, title: '初六', text: '井泥不食，旧井无禽。' },
      { position: 2, title: '九二', text: '井谷射鲋，瓮敝漏。' },
      { position: 3, title: '九三', text: '井渫不食，为我心恻，可用汲，王明，并受其福。' },
      { position: 4, title: '六四', text: '井甃，无咎。' },
      { position: 5, title: '九五', text: '井冽，寒泉食。' },
      { position: 6, title: '上六', text: '井收勿幕，有孚元吉。' },
    ]
  },
  49: {
    guaCi: '己日乃孚。元亨利贞，悔亡。',
    tuanZhuan: '革，水火相息，二女同居，其志不相得曰革。己日乃孚，革而信之。',
    xiangZhuan: '泽中有火，革。君子以治历明时。',
    lines: [
      { position: 1, title: '初九', text: '巩用黄牛之革。' },
      { position: 2, title: '六二', text: '己日乃革之，征吉，无咎。' },
      { position: 3, title: '九三', text: '征凶，贞厉，革言三就，有孚。' },
      { position: 4, title: '九四', text: '悔亡，有孚改命，吉。' },
      { position: 5, title: '九五', text: '大人虎变，未占有孚。' },
      { position: 6, title: '上六', text: '君子豹变，小人革面，征凶，居贞吉。' },
    ]
  },
  50: {
    guaCi: '元吉，亨。',
    tuanZhuan: '鼎，象也。以木巽火，亨饪也。圣人亨以享上帝，而大亨以养圣贤。',
    xiangZhuan: '木上有火，鼎。君子以正位凝命。',
    lines: [
      { position: 1, title: '初六', text: '鼎颠趾，利出否，得妾以其子，无咎。' },
      { position: 2, title: '九二', text: '鼎有实，我仇有疾，不我能即，吉。' },
      { position: 3, title: '九三', text: '鼎耳革，其行塞，雉膏不食，方雨亏悔，终吉。' },
      { position: 4, title: '九四', text: '鼎折足，覆公餗，其形渥，凶。' },
      { position: 5, title: '六五', text: '鼎黄耳金铉，利贞。' },
      { position: 6, title: '上九', text: '鼎玉铉，大吉，无不利。' },
    ]
  },
  51: {
    guaCi: '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。',
    tuanZhuan: '震亨。震来虩虩，恐致福也。笑言哑哑，后有则也。震惊百里，惊远而惧迩也。',
    xiangZhuan: '洊雷，震。君子以恐惧修省。',
    lines: [
      { position: 1, title: '初九', text: '震来虩虩，后笑言哑哑，吉。' },
      { position: 2, title: '六二', text: '震来厉，亿丧贝，跻于九陵，勿逐，七日得。' },
      { position: 3, title: '六三', text: '震苏苏，震行无眚。' },
      { position: 4, title: '九四', text: '震遂泥。' },
      { position: 5, title: '六五', text: '震往来厉，亿无丧，有事。' },
      { position: 6, title: '上六', text: '震索索，视矍矍，征凶。震不于其躬，于其邻，无咎。婚媾有言。' },
    ]
  },
  52: {
    guaCi: '艮其背，不获其身。行其庭，不见其人。无咎。',
    tuanZhuan: '艮，止也。时止则止，时行则行。动静不失其时，其道光明。',
    xiangZhuan: '兼山，艮。君子以思不出其位。',
    lines: [
      { position: 1, title: '初六', text: '艮其趾，无咎，利永贞。' },
      { position: 2, title: '六二', text: '艮其腓，不拯其随，其心不快。' },
      { position: 3, title: '九三', text: '艮其限，列其夤，厉薰心。' },
      { position: 4, title: '六四', text: '艮其身，无咎。' },
      { position: 5, title: '六五', text: '艮其辅，言有序，悔亡。' },
      { position: 6, title: '上九', text: '敦艮，吉。' },
    ]
  },
  53: {
    guaCi: '女归吉，利贞。',
    tuanZhuan: '渐之进也，女归吉也。进得位，往有功也。进以正，可以正邦也。',
    xiangZhuan: '山上有木，渐。君子以居贤德善俗。',
    lines: [
      { position: 1, title: '初六', text: '鸿渐于干，小子厉，有言，无咎。' },
      { position: 2, title: '六二', text: '鸿渐于磐，饮食衎衎，吉。' },
      { position: 3, title: '九三', text: '鸿渐于陆，夫征不复，妇孕不育，凶。利御寇。' },
      { position: 4, title: '六四', text: '鸿渐于木，或得其桷，无咎。' },
      { position: 5, title: '九五', text: '鸿渐于陵，妇三岁不孕，终莫之胜，吉。' },
      { position: 6, title: '上九', text: '鸿渐于逵，其羽可用为仪，吉。' },
    ]
  },
  54: {
    guaCi: '征凶，无攸利。',
    tuanZhuan: '归妹，天地之大义也。天地不交而万物不兴。归妹，人之终始也。',
    xiangZhuan: '泽上有雷，归妹。君子以永终知敝。',
    lines: [
      { position: 1, title: '初九', text: '归妹以娣，跛能履，征吉。' },
      { position: 2, title: '九二', text: '眇能视，利幽人之贞。' },
      { position: 3, title: '六三', text: '归妹以须，反归以娣。' },
      { position: 4, title: '九四', text: '归妹愆期，迟归有时。' },
      { position: 5, title: '六五', text: '帝乙归妹，其君之袂，不如其娣之袂良，月几望，吉。' },
      { position: 6, title: '上六', text: '女承筐无实，士刲羊无血，无攸利。' },
    ]
  },
  55: {
    guaCi: '亨，王假之。勿忧，宜日中。',
    tuanZhuan: '丰，大也。明以动，故丰。王假之，尚大也。勿忧宜日中，宜照天下也。',
    xiangZhuan: '雷电皆至，丰。君子以折狱致刑。',
    lines: [
      { position: 1, title: '初九', text: '遇其配主，虽旬无咎，往有尚。' },
      { position: 2, title: '六二', text: '丰其蔀，日中见斗，往得疑疾，有孚发若，吉。' },
      { position: 3, title: '九三', text: '丰其沛，日中见沫，折其右肱，无咎。' },
      { position: 4, title: '九四', text: '丰其蔀，日中见斗，遇其夷主，吉。' },
      { position: 5, title: '六五', text: '来章，有庆誉，吉。' },
      { position: 6, title: '上六', text: '丰其屋，蔀其家，窥其户，阒其无人，三岁不觌，凶。' },
    ]
  },
  56: {
    guaCi: '小亨，旅贞吉。',
    tuanZhuan: '旅小亨，柔得中乎外而顺乎刚，止而丽乎明。旅贞吉也。',
    xiangZhuan: '山上有火，旅。君子以明慎用刑而不留狱。',
    lines: [
      { position: 1, title: '初六', text: '旅琐琐，斯其所取灾。' },
      { position: 2, title: '六二', text: '旅即次，怀其资，得童仆贞。' },
      { position: 3, title: '九三', text: '旅焚其次，丧其童仆，贞厉。' },
      { position: 4, title: '九四', text: '旅于处，得其资斧，我心不快。' },
      { position: 5, title: '六五', text: '射雉一矢亡，终以誉命。' },
      { position: 6, title: '上九', text: '鸟焚其巢，旅人先笑后号咷。丧牛于易，凶。' },
    ]
  },
  57: {
    guaCi: '小亨，利有攸往，利见大人。',
    tuanZhuan: '重巽以申命。刚巽乎中正而志行，柔皆顺乎刚。',
    xiangZhuan: '随风，巽。君子以申命行事。',
    lines: [
      { position: 1, title: '初六', text: '进退，利武人之贞。' },
      { position: 2, title: '九二', text: '巽在床下，用史巫纷若，吉无咎。' },
      { position: 3, title: '九三', text: '频巽，吝。' },
      { position: 4, title: '六四', text: '悔亡，田获三品。' },
      { position: 5, title: '九五', text: '贞吉悔亡，无不利。无初有终，先庚三日，后庚三日，吉。' },
      { position: 6, title: '上九', text: '巽在床下，丧其资斧，贞凶。' },
    ]
  },
  58: {
    guaCi: '亨，利贞。',
    tuanZhuan: '兑，说也。刚中而柔外，说以利贞。是以顺乎天而应乎人。说以先民，民忘其劳。',
    xiangZhuan: '丽泽，兑。君子以朋友讲习。',
    lines: [
      { position: 1, title: '初九', text: '和兑，吉。' },
      { position: 2, title: '九二', text: '孚兑，吉，悔亡。' },
      { position: 3, title: '六三', text: '来兑，凶。' },
      { position: 4, title: '九四', text: '商兑，未宁，介疾有喜。' },
      { position: 5, title: '九五', text: '孚于剥，有厉。' },
      { position: 6, title: '上六', text: '引兑。' },
    ]
  },
  59: {
    guaCi: '亨。王假有庙，利涉大川，利贞。',
    tuanZhuan: '涣亨，刚来而不穷，柔得位乎外而上同。王假有庙，王乃在中也。',
    xiangZhuan: '风行水上，涣。先王以享于帝立庙。',
    lines: [
      { position: 1, title: '初六', text: '用拯马壮，吉。' },
      { position: 2, title: '九二', text: '涣奔其机，悔亡。' },
      { position: 3, title: '六三', text: '涣其躬，无悔。' },
      { position: 4, title: '六四', text: '涣其群，元吉。涣有丘，匪夷所思。' },
      { position: 5, title: '九五', text: '涣汗其大号，涣王居，无咎。' },
      { position: 6, title: '上九', text: '涣其血，去逖出，无咎。' },
    ]
  },
  60: {
    guaCi: '亨。苦节不可贞。',
    tuanZhuan: '节亨，刚柔分而刚得中。苦节不可贞，其道穷也。说以行险，当位以节，中正以通。',
    xiangZhuan: '泽上有水，节。君子以制数度，议德行。',
    lines: [
      { position: 1, title: '初九', text: '不出户庭，无咎。' },
      { position: 2, title: '九二', text: '不出门庭，凶。' },
      { position: 3, title: '六三', text: '不节若，则嗟若，无咎。' },
      { position: 4, title: '六四', text: '安节，亨。' },
      { position: 5, title: '九五', text: '甘节，吉。往有尚。' },
      { position: 6, title: '上六', text: '苦节，贞凶，悔亡。' },
    ]
  },
  61: {
    guaCi: '豚鱼吉。利涉大川，利贞。',
    tuanZhuan: '中孚，柔在内而刚得中，说而巽，孚乃化邦也。豚鱼吉，信及豚鱼也。',
    xiangZhuan: '泽上有风，中孚。君子以议狱缓死。',
    lines: [
      { position: 1, title: '初九', text: '虞吉，有它不燕。' },
      { position: 2, title: '九二', text: '鸣鹤在阴，其子和之，我有好爵，吾与尔靡之。' },
      { position: 3, title: '六三', text: '得敌，或鼓或罢，或泣或歌。' },
      { position: 4, title: '六四', text: '月几望，马匹亡，无咎。' },
      { position: 5, title: '九五', text: '有孚挛如，无咎。' },
      { position: 6, title: '上九', text: '翰音登于天，贞凶。' },
    ]
  },
  62: {
    guaCi: '亨，利贞。可小事不可大事。飞鸟遗之音，不宜上宜下，大吉。',
    tuanZhuan: '小过，小者过而亨也。过以利贞，与时行也。柔得中，是以小事吉也。',
    xiangZhuan: '山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭。',
    lines: [
      { position: 1, title: '初六', text: '飞鸟以凶。' },
      { position: 2, title: '六二', text: '过其祖，遇其妣。不及其君，遇其臣，无咎。' },
      { position: 3, title: '九三', text: '弗过防之，从或戕之，凶。' },
      { position: 4, title: '九四', text: '无咎，弗过遇之。往厉必戒，勿用永贞。' },
      { position: 5, title: '六五', text: '密云不雨，自我西郊，公弋取彼在穴。' },
      { position: 6, title: '上六', text: '弗遇过之，飞鸟离之，凶，是谓灾眚。' },
    ]
  },
  63: {
    guaCi: '亨小，利贞。初吉终乱。',
    tuanZhuan: '既济亨，小者亨也。利贞，刚柔正而位当也。初吉，柔得中也。终止则乱，其道穷也。',
    xiangZhuan: '水在火上，既济。君子以思患而豫防之。',
    lines: [
      { position: 1, title: '初九', text: '曳其轮，濡其尾，无咎。' },
      { position: 2, title: '六二', text: '妇丧其茀，勿逐，七日得。' },
      { position: 3, title: '九三', text: '高宗伐鬼方，三年克之，小人勿用。' },
      { position: 4, title: '六四', text: '繻有衣袽，终日戒。' },
      { position: 5, title: '九五', text: '东邻杀牛，不如西邻之禴祭，实受其福。' },
      { position: 6, title: '上六', text: '濡其首，厉。' },
    ]
  },
  64: {
    guaCi: '亨。小狐汔济，濡其尾，无攸利。',
    tuanZhuan: '未济亨，柔得中也。小狐汔济，未出中也。濡其尾无攸利，不续终也。',
    xiangZhuan: '火在水上，未济。君子以慎辨物居方。',
    lines: [
      { position: 1, title: '初六', text: '濡其尾，吝。' },
      { position: 2, title: '九二', text: '曳其轮，贞吉。' },
      { position: 3, title: '六三', text: '未济，征凶，利涉大川。' },
      { position: 4, title: '九四', text: '贞吉悔亡，震用伐鬼方，三年有赏于大国。' },
      { position: 5, title: '六五', text: '贞吉无悔，君子之光，有孚，吉。' },
      { position: 6, title: '上九', text: '有孚于饮酒，无咎，濡其首，有孚失是。' },
    ]
  },
}
