# EMOJI AI — Real-Time Emotion Recognition

EMOJI AI recognizes seven facial expressions from a browser webcam and matches the result to an expressive avatar. A trained TensorFlow model is included. The web UI reports actual model output, confidence, recent detections, and session statistics without recording video or inventing sample results.

## Run the browser app on Windows

Use Python 3.12 and run in this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
cd frontend
npm install
npm run build
cd ..
.\.venv\Scripts\python.exe web_app.py
```

Open `http://127.0.0.1:5000`, then select **Start camera**. The camera is requested only after that click, audio is never requested, and frames are not stored. If `python` opens the Microsoft Store, use the full path to your local Python 3.12 executable.

### Frontend development

Run the backend with `web_app.py`, then run `npm run dev` inside `frontend`. Vite proxies `/api` requests to `http://127.0.0.1:5000`. Set `VITE_API_URL` only when the API is hosted somewhere else. For a cross-origin deployment, set `FRONTEND_ORIGIN` on the backend to the exact frontend origin.

The original OpenCV desktop interface is still available with `.\.venv\Scripts\python.exe gui.py`.

## Optional model training

The dataset is not included in this repository. To retrain, place labeled images in `dataset/train` and `dataset/test`, with an `angry`, `disgust`, `fear`, `happy`, `neutral`, `sad`, and `surprise` subfolder in each split. Run `.\.venv\Scripts\python.exe train.py`. To improve an existing model, run `.\.venv\Scripts\python.exe train.py --resume --epochs 10`. Training may take a long time on a CPU. Restart the app to load updated model weights.
