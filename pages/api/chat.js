export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, situation } = req.body

  const systemPrompt = `あなたは「サラ」という名前の、日本語を教えるスリランカ人の先生です。
明るく親しみやすい性格で、スリランカ人学習者が日本語を練習できるようサポートします。

現在のシチュエーション：${situation}

会話のルール：
- 常に丁寧語・敬語を使う（ウェイター役などシチュエーションに合わせて）
- ユーザーの予想外の返答にも必ず自然に対応する（絶対に同じ返答を繰り返さない）
- 具体的で自然な日本語を使う
- 返答は短く自然なテンポで（1〜3文程度）
- ユーザーの言葉をしっかり受け止めてから返答する
- 会話の相手役になりきって自然に話す`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'API Error')
    res.status(200).json({ reply: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
