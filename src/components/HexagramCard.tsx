"use client";

import { NaJiaResult } from "@/lib/liuyao";
import { HEXAGRAM_LINE_TEXTS, HexagramLineText } from "@/lib/hexagram-lines";
import { useTranslations } from "next-intl";

const TRIGRAM_SYMBOLS: Record<string, string> = {
  "乾": "☰", "坤": "☷", "震": "☳", "巽": "☴",
  "坎": "☵", "离": "☲", "艮": "☶", "兑": "☱",
};

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
  const th = useTranslations('hexagram')
  const { hexagramId, hexagramName, palace, shiYao, yingYao, lines } = naJiaResult;
  const hexInfo = HEXAGRAM_FULL[hexagramId];
  const fullName = hexInfo?.name || hexagramName;
  const upperTrigram = hexInfo?.upper || "";
  const lowerTrigram = hexInfo?.lower || "";
  const trigramSymbol = (TRIGRAM_SYMBOLS[upperTrigram] || "") + (TRIGRAM_SYMBOLS[lowerTrigram] || "");
  const lineData = HEXAGRAM_LINE_TEXTS[hexagramId];

  const badgeChar = hexagramName.includes("为")
    ? hexagramName.charAt(0)
    : hexagramName.charAt(hexagramName.length - 1);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f0f7ff 30%, #f8fafc 60%, #e0f0fe 100%)",
          boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <div className="absolute inset-1.5 rounded-2xl border border-sky-700/15 pointer-events-none" />
        <div className="absolute inset-3 rounded-2xl border pointer-events-none"
          style={{ borderStyle: "double", borderWidth: "3px", borderColor: "rgba(100, 160, 210, 0.12)" }}
        />

        <div className="relative p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-sky-700/70 tracking-wider font-serif">{th('palace', { name: palace })}</div>
              <div className="text-[10px] text-sky-600/60 tracking-wide font-serif mt-0.5">
                {th('trigramLayout', { upper: upperTrigram, lower: lowerTrigram })}
              </div>
              <div className="text-[10px] text-sky-500/50 mt-0.5 font-serif">{trigramSymbol}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0369a1 50%, #082f49 100%)",
                  boxShadow: "0 2px 12px rgba(2, 132, 199, 0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
                }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-sky-50 font-serif leading-none"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}
                >
                  {badgeChar}
                </span>
              </div>
              <div className="text-[10px] text-sky-600/70 mt-1 font-serif tracking-wider">{fullName}</div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold text-sky-800/20 font-serif leading-none">{hexagramId}</div>
              <div className="text-[10px] text-sky-600/60 font-serif mt-0.5">{th('hexagramBadge', { name: hexagramName })}</div>
              <div className="text-[10px] text-sky-500/50 mt-0.5 font-serif">{th('ordinal', { num: hexagramId })}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/30 to-sky-400/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400/40" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400/30 to-sky-400/50" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-[10px] text-sky-600/50 font-serif px-1">
              <span className="w-14 text-center">{th('liuShou')}</span>
              <span className="w-14 text-center">{th('ganZhi')}</span>
              <span className="flex-1" />
              <span className="w-16 text-center">{th('liuQin')}</span>
              <span className="w-10 text-center">{th('shiYing')}</span>
            </div>

            {[...lines].reverse().map((line, idx) => {
              const pos = 6 - idx;
              const isShi = pos === shiYao;
              const isYing = pos === yingYao;

              return (
                <div key={idx} className={`
                  flex items-center gap-1 py-2 px-2 rounded-md transition-colors
                  ${isShi || isYing ? "bg-sky-100/40" : "hover:bg-sky-50/20"}
                  ${line.changing ? "ring-1 ring-red-400/20" : ""}
                `}>
                  <span className="w-14 text-center text-[11px] text-sky-700/60 font-serif">{line.liuShou}</span>
                  <span className="w-14 text-center text-xs font-serif text-slate-700">{line.naJia}{line.naZhi}</span>

                  <div className="flex-1 flex items-center justify-center">
                    {line.yinYang === "阳" ? (
                      <div className="w-14 h-1"
                        style={{ background: "linear-gradient(90deg, #0369a1, #38bdf8, #0369a1)", boxShadow: "0 0 6px rgba(2,132,199,0.12)" }}
                      />
                    ) : (
                      <div className="flex items-center gap-3.5">
                        <div className="w-4 h-1" style={{ background: "linear-gradient(90deg, #0369a1, #0ea5e9)" }} />
                        <div className="w-4 h-1" style={{ background: "linear-gradient(90deg, #0ea5e9, #0369a1)" }} />
                      </div>
                    )}
                    {line.changing && (
                      <span className="ml-2 text-[10px] text-red-500 font-serif bg-red-50 px-1 rounded">{th('dong')}</span>
                    )}
                  </div>

                  <span className="w-16 text-center text-xs font-serif text-slate-800">{line.liuQin}</span>

                  <span className="w-10 text-center">
                    {isShi && <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded font-serif">{th('shi')}</span>}
                    {isYing && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-serif">{th('ying')}</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {lineData && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/30 to-sky-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400/40" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400/30 to-sky-400/50" />
              </div>

              <div className="px-2 py-2 rounded-lg bg-sky-50/30 border border-sky-200/20">
                <div className="text-[10px] text-sky-600/60 font-serif mb-1 tracking-wider">{th('guaCi')}</div>
                <p className="text-sm text-slate-800 leading-relaxed font-serif">{lineData.guaCi}</p>
              </div>

              {lineData.xiangZhuan && (
                <div className="px-2">
                  <p className="text-xs text-slate-500 leading-relaxed font-serif">《{th('xiangZhuan')}》曰：{lineData.xiangZhuan}</p>
                </div>
              )}

              <div className="space-y-1.5 px-2">
                <div className="text-[10px] text-sky-600/60 font-serif tracking-wider mb-1">{th('yaoCi')}</div>
                {lineData.lines.map((l: HexagramLineText) => (
                  <div key={l.position} className="flex items-start gap-3 py-1 text-xs">
                    <span className="text-sky-700 font-serif whitespace-nowrap font-medium min-w-[2rem]">{l.title}</span>
                    <span className="text-slate-600 leading-relaxed font-serif">{l.text}</span>
                  </div>
                ))}
              </div>

              {lineData.tuanZhuan && (
                <div className="px-2 pt-1 pb-2 border-t border-sky-200/20 mt-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-serif">
                    《{th('tuanZhuan')}》曰：{lineData.tuanZhuan.slice(0, 80)}{lineData.tuanZhuan.length > 80 ? "…" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-2 text-xs text-slate-400 tracking-widest font-serif">
        {th('footer', { id: hexagramId, name: fullName })}
      </div>
    </div>
  );
}
