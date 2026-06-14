export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { conversation, situation } = req.body

  const prompt = `以下は日本語会話練習のやりとりです（シチュエーション：${situation}）。
スリランカ人学習者向けに、シンハラ語でフィードバックをしてください。

以下のフォーマットで返答してください：
【日本語評価】
（2〜3行で評価）
---SINHALA---
（上記と同じ内容をシンハラ語で書いてください）

評価ポイント：
- 自然な日本語が使えていたか
- 敬語・丁寧語の使い方
- 会話の流れへの対応力
- 改善点があれば具体的に

会話履歴：
${conversation}`

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
        max_tokens: 1000,
        system: 'あなたは日本語教師です。指定されたフォーマットで必ずフィードバックしてください。',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'API Error')
    res.status(200).json({ feedback: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
