import { EMOTIONS, EMOTION_META } from '../emotions'
import type { Emotion, HistoryItem } from '../types'

type Props = { history: HistoryItem[]; onClear: () => void }

export function EmotionStatistics({ history, onClear }: Props) {
  const counts = EMOTIONS.reduce((result, emotion) => ({ ...result, [emotion]: 0 }), {} as Record<Emotion, number>)
  history.forEach((item) => { counts[item.emotion] += 1 })
  const mostFrequent = history.length ? EMOTIONS.reduce((a, b) => counts[a] >= counts[b] ? a : b) : null
  const average = history.length ? Math.round(history.reduce((sum, item) => sum + item.confidence, 0) / history.length * 100) : 0
  const maxCount = Math.max(...Object.values(counts), 1)
  return (
    <section className="stats-card" aria-labelledby="stats-title">
      <div className="card-heading compact">
        <div><span className="eyebrow">04 / SESSION</span><h2 id="stats-title">Emotional rhythm</h2></div>
        <button className="text-button" onClick={onClear} disabled={!history.length}>Clear</button>
      </div>
      {!history.length ? (
        <div className="stats-empty"><span>00</span><p>Your real prediction history will appear here. Nothing is invented or stored between visits.</p></div>
      ) : (
        <>
          <div className="metric-row">
            <div><span>Predictions</span><strong>{history.length}</strong></div>
            <div><span>Most frequent</span><strong>{mostFrequent ? EMOTION_META[mostFrequent].label : '—'}</strong></div>
            <div><span>Avg. confidence</span><strong>{average}%</strong></div>
          </div>
          <div className="distribution" aria-label="Emotion distribution chart">
            {EMOTIONS.map((emotion) => (
              <div className="bar-item" key={emotion}>
                <div className="bar-track"><span style={{ height: `${(counts[emotion] / maxCount) * 100}%`, background: EMOTION_META[emotion].color }} /></div>
                <small>{EMOTION_META[emotion].label.slice(0, 3)}</small>
                <b>{counts[emotion]}</b>
              </div>
            ))}
          </div>
          <div className="history-list">
            <span className="history-title">Recent detections</span>
            {history.slice(0, 5).map((item) => (
              <div key={item.id}><i style={{ background: EMOTION_META[item.emotion].color }} /><strong>{EMOTION_META[item.emotion].label}</strong><span>{Math.round(item.confidence * 100)}%</span><time>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
