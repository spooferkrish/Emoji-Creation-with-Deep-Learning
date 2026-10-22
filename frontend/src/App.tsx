import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AvatarCreator } from './components/AvatarCreator'
import { CameraPanel } from './components/CameraPanel'
import { EmotionResult } from './components/EmotionResult'
import { EmotionStatistics } from './components/EmotionStatistics'
import { Header } from './components/Header'
import type { ApiResponse, BackendState, CameraState, Emotion, HistoryItem, Prediction } from './types'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const LIVE_INTERVAL_MS = 1600

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const captureCanvas = useRef(document.createElement('canvas'))
  const streamRef = useRef<MediaStream | null>(null)
  const detectingRef = useRef(false)
  const liveTimerRef = useRef<number | null>(null)
  const facingModeRef = useRef<'user' | 'environment'>('user')

  const [backend, setBackend] = useState<BackendState>('checking')
  const [camera, setCamera] = useState<CameraState>('idle')
  const [cameraMessage, setCameraMessage] = useState('Your camera starts only after you choose to begin.')
  const [processing, setProcessing] = useState(false)
  const [live, setLive] = useState(false)
  const [canSwitch, setCanSwitch] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [noFace, setNoFace] = useState(false)
  const [manualAvatar, setManualAvatar] = useState<Emotion | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const checkBackend = useCallback(async () => {
    setBackend('checking')
    try {
      const response = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(8000) })
      if (!response.ok) throw new Error('Backend did not respond')
      setBackend('connected')
    } catch {
      setBackend('disconnected')
    }
  }, [])

  useEffect(() => { checkBackend() }, [checkBackend])

  const clearOverlay = () => {
    const canvas = overlayRef.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawFace = (face?: Prediction['face']) => {
    const canvas = overlayRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    canvas.width = video.clientWidth
    canvas.height = video.clientHeight
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!face || !video.videoWidth || !video.videoHeight) return
    const scaleX = canvas.width / video.videoWidth
    const scaleY = canvas.height / video.videoHeight
    context.strokeStyle = '#d9ff57'
    context.lineWidth = 2
    context.setLineDash([8, 6])
    context.strokeRect(face.x * scaleX, face.y * scaleY, face.width * scaleX, face.height * scaleY)
  }

  const stopCamera = useCallback(() => {
    if (liveTimerRef.current) window.clearInterval(liveTimerRef.current)
    liveTimerRef.current = null
    setLive(false)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    clearOverlay()
    setCamera('idle')
    setCameraMessage('Camera stopped. Start it whenever you are ready.')
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('error')
      setCameraMessage('This browser does not support camera access.')
      return
    }
    setCamera('requesting')
    setCameraMessage('Approve camera access in your browser to continue.')
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingModeRef.current, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      const devices = await navigator.mediaDevices.enumerateDevices()
      setCanSwitch(devices.filter((device) => device.kind === 'videoinput').length > 1)
      setCamera('active')
      setCameraMessage('Camera active.')
      setNotice('Camera ready')
    } catch (error) {
      const denied = error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
      setCamera(denied ? 'denied' : 'error')
      setCameraMessage(denied ? 'Camera permission was denied. Allow access in browser settings, then retry.' : 'The camera could not start. Close other camera apps and retry.')
    }
  }

  const switchCamera = async () => {
    facingModeRef.current = facingModeRef.current === 'user' ? 'environment' : 'user'
    await startCamera()
  }

  const detect = useCallback(async () => {
    const video = videoRef.current
    if (!video || !streamRef.current || detectingRef.current || video.readyState < 2) return
    detectingRef.current = true
    setProcessing(true)
    setNoFace(false)
    const canvas = captureCanvas.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86))
      if (!blob) throw new Error('Could not capture frame')
      const body = new FormData()
      body.append('image', blob, 'camera-frame.jpg')
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST', body, signal: AbortSignal.timeout(12000),
      })
      const result = await response.json() as ApiResponse
      if (!response.ok || result.error) throw new Error(result.error || 'Prediction failed')
      setBackend('connected')
      if (!result.face_detected || !result.emotion || result.confidence === undefined || !result.probabilities) {
        setNoFace(true)
        clearOverlay()
        return
      }
      const next: Prediction = {
        emotion: result.emotion,
        confidence: result.confidence,
        probabilities: result.probabilities,
        face: result.face,
        timestamp: new Date(),
      }
      setPrediction(next)
      setHistory((current) => [{ ...next, id: crypto.randomUUID() }, ...current].slice(0, 100))
      setManualAvatar(null)
      drawFace(next.face)
    } catch (error) {
      setBackend('disconnected')
      setNotice(error instanceof DOMException && error.name === 'TimeoutError' ? 'Inference timed out. Try again.' : 'Could not reach the AI model.')
    } finally {
      detectingRef.current = false
      setProcessing(false)
    }
  }, [])

  const toggleLive = () => setLive((current) => !current)

  useEffect(() => {
    if (live && camera === 'active') {
      detect()
      liveTimerRef.current = window.setInterval(detect, LIVE_INTERVAL_MS)
    } else if (liveTimerRef.current) {
      window.clearInterval(liveTimerRef.current)
      liveTimerRef.current = null
    }
    return () => {
      if (liveTimerRef.current) window.clearInterval(liveTimerRef.current)
      liveTimerRef.current = null
    }
  }, [live, camera, detect])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const displayedAvatar = manualAvatar || prediction?.emotion || 'neutral'
  const currentEmotion = useMemo(() => prediction?.emotion || null, [prediction])

  return (
    <div id="top" className="app-shell">
      <Header backend={backend} camera={camera} />
      <main>
        <section className="hero">
          <div className="hero-art hero-art-left" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="hero-copy">
            <span className="sun-symbol" aria-hidden="true" />
            <p>REAL-TIME EMOTION INTELLIGENCE</p>
            <h1>FEEL IT.<br />SEE IT.<br /><em>CREATE IT.</em></h1>
            <div className="hero-note"><i />Your expression becomes a living avatar—private, immediate, and uniquely yours.</div>
            <a href="#studio" className="scroll-cue" aria-label="Go to studio">↓</a>
          </div>
          <div className="hero-art hero-art-right" aria-hidden="true"><div className="mini-face"><i /><i /><b /></div></div>
        </section>

        <section id="studio" className="studio-intro">
          <span className="eyebrow">THE EMOTION STUDIO</span>
          <h2>One face.<br />Seven expressions.</h2>
          <p>Let the trained FER2013 model read a captured frame, then watch your avatar and session data respond.</p>
        </section>

        <div className="dashboard-grid">
          <CameraPanel videoRef={videoRef} overlayRef={overlayRef} cameraState={camera} prediction={prediction} live={live} processing={processing} canSwitch={canSwitch} message={cameraMessage} onStart={startCamera} onStop={stopCamera} onCapture={detect} onToggleLive={toggleLive} onSwitch={switchCamera} />
          <div className="dashboard-side"><EmotionResult prediction={prediction} backend={backend} processing={processing} noFace={noFace} /><AvatarCreator predicted={currentEmotion} displayed={displayedAvatar} manual={manualAvatar !== null} galleryOpen={galleryOpen} onSelect={setManualAvatar} onReset={() => setManualAvatar(null)} onToggleGallery={() => setGalleryOpen((open) => !open)} /></div>
          <EmotionStatistics history={history} onClear={() => { setHistory([]); setNotice('Session statistics cleared') }} />
        </div>

        <section className="how-it-works">
          <span className="eyebrow">A QUIET KIND OF AI</span>
          <h2>Nothing recorded.<br />Nothing imagined.</h2>
          <div className="steps">
            <article><span>01</span><h3>Open</h3><p>You decide when the browser can use your camera. Audio is never requested.</p></article>
            <article><span>02</span><h3>Read</h3><p>Selected frames go to your local trained model. Requests never overlap.</p></article>
            <article><span>03</span><h3>Express</h3><p>The real result updates your avatar, confidence, and in-session statistics.</p></article>
          </div>
        </section>
      </main>
      <footer><span className="brand"><span className="brand-mark"><i /><i /></span>EMOJI AI</span><p>Built around your trained emotion model.</p><a href="#top">Back to top ↑</a></footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}
