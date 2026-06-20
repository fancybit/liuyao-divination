import { NextRequest, NextResponse } from 'next/server'

function buildPrompt(original: any, changed: any | null, question: string, locale: string): string {
  const linesDesc = original.lines
    .map((l: any, i: number) => {
      const pos = ['初', '二', '三', '四', '五', '上'][i]
      return `${pos}爻：${l.naJia}${l.naZhi} 六亲${l.liuQin} 六兽${l.liuShou} ${l.shiYing || ''} ${l.yinYang}${l.changing ? '(动爻)' : ''}`
    })
    .reverse()
    .join('\n')

  let changedDesc = ''
  if (changed) {
    changedDesc = '变卦：' + changed.hexagramSymbol + ' ' + changed.hexagramName + '（' + changed.palace + '宫）'
  }

  const promptZh = `你是一位精通京房纳甲六爻的易经占卜师。请根据以下卦象数据为用户解卦。

用户问题：${question || '未具体提问'}

本卦：${original.hexagramSymbol} ${original.hexagramName}（${original.palace}宫，属${original.palaceElement}）
世爻：第${original.shiYao}爻  应爻：第${original.yingYao}爻
六爻排盘（从上到下）：
${linesDesc}
${changedDesc}
${original.changingLines.length > 0 ? '动爻：第' + original.changingLines.join('、') + '爻' : '六爻安静，无动爻'}

请从以下角度解卦：
1. 用神定位：根据用户问题确定用神（六亲），分析用神在卦中的旺衰状态
2. 世应关系：分析世爻（问卦者）与应爻（所问之事）的关系
3. 动爻分析：动爻的变化对用神的影响
4. 综合判断：给出明确、直接的吉凶结论和建议

请用中文回答，控制在300字以内，语气平实，不要空泛套话。直接给出结论，避免"仅供参考"等过度谨慎措辞。`

  const promptEn = `You are a master of the Jing Fang Najia Liuyao method of I Ching divination. Interpret the following hexagram data for the user.

User's question: ${question || 'No specific question'}

Original hexagram: ${original.hexagramSymbol} ${original.hexagramName} (${original.palace} Palace, element: ${original.palaceElement})
Self line (Shi Yao): line ${original.shiYao}  Response line (Ying Yao): line ${original.yingYao}
Six lines layout (top to bottom):
${linesDesc}
${changedDesc}
${original.changingLines.length > 0 ? 'Changing lines: ' + original.changingLines.join(', ') : 'All six lines stable, no changing lines'}

Please interpret from the following angles:
1. Yong Shen (Use God): Identify the relevant Six Relative based on the user's question, and analyze its strength and vitality in the hexagram
2. Shi-Ying relationship: Analyze the relationship between the Self line (the querent) and the Response line (the matter asked about)
3. Changing lines: How the changing lines affect the Yong Shen
4. Overall judgment: Give a clear, direct conclusion on auspiciousness or inauspiciousness, with practical advice

Answer in English, keep it under 200 words. Be direct and substantive, avoid vague platitudes. Give a clear conclusion without hedging phrases like "for reference only".`

  return locale === 'en' ? promptEn : promptZh
}

const systemZh = '你是一位精通易经六爻纳甲筮法的占卜师。你的解卦风格：直接、精准、有依据，不故弄玄虚。'
const systemEn = 'You are a master of the I Ching Liuyao Najia divination method. Your interpretation style: direct, precise, evidence-based, no mystification.'

export async function POST(req: NextRequest) {
  try {
    const { original, changed, question, locale } = await req.json()

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: locale === 'en' ? systemEn : systemZh },
          { role: 'user', content: buildPrompt(original, changed, question, locale) },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: errText }, { status: 500 })
    }

    const data = await response.json()
    const interpretation = data.choices?.[0]?.message?.content || '解卦结果为空'

    return NextResponse.json({ interpretation })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '请求失败' }, { status: 500 })
  }
}