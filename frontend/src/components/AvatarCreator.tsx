import { EMOTIONS, EMOTION_META } from '../emotions'
import type { Emotion } from '../types'

type Props = {
  predicted: Emotion | null
  displayed: Emotion
  manual: boolean
  galleryOpen: boolean
  onSelect: (emotion: Emotion) => void
  onReset: () => void
  onToggleGallery: () => void
}

export function AvatarCreator(props: Props) {
  const meta = EMOTION_META[props.displayed]
  const download = () => {
    const link = document.createElement('a')
    link.href = meta.image
    link.download = `emoji-ai-${props.displayed}.png`
    link.click()
  }
  return (
    <section className="avatar-card" aria-labelledby="avatar-title">
      <div className="card-heading compact">
        <div><span className="eyebrow">03 / AVATAR</span><h2 id="avatar-title">Your current expression</h2></div>
        <span className={props.manual ? 'mode manual' : 'mode'}>{props.manual ? 'Manual preview' : 'AI matched'}</span>
      </div>
      <div className="avatar-display" style={{ '--emotion-color': meta.color } as React.CSSProperties}>
        <div className="avatar-orbit"><i /><i /><i /></div>
        <img key={props.displayed} src={meta.image} alt={`${meta.label} emoji avatar`} />
        <strong>{meta.label}</strong>
      </div>
      <div className="avatar-actions">
        <button className="text-button" onClick={props.onToggleGallery}>{props.galleryOpen ? 'Hide expressions' : 'View all expressions'} <span>↗</span></button>
        <button className="button quiet" onClick={props.onReset} disabled={!props.manual && !props.predicted}>Reset avatar</button>
        <button className="button primary" onClick={download}>Download PNG</button>
      </div>
      {props.galleryOpen && (
        <div className="expression-grid">
          {EMOTIONS.map((emotion) => (
            <button key={emotion} className={emotion === props.displayed ? 'selected' : ''} onClick={() => props.onSelect(emotion)}>
              <img src={EMOTION_META[emotion].image} alt="" /><span>{EMOTION_META[emotion].label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
