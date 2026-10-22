export type Emotion = 'angry' | 'disgust' | 'fear' | 'happy' | 'neutral' | 'sad' | 'surprise'

export type Prediction = {
  emotion: Emotion
  confidence: number
  timestamp: Date
  face?: { x: number; y: number; width: number; height: number }
  probabilities: Record<Emotion, number>
}

export type HistoryItem = Prediction & { id: string }

export type ApiResponse = {
  face_detected: boolean
  emotion?: Emotion
  confidence?: number
  probabilities?: Record<Emotion, number>
  face?: Prediction['face']
  message?: string
  error?: string
}

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'error'
export type BackendState = 'checking' | 'connected' | 'disconnected'
