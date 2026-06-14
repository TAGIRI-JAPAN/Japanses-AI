# 日本語会話練習アプリ

サラ先生と日本語を練習しよう！スリランカ人向け日本語学習アプリ。

## 機能
- AIキャラクター「サラ先生」との日本語会話練習
- 4つのシチュエーション（レストラン・コンビニ・駅・病院）
- 5ラリーの会話後にシンハラ語でフィードバック
- 音声入力対応（Whisper API）
- シンハラ語音声読み上げ

## セットアップ

### 環境変数
Vercelのダッシュボードで以下を設定：

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

## 技術スタック
- Next.js 14
- Claude API (claude-sonnet-4-6)
- OpenAI Whisper API
- Google Cloud TTS（シンハラ語音声）
