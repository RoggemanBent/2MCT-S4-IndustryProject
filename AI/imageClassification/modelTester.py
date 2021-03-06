import cv2
import numpy as np

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

img_height = 180
img_width = 320

confidence = 0
treshhold = 0.7
windowSize = 5
window = True
probablities = []
prediction = 0
average = 0

classNames = ["Not Golfswing", "Golfswing"]
predictedLabel = ""

model = tf.keras.models.load_model('AI\imageClassification\models\\testing\model.h5')
model.summary()

cap = cv2.VideoCapture(0)


while True:
    succes, frame = cap.read()
    
    if succes:

        normalizedFrame = cv2.resize(frame, (img_height, img_width))

        img_array = keras.preprocessing.image.img_to_array(normalizedFrame)
        img_array = tf.expand_dims(img_array, 0) # Create a batch

        prediction = model.predict(img_array)[0]

        if window:
            probablities.append(prediction)

            if len(probablities) == windowSize:

                average = np.array(probablities).mean(axis=0)[0]

                if average > 0.39:
                    predictedLabel = "Golfswing"
                else:
                    predictedLabel = "Not Golfswing"

                probablities.pop()

            

            cv2.putText(frame, f"{predictedLabel} {average:.2f}% confidence.", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        else:
            cv2.putText(frame, f"{predictedLabel} {average:.2f}% confidence.", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        cv2.imshow('Capture', frame)

        if cv2.waitKey(1) == ord('q'):
            cv2.destroyAllWindows()
            break

cap.release()