import cv2
import threading
import numpy as np
import tensorflow as tf
from queue import Queue


class Classifier(threading.Thread):

    def __init__(self, messageQ):
        threading.Thread.__init__(self)

        self.img_width = 320
        self.img_height = 180

        self.running = True
        self.treshhold = 0.7
        self.windowSize = 23 * 3 # 23 fps times 3 seconds
        self.frames = []
        self.window = True
        self.probablities = []

        self.messageQ = messageQ
        self.classNames = ["Not Golfswing", "Golfswing"]
        self.model = tf.keras.models.load_model('AI\imageClassification\models\main\model.h5')


    def run(self):

        while self.running:

            image = self.messageQ.get()
            self.frames.append(image)

            img_array = tf.expand_dims(image, 0) # Create a batch

            predictions = self.model.predict(img_array)
            score = tf.nn.softmax(predictions[0])

            self.probablities.append(score)

            if len(self.probablities) == self.windowSize:

                average = np.array(self.probablities).mean(axis=0)
                prediction = np.argmax(average)
                predictedLabel = self.classNames[prediction]

                if predictedLabel == "Golfswing" and average >= self.treshhold:
                    self.saveClip()

                self.frames.pop(0)
                self.probablities.pop(0)
                print(f"\r{predictedLabel} width {score[prediction]} certainty.      ", end="")
        

        def saveClip(self):

            clip = cv2.VideoWriter('Backend\server\out\swing.mp4',-1,1, (self.img_width, self.img_height))

            for frame in self.frames:
                clip.write(frame)
            clip.release()