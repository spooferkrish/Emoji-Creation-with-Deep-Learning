# 🎭 Real-Time Emoji Creation Using Deep Learning

### Facial Emotion Recognition Using CNN, OpenCV & FER2013

![Python](https://img.shields.io/badge/Python-3.x-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Deep%20Learning-orange)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-green)
![Google Colab](https://img.shields.io/badge/Google%20Colab-Notebook-yellow)
![License](https://img.shields.io/badge/License-Not%20Specified-lightgrey)

## 📌 Project Overview

**Real-Time Emoji Creation Using Deep Learning** is an AI-powered facial emotion recognition project that aims to identify human facial expressions and map them to corresponding emojis or avatars.

The system uses a **Convolutional Neural Network (CNN)** trained on the **FER2013 (Facial Expression Recognition 2013)** dataset to classify facial expressions into seven emotion categories.

OpenCV's Haar Cascade classifier is used for face detection, while the trained CNN predicts the facial expression from the detected face.

Based on the predicted emotion, the system displays a corresponding emoji.

This project demonstrates the practical application of **Deep Learning, Machine Learning, Artificial Intelligence, and Computer Vision** in real-time human-computer interaction.

## 🎯 Project Objectives

- Develop a CNN-based facial emotion recognition model.
- Train the model using the FER2013 dataset.
- Detect human faces using OpenCV Haar Cascade.
- Classify facial expressions into seven emotion categories.
- Map predicted emotions to corresponding emojis.
- Support facial emotion recognition from webcam frames.
- Demonstrate real-world applications of computer vision and deep learning.

## 😊 Supported Emotions

The model is designed to classify the following seven facial expressions:

| Emotion | Emoji |
|---|---|
| Happy | 😄 |
| Sad | 😢 |
| Angry | 😠 |
| Surprise | 😲 |
| Fear | 😨 |
| Disgust | 🤢 |
| Neutral | 😐 |

These labels represent predicted facial expressions rather than definitive measurements of a person's internal emotional state.

## 🧠 Technologies Used

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| TensorFlow / Keras | CNN model development and training |
| OpenCV | Image processing and face detection |
| Haar Cascade | Detecting human faces |
| NumPy | Numerical operations |
| Pandas | Dataset processing |
| Matplotlib | Training result visualization |
| Google Colab | Cloud-based model development and training |
| Google Drive | Dataset storage and access |
| FER2013 | Facial expression recognition dataset |

*Note: Adjust the library list to match the actual dependencies used in your implementation.*

## 📂 Dataset — FER2013

The project uses the **Facial Expression Recognition 2013 (FER2013)**

### Dataset Information

- **Dataset:** FER2013
- **Total Images:** 35,887
- **Image Resolution:** 48 × 48 pixels
- **Image Format:** Grayscale
- **Emotion Categories:** 7
- **Task:** Facial Expression Classification

### 📥 Download Dataset from Google Drive

The dataset used in this project is stored in Google Drive.

**Google Drive Dataset Link:**

[📁 Download FER2013 Dataset](YOUR_GOOGLE_DRIVE_DATASET_LINK_HERE)

> Replace `YOUR_GOOGLE_DRIVE_DATASET_LINK_HERE` with the actual Google Drive sharing URL.

### Accessing the Dataset in Google Colab

**Step 1 — Mount Google Drive**

```python
from google.colab import drive
drive.mount('/content/drive')
```

**Step 2 — Specify Dataset Location**

```python
dataset_path = "/content/drive/MyDrive/FER2013/"
```

Update the path according to the actual location of your dataset.

If the dataset is shared through a Google Drive download link rather than stored in your own Drive, you can use `gdown` for a publicly accessible file:

```python
!pip install gdown
```

```python
import gdown

dataset_url = "YOUR_GOOGLE_DRIVE_DATASET_LINK_HERE"

gdown.download(
    url=dataset_url,
    output="fer2013_dataset.zip",
    fuzzy=True
)
```

If the downloaded file is a ZIP archive, extract it before training:

```python
import zipfile

with zipfile.ZipFile("fer2013_dataset.zip", "r") as zip_ref:
    zip_ref.extractall("/content/FER2013")
```

**Important:** The extraction step assumes the shared file is a ZIP archive. Modify the code if the dataset is provided as a CSV file or in another format.

## ⚙️ System Architecture

The facial expression recognition process follows this workflow:

```text
             Camera / Image Input
                      |
                      v
             OpenCV Face Detection
                (Haar Cascade)
                      |
                      v
                Face Extraction
                      |
                      v
              Image Preprocessing
          (Resize / Grayscale / Normalize)
                      |
                      v
              Trained CNN Model
                      |
                      v
             Emotion Classification
                      |
                      v
                Predicted Emotion
                      |
                      v
                 Emoji Mapping
                      |
                      v
                Emoji Display
```

## 🔍 How the System Works

### 1. Face Detection

The system uses OpenCV's Haar Cascade classifier to identify faces in an image or camera frame.

The detected facial region is extracted for further processing.

### 2. Image Preprocessing

The extracted face is prepared for the CNN model.

Typical preprocessing steps include:

- Converting the face to grayscale.
- Resizing the image to 48 × 48 pixels.
- Normalizing pixel values.
- Reshaping the image to match the model input dimensions.

The preprocessing during inference must match the preprocessing used during model training.

### 3. Emotion Classification

The preprocessed image is passed to the trained CNN model.

The CNN extracts facial features and predicts the probabilities of the seven emotion classes.

The emotion with the highest predicted probability is selected.

### 4. Emoji Mapping

The predicted emotion is mapped to its corresponding emoji.

For example:

```python
emotion_to_emoji = {
    "Angry": "😠",
    "Disgust": "🤢",
    "Fear": "😨",
    "Happy": "😄",
    "Sad": "😢",
    "Surprise": "😲",
    "Neutral": "😐"
}
```

The actual mapping between model output indices and emotion labels must match the class order used during training.

### 5. Real-Time Prediction

For real-time recognition, the system processes frames captured from a camera, detects facial regions, performs emotion classification, and updates the corresponding emoji.

In Google Colab, camera access requires a browser-compatible capture mechanism. OpenCV's standard `VideoCapture(0)` is generally intended for local environments rather than Colab's remote runtime.

## 🏗️ CNN Model Architecture

A typical CNN architecture for FER2013 facial expression recognition contains:

1. **Input Layer:** Accepts grayscale facial images.
2. **Convolutional Layers:** Extract facial features.
3. **Activation Layers:** Introduce nonlinearity using ReLU.
4. **Pooling Layers:** Reduce spatial dimensions.
5. **Dropout Layers:** Help reduce overfitting.
6. **Flatten or Global Pooling Layer:** Converts extracted features into a representation for classification.
7. **Dense Layers:** Learn classification patterns.
8. **Output Layer:** Uses Softmax to predict seven emotion categories.

**Note:** This describes a typical CNN architecture. The exact number of layers, filters, parameters, and training settings should be taken from the implemented model.

## 🚀 Installation and Setup

### Prerequisites

- Python 3.x
- Basic knowledge of Machine Learning and Deep Learning
- Google account for Google Colab and Drive
- Internet connection for cloud training
- Webcam for live facial expression recognition

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd YOUR_REPOSITORY
```

Replace the placeholders with your actual GitHub username and repository name.

### Step 2 — Install Dependencies

```bash
pip install tensorflow opencv-python numpy pandas matplotlib
```

Alternatively, if a `requirements.txt` file is included:

```bash
pip install -r requirements.txt
```

### Step 3 — Open the Project in Google Colab

Upload the project's training notebook to Google Colab or open it directly from GitHub.

### Step 4 — Load the FER2013 Dataset

Download the dataset from the Google Drive link and configure the correct dataset path in the notebook.

### Step 5 — Train or Load the CNN Model

Run the training notebook to train the model, or load an existing trained model if one has already been saved.

### Step 6 — Run Emotion Recognition

Execute the project's inference code to detect faces, classify expressions, and display corresponding emojis.

The exact execution command depends on the scripts included in this repository.

## 📊 Model Evaluation

The model can be evaluated using the following metrics:

- Training accuracy
- Validation accuracy
- Test accuracy
- Training and validation loss
- Confusion matrix
- Precision, recall, and F1-score

### Model Performance

| Metric | Result |
|---|---|
| Training Accuracy | To be added |
| Validation Accuracy | To be added |
| Test Accuracy | To be added |
| Test Loss | To be added |

*Actual performance results should be reported from the trained model's evaluation. No performance values are assumed.*

## 🌍 Real-World Applications

**Human-Computer Interaction:** Developing applications that respond to facial expressions.

**Interactive Entertainment:** Creating expression-responsive emojis, avatars, and games.

**Virtual Communication:** Mapping facial expressions to digital avatars during online interactions.

**Educational Projects:** Demonstrating CNN-based image classification and computer vision.

**AI Research:** Studying facial expression recognition, model performance, and real-time inference.

## 🔮 Future Enhancements

- Develop a modern web-based frontend.
- Integrate the existing CNN model with a REST API.
- Add browser-based webcam support.
- Create customizable animated avatars.
- Implement multi-face detection.
- Optimize model inference for lower latency.
- Improve classification robustness under different lighting conditions.
- Add real-time confidence visualization.
- Explore more advanced facial expression recognition architectures.

## ⚠️ Limitations

- Predictions may be affected by lighting, face orientation, occlusion, and image quality.
- Haar Cascade detection may perform poorly with partially visible or rotated faces.
- FER2013 contains a limited set of expression categories.
- Model performance may vary across populations and real-world environments.
- Facial expressions do not always accurately indicate a person's actual emotions.
- Real-time performance depends on available computing resources.

## 👥 Intended Audience

This project is suitable for:

- Students
- Educators
- Python Developers
- Machine Learning Enthusiasts
- Deep Learning Researchers
- Computer Vision Developers
- AI Professionals
- Data Scientists


## 🤝 Contributions

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your improvements.
5. Submit a pull request.

## ⭐ Support

If you find this project useful, consider giving the repository a star on GitHub.

---

**Built with Python, Deep Learning, CNN, OpenCV, and FER2013.**

*Exploring intelligent facial expression recognition and interactive emoji generation through Artificial Intelligence.*
