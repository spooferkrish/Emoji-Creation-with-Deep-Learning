import angry from '../../emojis/angry.png'
import disgust from '../../emojis/disgusted.png'
import fear from '../../emojis/fearful.png'
import happy from '../../emojis/happy.png'
import neutral from '../../emojis/neutral.png'
import sad from '../../emojis/sad.png'
import surprise from '../../emojis/surpriced.png'
import type { Emotion } from './types'

export const EMOTIONS: Emotion[] = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']

export const EMOTION_META: Record<Emotion, { label: string; image: string; color: string; description: string }> = {
  happy: { label: 'Happy', image: happy, color: '#ffe66d', description: 'Bright and joyful' },
  sad: { label: 'Sad', image: sad, color: '#7bc8f6', description: 'Soft and reflective' },
  angry: { label: 'Angry', image: angry, color: '#ff6b6b', description: 'Strong and intense' },
  fear: { label: 'Fear', image: fear, color: '#ad8bff', description: 'Alert and worried' },
  surprise: { label: 'Surprise', image: surprise, color: '#ffb86b', description: 'Wide-eyed and amazed' },
  disgust: { label: 'Disgust', image: disgust, color: '#8bd450', description: 'Uneasy and displeased' },
  neutral: { label: 'Neutral', image: neutral, color: '#d6ded8', description: 'Calm and composed' },
}
