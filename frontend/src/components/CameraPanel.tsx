import type { CameraState, Prediction } from '../types'

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  overlayRef: React.RefObject<HTMLCanvasElement | null>
  cameraState: CameraState
  prediction: Prediction | null
  live: boolean
  processing: boolean
  canSwitch: boolean
  devices: Array<{ deviceId: string; label: string }>
  selectedDeviceId: string
  message: string
  onStart: () => void
  onStop: () => void
  onCapture: () => void
  onToggleLive: () => void
  onSwitch: () => void
  onSelectDevice: (deviceId: string) => void
}

export function CameraPanel(props: Props) {
  const active = props.cameraState === 'active'
  return (
    <section className="camera-card" aria-labelledby="camera-title">
      <div className="card-heading">
        <div><span className="eyebrow">01 / LIVE INPUT</span><h2 id="camera-title">Your expression,<br />in real time.</h2></div>
        {props.live && active && <span className="live-badge"><i />LIVE</span>}
      </div>
      <div className={`camera-stage ${active ? 'is-active' : ''}`}>
        <video ref={props.videoRef} playsInline muted aria-label="Live camera preview" />
        <canvas ref={props.overlayRef} aria-hidden="true" />
        {!active && (
          <div className="camera-empty">
            <span className="focus-icon" aria-hidden="true"><i /><i /><i /><i /></span>
            <strong>{props.cameraState === 'requesting' ? 'Opening your camera…' : 'Camera is resting'}</strong>
            <p>{props.message}</p>
          </div>
        )}
        {props.processing && <div className="processing"><span />Reading expression…</div>}
      </div>
      <div className="camera-controls">
        {props.devices.length > 0 && (
          <label className="camera-select">
            <span>Camera</span>
            <select value={props.selectedDeviceId} onChange={(event) => props.onSelectDevice(event.target.value)}>
              {props.devices.map((device, index) => (
                <option value={device.deviceId} key={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>
              ))}
            </select>
          </label>
        )}
        {!active ? (
          <button className="button primary" onClick={props.onStart} disabled={props.cameraState === 'requesting'}>
            {props.cameraState === 'error' || props.cameraState === 'denied' ? 'Retry camera' : 'Start camera'}
          </button>
        ) : <button className="button quiet" onClick={props.onStop}>Stop camera</button>}
        <button className="button primary" onClick={props.onCapture} disabled={!active || props.processing}>Capture & detect</button>
        <button className={`button toggle ${props.live ? 'on' : ''}`} onClick={props.onToggleLive} disabled={!active} aria-pressed={props.live}>
          <span />Live detection {props.live ? 'on' : 'off'}
        </button>
        <button className="button icon-button" onClick={props.onSwitch} disabled={!active || !props.canSwitch} aria-label="Switch camera">↻</button>
      </div>
      <p className="privacy-note"><span>◉</span> Frames are analysed only when requested and are never stored.</p>
    </section>
  )
}
