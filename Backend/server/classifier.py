import threading
import numpy as np
import tensorflow as tf
from queue import Queue


class Classifier(threading.Thread):

    def __init__(self, messageQ):
        threading.Thread.__init__(self)

        self.running = True
        self.treshhold = 0.7
        self.windowSize = 5
        self.window = False
        self.probablities = []

        self.messageQ = messageQ
        self.classNames = ["Not Golfswing", "Golfswing"]
        self.model = tf.keras.models.load_model('AI\imageClassification\models\main\model.h5')


    def run(self):

        while self.running:
            image = self.messageQ.get()
            img_array = tf.expand_dims(image, 0) # Create a batch

            predictions = self.model.predict(img_array)
            score = tf.nn.softmax(predictions[0])

            if self.window:
                self.probablities.append(score)

                if len(self.probablities) == self.windowSize:

                    average = np.array(self.probablities).mean(axis=0)
                    certainty = np.argmax(average)
                    predictedLabel = self.classNames[certainty]
                    self.probablities.pop()

                    print(f"\r{predictedLabel} width {certainty} certainty.      ", end="")
            
            else:
                certainty = np.argmax(score)
                predictedLabel = self.classNames[certainty]

                print(f"\r{predictedLabel} width {score[certainty]} certainty.      ", end="")            