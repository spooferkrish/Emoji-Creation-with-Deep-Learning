"""HTTP API and production web server for the Emoji AI browser interface."""

from pathlib import Path
import os
import threading

import cv2
from flask import Flask, jsonify, request, send_from_directory
import numpy as np
import tensorflow as tf

from train import CLASSES, MODEL_PATH, ROOT


FRONTEND_DIST = ROOT / "frontend" / "dist"
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")

app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES

if not MODEL_PATH.is_file():
    raise RuntimeError(f"Trained model not found: {MODEL_PATH}")

model = tf.keras.models.load_model(MODEL_PATH)
detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
model_lock = threading.Lock()


@app.after_request
def add_cors_headers(response):
    if FRONTEND_ORIGIN:
        response.headers["Access-Control-Allow-Origin"] = FRONTEND_ORIGIN
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Vary"] = "Origin"
    return response


@app.get("/api/health")
def health():
    return jsonify({"status": "connected", "model": MODEL_PATH.name, "classes": CLASSES})


@app.post("/api/predict")
def predict():
    uploaded = request.files.get("image")
    if uploaded is None:
        return jsonify({"error": "No image was provided."}), 400

    encoded = np.frombuffer(uploaded.read(), dtype=np.uint8)
    frame = cv2.imdecode(encoded, cv2.IMREAD_COLOR)
    if frame is None:
        return jsonify({"error": "The uploaded image could not be decoded."}), 400

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Equalization is used only for face location. The classifier still receives
    # the original grayscale pixels it was trained on.
    detection_frame = cv2.equalizeHist(gray)
    faces = detector.detectMultiScale(
        detection_frame, scaleFactor=1.1, minNeighbors=5, minSize=(48, 48)
    )
    if len(faces) == 0:
        faces = detector.detectMultiScale(
            detection_frame, scaleFactor=1.1, minNeighbors=3, minSize=(40, 40)
        )
    if len(faces) == 0:
        return jsonify({"face_detected": False, "message": "No face detected."})

    x, y, w, h = max(faces, key=lambda face: int(face[2]) * int(face[3]))
    face = cv2.resize(gray[y:y + h, x:x + w], (48, 48))
    flipped_face = cv2.flip(face, 1)
    zoomed_face = cv2.resize(face[3:45, 3:45], (48, 48), interpolation=cv2.INTER_LINEAR)
    batch = np.stack((face, flipped_face, zoomed_face))[..., np.newaxis]
    with model_lock:
        views = model.predict(batch, verbose=0)
    probabilities = (views[0] * 0.5) + (views[1] * 0.25) + (views[2] * 0.25)
    index = int(np.argmax(probabilities))

    return jsonify({
        "face_detected": True,
        "emotion": CLASSES[index],
        "confidence": float(probabilities[index]),
        "probabilities": {
            emotion: float(probabilities[position])
            for position, emotion in enumerate(CLASSES)
        },
        "face": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
    })


@app.errorhandler(413)
def upload_too_large(_error):
    return jsonify({"error": "The captured image is too large."}), 413


@app.get("/")
def index():
    if not FRONTEND_DIST.is_dir():
        return jsonify({
            "message": "Frontend build not found. Run npm install and npm run build in frontend/."
        }), 503
    return send_from_directory(FRONTEND_DIST, "index.html")


@app.get("/<path:path>")
def frontend(path: str):
    candidate = FRONTEND_DIST / path
    if candidate.is_file():
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
