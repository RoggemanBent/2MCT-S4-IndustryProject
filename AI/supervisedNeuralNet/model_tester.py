import cv2
import numpy as np

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential


img_height = 360
img_width = 64

treshhold = 0.7
windowSize = 1
probablities = []

classNames = ["Not Golfer", "Golfer"]
predictedLabel = ""

model = tf.keras.models.load_model('AI\supervisedNeuralNet\model.h5')
model.summary()


cap = cv2.VideoCapture(0)

while True:
    succes, frame = cap.read()
    
    if succes:

        # normalizedFrame = cv2.resize(frame / 255, (img_width, img_height))
        # probablities.append(model.predict(np.expand_dims(normalizedFrame, axis = 0))[0])

        if len(probablities) == windowSize:

            average = np.array(probablities).mean(axis=0)
            prediction = np.argmax(average)
            predictedLabel = classNames[prediction]

        # cv2.putText(frame, predictedLabel, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.imshow('Capture', frame)

cap.release()
cv2.destroyAllWindows()