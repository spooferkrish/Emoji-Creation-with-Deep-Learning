import { EMOTION_META } from '../emotions'
import type { BackendState, Prediction } from '../types'

type Props = { prediction: Prediction | null; backend: BackendState; processing: boolean; noFace: boolean }

export function EmotionResult({ prediction, backend, processing, noFace }: Props) {
  const confidence = prediction ? Math.round(prediction.confidence * 100) : 0
  return (
    <section className="result-card" aria-labelledby="result-title">
      <div className="card-heading compact">
        <div><span className="eyebrow">02 / AI READ</span><h2 id="result-title">Emotion signal</h2></div>
        <span className={`signal-dot ${backend}`} title={`Backend ${backend}`} />
      </div>
      {prediction ? (
        <div className="result-content">
          <span className="result-kicker">Current expression</span>
          <strong className="emotion-name">{EMOTION_META[prediction.emotion].label}</strong>
          <p>{EMOTION_META[prediction.emotion].description}</p>
          <div className="confidence-row"><span>Model confidence</span><b>{confidence}%</b></div>
          <div className="confidence-track"><span style={{ width: `${confidence}%` }} /></div>
          <time>Updated {prediction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>
        </div>
      ) : (
        <div className="result-empty">
          <span className="radar" />
          <strong>{processing ? 'Reading your expression…' : noFace ? 'No face detected' : backend === 'disconnected' ? 'AI backend unavailable' : 'Waiting for your expression'}</strong>
          <p>{noFace ? 'Face the camera in even light and try again.' : 'Start the camera, then capture a frame or enable live detection.'}</p>
        </div>
      )}
    </section>
  )
}
