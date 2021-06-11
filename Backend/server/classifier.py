import threading
import numpy as np
import tensorflow as tf
from queue import Queue


class Classifier(threading.Thread):

    def __init__(self, messageQ):
        threading.Thread.__init__(self)
        self.treshhold = 0.7
        self.windowSize = 5
        self.window = True
        self.probablities = []
        self.prediction = 0
        self.average = 0

        self.messageQ = messageQ
        self.classNames = ["Not Golfswing", "Golfswing"]
        self.predictedLabel = ""

        self.model = tf.keras.models.load_model('AI\imageClassification\models\main\model.h5')

        self.start()

    def run(self):

        image = self.messageQ.get()
        img_array = tf.expand_dims(image, 0) # Create a batch

        self.predictions = self.model.predict(img_array)
        score = tf.nn.softmax(self.predictions[0])

        if self.window:
            self.probablities.append(score)

            if len(self.probablities) == windowSize:

                average = np.array(self.probablities).mean(axis=0)
                certainty = np.argmax(average)
                predictedLabel = classNames[certainty]
                self.probablities.pop()

            print(f"\r{predictedLabel} width {certainty} certainty.      ", end="")