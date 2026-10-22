# Photo to Emoji

This app recognizes seven facial expressions from a webcam and displays matching emoji. A trained model is included, so the webcam app works without a dataset. `logo.png` is optional.

## Windows setup

Use Python 3.12 and run in this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe gui.py
```

The app opens an OpenCV window and requires a webcam and camera permission. Press Q to quit. If `python` opens the Microsoft Store instead of Python, use the full path to a local Python 3.12 executable to create the virtual environment.

## Optional model training

The dataset is not included in this repository. To retrain, place labeled images in `dataset/train` and `dataset/test`, with an `angry`, `disgust`, `fear`, `happy`, `neutral`, `sad`, and `surprise` subfolder in each split. Run `.\.venv\Scripts\python.exe train.py`. To improve an existing model, run `.\.venv\Scripts\python.exe train.py --resume --epochs 10`. Training may take a long time on a CPU. Restart the app to load updated model weights.
