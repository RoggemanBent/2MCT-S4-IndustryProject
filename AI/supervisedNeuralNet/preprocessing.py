import os
import cv2

data_path = 'E:\GolfData'
out_path = "E:\GolfData\grayscaled\\"
images_path = "E:\GolfData\images\\"


def grayscale():

    for clip in os.listdir(data_path):
        if os.path.splitext(clip)[1] == '.mp4':
            filePath = os.path.join(data_path, clip)
            os.system(f"ffmpeg -i {filePath} -vf hue=s=0 {out_path + clip}")


def videosToImages():

    totalVideos = len(os.listdir(out_path))
    videoCount = 0

    for clip in os.listdir(out_path):
        vidcap = cv2.VideoCapture(out_path + clip)
        success, image = vidcap.read()
        count = 0


        while success:
            normalizedImage = image / 255
            cv2.imwrite(f"{images_path}{clip}%d.jpg" % count, normalizedImage)     # save frame as JPEG file      
            success,image = vidcap.read()
            count += 1
        videoCount += 1
        print(f"Percent done: {(videoCount / totalVideos) * 100}", end='')

