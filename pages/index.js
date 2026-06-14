import { useState, useRef, useEffect } from 'react'
import SaraCharacter from '../components/SaraCharacter'
import styles from '../styles/Home.module.css'

const SITUATIONS = [
  { id: 'restaurant', label: 'レストラン', emoji: '🍷', description: 'サラ先生がウェイター役。食事の注文を練習しよう！', starter: 'こんにちは！本日はご来店いただきありがとうございます。赤ワインと白ワイン、どちらがよろしいでしょうか？' },
  { id: 'convenience', label: 'コンビニ', emoji: '🏪', description: 'コンビニでの買い物を練習しよう！', starter: 'いらっしゃいませ！本日はどのようなものをお探しでしょうか？' },
  { id: 'station', label: '駅・電車', emoji: '🚉', description: '駅での案内や切符購入を練習しよう！', starter: 'いらっしゃいませ。どちらまでいらっしゃいますか？' },
  { id: 'hospital', label: '病院', emoji: '🏥', description: '病院での受付・診察を練習しよう！', starter: 'こんにちは。本日はどのような症状でいらっしゃいましたか？' },
]

export default function Home() {
  const [phase, setPhase] = useState('select') // select | chat | feedback
  const [selectedSituation, setSelectedSituation] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [rallyCount, setRallyCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [feedback, setFeedback] = useState({ jp: '', si: '' })
  const [isRecording, setIsRecording] = useState(false)
  const chatRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const MAX_RALLY = 5

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const startSituation = async (situation) => {
    setSelectedSituation(situation)
    setPhase('chat')
    setMessages([])
    setRallyCount(0)
    setIsLoading(true)
    setIsTalking(true)

    const aiMessages = [{ role: 'user', content: 'はじめてください' }]
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiMessages, situation: situation.description })
    })
    const data = await res.json()
    const reply = data.reply || situation.starter

    setMessages([{ role: 'assistant', content: reply }])
    setIsLoading(false)
    setTimeout(() => setIsTalking(false), 2000)
  }

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading || rallyCount >= MAX_RALLY) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setRallyCount(prev => prev + 1)
    setIsLoading(true)

    const apiMessages = newMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))

    if (rallyCount + 1 >= MAX_RALLY) {
      // Last rally - get AI reply then feedback
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, situation: selectedSituation.description })
      })
      const data = await res.json()
      const reply = data.reply || 'ありがとうございました！'
      const finalMessages = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(finalMessages)
      setIsTalking(true)
      setTimeout(() => setIsTalking(false), 2000)
      setIsLoading(false)
      await getFeedback(finalMessages)
      return
    }

    setIsTalking(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, situation: selectedSituation.description })
    })
    const data = await res.json()
    const reply = data.reply || 'なるほどですね。'
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setIsLoading(false)
    setTimeout(() => setIsTalking(false), 2000)
  }

  const getFeedback = async (msgs) => {
    setPhase('feedback')
    const conv = msgs.map(m => (m.role === 'user' ? 'あなた: ' : 'サラ先生: ') + m.content).join('\n')
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conv, situation: selectedSituation.label })
    })
    const data = await res.json()
    const parts = (data.feedback || '').split('---SINHALA---')
    setFeedback({
      jp: parts[0]?.replace('【日本語評価】', '').trim() || '',
      si: parts[1]?.trim() || ''
    })
  }

  const speakSinhala = () => {
    if (!feedback.si) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(feedback.si)
    utter.lang = 'si-LK'
    utter.rate = 0.85
    window.speechSynthesis.speak(utter)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = e => audioChunksRef.current.push(e.data)
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(t => t.stop())
        // Transcribe via Whisper
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.webm')
        formData.append('model', 'whisper-1')
        formData.append('language', 'ja')
        try {
          const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}` },
            body: formData
          })
          const data = await res.json()
          if (data.text) sendMessage(data.text)
        } catch (e) {
          console.error('Whisper error:', e)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (e) {
      alert('マイクへのアクセスを許可してください')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const reset = () => {
    setPhase('select')
    setSelectedSituation(null)
    setMessages([])
    setRallyCount(0)
    setFeedback({ jp: '', si: '' })
    setIsTalking(false)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.logo}>🇱🇰 日本語練習</span>
        {phase !== 'select' && (
          <button className={styles.backBtn} onClick={reset}>← 戻る</button>
        )}
      </header>

      {/* SELECT PHASE */}
      {phase === 'select' && (
        <div className={styles.selectPhase}>
          <div className={styles.heroSection}>
            <SaraCharacter isTalking={false} />
            <div className={styles.heroText}>
              <h1>サラ先生と<br />日本語を練習しよう！</h1>
              <p>シチュエーションを選んで<br />会話を始めましょう</p>
            </div>
          </div>
          <div className={styles.situationGrid}>
            {SITUATIONS.map(s => (
              <button key={s.id} className={styles.situationCard} onClick={() => startSituation(s)}>
                <span className={styles.situationEmoji}>{s.emoji}</span>
                <span className={styles.situationLabel}>{s.label}</span>
                <span className={styles.situationDesc}>{s.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT PHASE */}
      {phase === 'chat' && (
        <div className={styles.chatPhase}>
          <div className={styles.characterSection}>
            <SaraCharacter isTalking={isTalking || isLoading} />
            <div className={styles.characterName}>サラ先生</div>
            <div className={styles.situationBadge}>{selectedSituation?.emoji} {selectedSituation?.label}</div>
          </div>

          {/* Rally bar */}
          <div className={styles.rallyBar}>
            {Array.from({ length: MAX_RALLY }).map((_, i) => (
              <div key={i} className={`${styles.rallyDot} ${i < rallyCount ? styles.done : i === rallyCount ? styles.active : ''}`} />
            ))}
            <span className={styles.rallyLabel}>{rallyCount} / {MAX_RALLY}</span>
          </div>

          {/* Chat messages */}
          <div className={styles.chatMessages} ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                {m.role === 'assistant' && <div className={styles.aiAvatar}>サラ</div>}
                <div className={`${styles.bubble} ${m.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.msg} ${styles.aiMsg}`}>
                <div className={styles.aiAvatar}>サラ</div>
                <div className={`${styles.bubble} ${styles.aiBubble}`}>
                  <span className={styles.dot1}>●</span>
                  <span className={styles.dot2}>●</span>
                  <span className={styles.dot3}>●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          {rallyCount < MAX_RALLY && (
            <div className={styles.inputArea}>
              <input
                className={styles.textInput}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="日本語で返事を入力..."
                disabled={isLoading}
              />
              <button
                className={styles.sendBtn}
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
              >送信</button>
              <button
                className={`${styles.micBtn} ${isRecording ? styles.recording : ''}`}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isLoading}
              >
                {isRecording ? '🔴' : '🎤'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK PHASE */}
      {phase === 'feedback' && (
        <div className={styles.feedbackPhase}>
          <div className={styles.feedbackHeader}>
            <SaraCharacter isTalking={false} />
            <h2>会話お疲れ様でした！</h2>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.feedbackTitle}>📝 日本語フィードバック</div>
            <div className={styles.feedbackJp}>{feedback.jp || 'フィードバックを生成中...'}</div>
          </div>

          {feedback.si && (
            <div className={`${styles.feedbackCard} ${styles.sinhalaCard}`}>
              <div className={styles.feedbackTitle}>🇱🇰 සිංහල ප්‍රතිපෝෂය</div>
              <div className={styles.feedbackSi}>{feedback.si}</div>
              <button className={styles.speakBtn} onClick={speakSinhala}>
                🔊 シンハラ語で読み上げ
              </button>
            </div>
          )}

          <button className={styles.retryBtn} onClick={reset}>
            もう一度練習する
          </button>
        </div>
      )}
    </div>
  )
}
