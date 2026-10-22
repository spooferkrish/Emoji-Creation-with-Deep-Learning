"""Train the facial expression classifier from the included dataset."""
import argparse
from pathlib import Path
import tensorflow as tf

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "emotion_model.keras"
CLASSES = ("angry", "disgust", "fear", "happy", "neutral", "sad", "surprise")

def dataset(split, batch_size):
    return tf.keras.utils.image_dataset_from_directory(
        ROOT / "dataset" / split, class_names=list(CLASSES),
        label_mode="categorical", color_mode="grayscale",
        image_size=(48, 48), batch_size=batch_size,
        shuffle=split == "train", seed=42,
    ).prefetch(tf.data.AUTOTUNE)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--resume", action="store_true", help="Continue from the saved model")
    args = parser.parse_args()
    if args.resume and not MODEL_PATH.is_file():
        parser.error(f"Cannot resume: {MODEL_PATH} does not exist")
    model = tf.keras.models.load_model(MODEL_PATH) if args.resume else tf.keras.Sequential([
        tf.keras.layers.Input((48, 48, 1)),
        tf.keras.layers.Rescaling(1 / 255),
        tf.keras.layers.Conv2D(32, 3, activation="relu"),
        tf.keras.layers.Conv2D(64, 3, activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Conv2D(128, 3, activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(128, 3, activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(1024, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(len(CLASSES), activation="softmax"),
    ])
    if not args.resume:
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
                      loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(dataset("train", args.batch_size),
              validation_data=dataset("test", args.batch_size),
              epochs=args.epochs, verbose=2,
              callbacks=[tf.keras.callbacks.EarlyStopping(
                  monitor="val_loss", patience=4, restore_best_weights=True),
                  tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, monitor="val_loss",
                                                     save_best_only=True)])
    model.save(MODEL_PATH)
    print(f"Saved {MODEL_PATH}")

if __name__ == "__main__":
    main()
