import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
import pathlib
import pydot

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.utils import plot_model
from tensorflow.keras.models import Sequential


data_dir = pathlib.Path("E:\GolfData\Frames")
checkpoint_filepath = "AI\\imageClassification\\models\\testing\\testModel.h5"

# loader parameters
batch_size = 32
img_height = 360
img_width = 640

loss = []
acc = []
val_loss = []
val_acc = []


train_ds = tf.keras.preprocessing.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)


class_names = train_ds.class_names

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)


model = Sequential([

    # preprocessing and feature augmentation
  layers.experimental.preprocessing.Rescaling(1./255, input_shape=(img_height, img_width, 3)),
  layers.experimental.preprocessing.RandomFlip("horizontal", input_shape=(img_height, img_width, 3)),
  layers.experimental.preprocessing.RandomRotation(0.1),
  layers.experimental.preprocessing.RandomZoom(0.1),

  layers.Conv2D(128, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(128, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(128, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Dropout(0.2),
  layers.Flatten(),
  layers.Dense(128, activation='relu'),
  layers.Dense(2)
])


# This callback will stop the training when there is no improvement in
# the loss for three consecutive epochs.
earlyStop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5)
saveModel = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_filepath, save_weights_only=False, monitor='val_loss', mode='min', save_best_only=True)
tensorboard = tf.keras.callbacks.TensorBoard(log_dir="AI\\imageClassification\\models\\testing\\logs", histogram_freq=1)

model.compile(optimizer='adam', loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=['accuracy'])

# Check its architecture
model.summary()

epochs = 100

try:
  history = model.fit(train_ds, validation_data=val_ds, epochs=epochs, callbacks=[saveModel, tensorboard])
except KeyboardInterrupt:
  print("\nStopping training...")