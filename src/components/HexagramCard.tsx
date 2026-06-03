"use client";

import { NaJiaResult } from "@/lib/liuyao";
import { HEXAGRAM_LINE_TEXTS, HexagramLineText } from "@/lib/hexagram-lines";

// 八卦符号
const TRIGRAM_SYMBOLS: Record<string, string> = {
  "乾": "☰", "坤": "☷", "震": "☳", "巽": "☴",
  "坎": "☵", "离": "☲", "艮": "☶", "兑": "☱",
};

// 六十四卦完整名称
const HEXAGRAM_FULL: Record<number, { name: string; upper: string; lower: string }> = {
  1: { name: "乾为天", upper: "乾", lower: "乾" }, 2: { name: "坤为地", upper: "坤", lower: "坤" },
  3: { name: "水雷屯", upper: "坎", lower: "震" }, 4: { name: "山水蒙", upper: "艮", lower: "坎" },
  5: { name: "水天需", upper: "坎", lower: "乾" }, 6: { name: "天水讼", upper: "乾", lower: "坎" },
  7: { name: "地水师", upper: "坤", lower: "坎" }, 8: { name: "水地比", upper: "坎", lower: "坤" },
  9: { name: "风天小畜", upper: "巽", lower: "乾" }, 10: { name: "天泽履", upper: "乾", lower: "兑" },
  11: { name: "地天泰", upper: "坤", lower: "乾" }, 12: { name: "天地否", upper: "乾", lower: "坤" },
  13: { name: "天火同人", upper: "乾", lower: "离" }, 14: { name: "火天大有", upper: "离", lower: "乾" },
  15: { name: "地山谦", upper: "坤", lower: "艮" }, 16: { name: "雷地豫", upper: "震", lower: "坤" },
  17: { name: "泽雷随", upper: "兑", lower: "震" }, 18: { name: "山风蛊", upper: "艮", lower: "巽" },
  19: { name: "地泽临", upper: "坤", lower: "兑" }, 20: { name: "风地观", upper: "巽", lower: "坤" },
  21: { name: "火雷噬嗑", upper: "离", lower: "震" }, 22: { name: "山火贲", upper: "艮", lower: "离" },
  23: { name: "山地剥", upper: "艮", lower: "坤" }, 24: { name: "地雷复", upper: "坤", lower: "震" },
  25: { name: "天雷无妄", upper: "乾", lower: "震" }, 26: { name: "山天大畜", upper: "艮", lower: "乾" },
  27: { name: "山雷颐", upper: "艮", lower: "震" }, 28: { name: "泽风大过", upper: "兑", lower: "巽" },
  29: { name: "坎为水", upper: "坎", lower: "坎" }, 30: { name: "离为火", upper: "离", lower: "离" },
  31: { name: "泽山咸", upper: "兑", lower: "艮" }, 32: { name: "雷风恒", upper: "震", lower: "巽" },
  33: { name: "天山遁", upper: "乾", lower: "艮" }, 34: { name: "雷天大壮", upper: "震", lower: "乾" },
  35: { name: "火地晋", upper: "离", lower: "坤" }, 36: { name: "地火明夷", upper: "坤", lower: "离" },
  37: { name: "风火家人", upper: "巽", lower: "离" }, 38: { name: "火泽睽", upper: "离", lower: "兑" },
  39: { name: "水山蹇", upper: "坎", lower: "艮" }, 40: { name: "雷水解", upper: "震", lower: "坎" },
  41: { name: "山泽损", upper: "艮", lower: "兑" }, 42: { name: "风雷益", upper: "巽", lower: "震" },
  43: { name: "泽天夬", upper: "兑", lower: "乾" }, 44: { name: "天风姤", upper: "乾", lower: "巽" },
  45: { name: "泽地萃", upper: "兑", lower: "坤" }, 46: { name: "地风升", upper: "坤", lower: "巽" },
  47: { name: "泽水困", upper: "兑", lower: "坎" }, 48: { name: "水风井", upper: "坎", lower: "巽" },
  49: { name: "泽火革", upper: "兑", lower: "离" }, 50: { name: "火风鼎", upper: "离", lower: "巽" },
  51: { name: "震为雷", upper: "震", lower: "震" }, 52: { name: "艮为山", upper: "艮", lower: "艮" },
  53: { name: "风山渐", upper: "巽", lower: "艮" }, 54: { name: "雷泽归妹", upper: "震", lower: "兑" },
  55: { name: "雷火丰", upper: "震", lower: "离" }, 56: { name: "火山旅", upper: "离", lower: "艮" },
  57: { name: "巽为风", upper: "巽", lower: "巽" }, 58: { name: "兑为泽", upper: "兑", lower: "兑" },
  59: { name: "风水涣", upper: "巽", lower: "坎" }, 60: { name: "水泽节", upper: "坎", lower: "兑" },
  61: { name: "风泽中孚", upper: "巽", lower: "兑" }, 62: { name: "雷山小过", upper: "震", lower: "艮" },
  63: { name: "水火既济", upper: "坎", lower: "离" }, 64: { name: "火水未济", upper: "离", lower: "坎" },
};

interface HexagramCardProps {
  naJiaResult: NaJiaResult;
}

export default function HexagramCard({ naJiaResult }: HexagramCardProps) {
  const {
    hexagramId, hexagramName,
    palace, shiYao, yingYao, lines,
  } = naJiaResult;

  const hexInfo = HEXAGRAM_FULL[hexagramId];
  const fullName = hexInfo?.name || hexagramName;
  const upperTrigram = hexInfo?.upper || "";
  const lowerTrigram = hexInfo?.lower || "";
  const trigramSymbol = (TRIGRAM_SYMBOLS[upperTrigram] || "") + (TRIGRAM_SYMBOLS[lowerTrigram] || "");

  const lineData = HEXAGRAM_LINE_TEXTS[hexagramId];

  // 取卦名首字或核心字用于徽章
  const badgeChar = hexagramName.replace(/为|之/g, "").charAt(0);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #faf6ef 0%, #f5efe0 30%, #faf6ef 60%, #f0e6d2 100%)",
          boxShadow: "0 8px 32px rgba(80, 50, 20, 0.12), 0 2px 8px rgba(80, 50, 20, 0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <div className="absolute inset-1.5 rounded-2xl border border-amber-700/20 pointer-events-none" />
        <div className="absolute inset-3 rounded-2xl border pointer-events-none"
          style={{ borderStyle: "double", borderWidth: "3px", borderColor: "rgba(180, 130, 60, 0.1)" }}
        />

        <div className="relative p-5 sm:p-6 space-y-4">
          {/* ═══ 顶部：宫位 + 卦名徽章 + 序号 ═══ */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-amber-700/70 tracking-wider font-serif">{palace}宫</div>
              <div className="text-[10px] text-amber-600/60 tracking-wide font-serif mt-0.5">
                {upperTrigram}上{lowerTrigram}下
              </div>
              <div className="text-[10px] text-amber-500/50 mt-0.5 font-serif">{trigramSymbol}</div>
            </div>

            {/* 徽章 */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #d4b96a 0%, #8b6914 50%, #5c3d0e 100%)",
                  boxShadow: "0 2px 12px rgba(139, 105, 20, 0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
                }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-amber-50 font-serif leading-none"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                >
                  {badgeChar}
                </span>
              </div>
              <div className="text-[10px] text-amber-600/70 mt-1 font-serif tracking-wider">{fullName}</div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold text-amber-800/25 font-serif leading-none">{hexagramId}</div>
              <div className="text-[10px] text-amber-600/60 font-serif mt-0.5">{hexagramName}卦</div>
              <div className="text-[10px] text-amber-500/50 mt-0.5 font-serif">第{hexagramId}</div>
            </div>
          </div>

          {/* ═══ 分割线 ═══ */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-amber-400/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/30 to-amber-400/50" />
          </div>

          {/* ═══ 六爻排布 ═══ */}
          <div className="space-y-1">
            <div className="flex items-center text-[10px] text-amber-600/50 font-serif px-1">
              <span className="w-14 text-center">六兽</span>
              <span className="w-14 text-center">干支</span>
              <span className="flex-1" />
              <span className="w-16 text-center">六亲</span>
              <span className="w-10 text-center">世应</span>
            </div>

            {[...lines].reverse().map((line, idx) => {
              const pos = 6 - idx;
              const isShi = pos === shiYao;
              const isYing = pos === yingYao;

              return (
                <div key={idx} className={`
                  flex items-center gap-1 py-2 px-2 rounded-md transition-colors
                  ${isShi || isYing ? "bg-amber-100/40" : "hover:bg-amber-50/20"}
                  ${line.changing ? "ring-1 ring-red-400/20" : ""}
                `}>
                  <span className="w-14 text-center text-[11px] text-amber-700/60 font-serif">{line.liuShou}</span>
                  <span className="w-14 text-center text-xs font-serif text-stone-700">{line.naJia}{line.naZhi}</span>

                  <div className="flex-1 flex items-center justify-center">
                    {line.yinYang === "阳" ? (
                      <div className="w-14 h-1"
                        style={{ background: "linear-gradient(90deg, #8B6914, #D4A84B, #8B6914)", boxShadow: "0 0 6px rgba(139,105,20,0.15)" }}
                      />
                    ) : (
                      <div className="flex items-center gap-3.5">
                        <div className="w-4 h-1" style={{ background: "linear-gradient(90deg, #8B6914, #C49A3C)" }} />
                        <div className="w-4 h-1" style={{ background: "linear-gradient(90deg, #C49A3C, #8B6914)" }} />
                      </div>
                    )}
                    {line.changing && (
                      <span className="ml-2 text-[10px] text-red-500 font-serif bg-red-50 px-1 rounded">动</span>
                    )}
                  </div>

                  <span className="w-16 text-center text-xs font-serif text-stone-800">{line.liuQin}</span>

                  <span className="w-10 text-center">
                    {isShi && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-serif">世</span>}
                    {isYing && <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-serif">应</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ═══ 卦辞爻辞 ═══ */}
          {lineData && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-amber-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/30 to-amber-400/50" />
              </div>

              <div className="px-2 py-2 rounded-lg bg-amber-50/30 border border-amber-200/20">
                <div className="text-[10px] text-amber-600/60 font-serif mb-1 tracking-wider">卦辞</div>
                <p className="text-sm text-stone-800 leading-relaxed font-serif">{lineData.guaCi}</p>
              </div>

              {lineData.xiangZhuan && (
                <div className="px-2">
                  <p className="text-xs text-stone-500 leading-relaxed font-serif">《象》曰：{lineData.xiangZhuan}</p>
                </div>
              )}

              <div className="space-y-1.5 px-2">
                <div className="text-[10px] text-amber-600/60 font-serif tracking-wider mb-1">爻辞</div>
                {lineData.lines.map((l: HexagramLineText) => (
                  <div key={l.position} className="flex items-start gap-3 py-1 text-xs">
                    <span className="text-amber-700 font-serif whitespace-nowrap font-medium min-w-[2rem]">{l.title}</span>
                    <span className="text-stone-600 leading-relaxed font-serif">{l.text}</span>
                  </div>
                ))}
              </div>

              {lineData.tuanZhuan && (
                <div className="px-2 pt-1 pb-2 border-t border-amber-200/20 mt-3">
                  <p className="text-[11px] text-stone-400 leading-relaxed font-serif">
                    《彖》曰：{lineData.tuanZhuan.slice(0, 80)}{lineData.tuanZhuan.length > 80 ? "…" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-2 text-xs text-stone-400 tracking-widest font-serif">
        第 {hexagramId} 卦 · {fullName}
      </div>
    </div>
  );
}
