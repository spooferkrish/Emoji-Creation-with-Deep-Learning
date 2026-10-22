import type { BackendState, CameraState } from '../types'

type Props = { backend: BackendState; camera: CameraState }

export function Header({ backend, camera }: Props) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Emoji AI home">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <span>EMOJI AI</span>
      </a>
      <p className="header-tagline">Emotion intelligence,<br />made visible.</p>
      <div className="system-status" aria-label="System status">
        <span className={`status-pill ${backend}`}><i />{backend === 'checking' ? 'Checking AI' : backend}</span>
        <span className={`status-pill ${camera}`}><i />Camera {camera === 'active' ? 'active' : 'inactive'}</span>
      </div>
    </header>
  )
}
