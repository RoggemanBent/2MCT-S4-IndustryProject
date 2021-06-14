import cv2
import threading
import numpy as np
import tensorflow as tf
import json
import requests

class Classifier(threading.Thread):

    def __init__(self, messageQ, fps, treshhold, gDriveAuthKey):
        threading.Thread.__init__(self)

        self.img_width = 320
        self.img_height = 180

        self.running = True
        self.treshhold = treshhold

        # voor mijn laptop webcam is fps 15
        self.fps = fps
        self.windowSize = self.fps * 3 # 23 fps times 3 seconds


        self.frames = []
        self.window = True
        self.probablities = []

        self.messageQ = messageQ
        self.classNames = ["Not Golfswing", "Golfswing"]
        self.model = tf.keras.models.load_model('AI\imageClassification\models\main\model.h5')

        self.drive_headers = {"Authorization": f"Bearer {gDriveAuthKey}"} # Vraag auth key aan: https://developers.google.com/oauthplayground/
        self.drive_count = 0


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

                if predictedLabel == "Golfswing" and average[prediction] >= self.treshhold:
                    self.saveClip()

                    # na het saven van de clip de buffers leegmaken
                    # anders houden we rekening met al gesavede frames
                    self.frames = []
                    self.probablities = []
                else:
                    self.frames.pop(0)
                    self.probablities.pop(0)
                    print(f"\r{predictedLabel} width {score[prediction]} certainty.      ", end="")
        

    def saveClip(self):
        
        try:
            clip = cv2.VideoWriter("Backend\server\out\\out.mp4", cv2.VideoWriter_fourcc(*'mp4v'), fps=self.fps, frameSize = (self.img_width, self.img_height))

            for frame in self.frames:
                clip.write(frame)
            clip.release()
        except Exception as e:
            print(f"Problem with writing video: {str(e)}")


        try:
            para = {"name": f"positive_clip{self.drive_count}.mp4"}
            files = {
                'data': ('metadata', json.dumps(para), 'application/json; charset=UTF-8'),
                'file': open("Backend\server\out\\out.mp4", "rb") # lokaal path naar video
            }
            r = requests.post(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            headers=self.drive_headers,
            files=files
            )
        except Exception as e:
            print(f"Problem with saving video to drive: {str(e)}")

        self.drive_count += 1
