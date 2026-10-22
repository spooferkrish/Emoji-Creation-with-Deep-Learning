"""Show webcam expressions and matching emoji in an OpenCV window."""
import cv2
import numpy as np
import tensorflow as tf
from train import CLASSES, MODEL_PATH, ROOT

EMOJI_FILES = ("angry.png", "disgusted.png", "fearful.png", "happy.png",
               "neutral.png", "sad.png", "surpriced.png")

def main():
    if not MODEL_PATH.is_file():
        raise SystemExit(f"Model missing: {MODEL_PATH}\nRun python train.py first.")
    model = tf.keras.models.load_model(MODEL_PATH)
    cascade = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    detector = cv2.CascadeClassifier(cascade)
    if detector.empty():
        raise SystemExit(f"Face detector missing: {cascade}")
    emojis = []
    for filename in EMOJI_FILES:
        path = ROOT / "emojis" / filename
        emoji = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
        if emoji is None:
            raise SystemExit(f"Emoji image missing: {path}")
        if emoji.shape[2] == 4:
            emoji = cv2.cvtColor(emoji, cv2.COLOR_BGRA2BGR)
        emojis.append(cv2.resize(emoji, (180, 180)))
    logo = cv2.imread(str(ROOT / "logo.png")) if (ROOT / "logo.png").is_file() else None
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        camera.release()
        raise SystemExit("Cannot open webcam 0. Check camera permissions.")
    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                raise SystemExit("The webcam stopped returning frames.")
            frame = cv2.resize(frame, (600, 450))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = detector.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
            side = np.zeros((450, 250, 3), dtype=np.uint8)
            if logo is not None:
                h = min(90, logo.shape[0])
                w = min(230, logo.shape[1])
                side[5:5+h, 10:10+w] = cv2.resize(logo, (w, h))
            else:
                cv2.putText(side, "Photo to Emoji", (12, 45),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            if len(faces):
                x, y, w, h = max(faces, key=lambda face: face[2] * face[3])
                face = cv2.resize(gray[y:y+h, x:x+w], (48, 48))
                batch = face[np.newaxis, :, :, np.newaxis]
                index = int(np.argmax(model.predict(batch, verbose=0)[0]))
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                cv2.putText(side, CLASSES[index].capitalize(), (20, 135),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.85, (255, 255, 255), 2)
                side[160:340, 35:215] = emojis[index]
            else:
                cv2.putText(side, "Looking for a face", (12, 135),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            cv2.putText(side, "Press Q to quit", (25, 420),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 180, 180), 1)
            cv2.imshow("Photo to Emoji", np.hstack((frame, side)))
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        camera.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
