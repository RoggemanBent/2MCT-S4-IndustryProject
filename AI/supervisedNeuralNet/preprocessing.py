import cv2
import scipy.io
import os
from numpy import asarray

data_path = 'E:\GolfData\golfDB.mat'
videos_path = "E:\GolfData\Videos\\"

frame_paths = ["E:\GolfData\Positives\\", "E:\GolfData\\Negatives\\"]
out_paths = ["E:\GolfData\\Normalized\Positives\\", "E:\GolfData\\Normalized\\Negatives\\"]

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 120
width = 640
height = 360

mat = scipy.io.loadmat(data_path)
numvideos = len(mat["golfDB"][0])

def GetFrames(negatives = 5000):

    # positives
    totalFrames = 0
    for video in mat["golfDB"][0]:
        slow = video[6][0][0]
        if not slow:
            continue
        videoname = videos_path + video[1][0] + ".mp4"
        framenumbers = video[7][0]
        view = video[5][0]
        
        # Open the video file  
        cap = cv2.VideoCapture(videoname)
        if cap.isOpened():
            numframes = cap.get(cv2.CAP_PROP_FRAME_COUNT)   # Number of frames
            framerate = cap.get(cv2.CAP_PROP_FPS)           # Frame rate
            for i in range(10):
                framenum = framenumbers[i]
                if cap.set(cv2.CAP_PROP_POS_FRAMES, framenum):
                    ret, frame = cap.read()
                    if ret:
                        outputfilename = frame_paths[0] + video[1][0] + "_" + str(framenum) + ".png"
                        cv2.imwrite(outputfilename, frame)
                        totalFrames += 1
                        print(f"Done {totalFrames} positive frames                    \r", end='')
                    else:
                        print("Could not read frame " + str(framenum) + " from " + videoname)
                else:
                    print("Could not go to frame " + str(framenum) + " in " + videoname)
        else:
            print("Could not open " + videoname)
    print()

    #negatives
    totalFrames = 0
    for video in mat["golfDB"][0]:
        
        if totalFrames == negatives:
            break
        
        slow = video[6][0][0]
        if not slow:
            continue
        videoname = videos_path + video[1][0] + ".mp4"
        framenumbers = video[7][0]
        view = video[5][0]
        
        # Open the video file  
        cap = cv2.VideoCapture(videoname)
        if cap.isOpened():
            numframes = cap.get(cv2.CAP_PROP_FRAME_COUNT)   # Number of frames
            framerate = cap.get(cv2.CAP_PROP_FPS)           # Frame rate

            for framenum in range(int(numframes)):
                if framenum not in framenumbers:
                    if cap.set(cv2.CAP_PROP_POS_FRAMES, framenum):
                        ret, frame = cap.read()
                        if ret:
                            outputfilename = frame_paths[1] + video[1][0] + "_" + str(framenum) + ".png"
                            cv2.imwrite(outputfilename, frame)
                            totalFrames += 1
                            print(f"Done {totalFrames} / {negatives} negative frames                    \r", end='')
                            if totalFrames == negatives:
                                break
                        else:
                            print("Could not read frame " + str(framenum) + " from " + videoname)
                    else:
                        print("Could not go to frame " + str(framenum) + " in " + videoname)
        else:
            print("Could not open " + videoname)
    print()

def NormalizeFrames():
    
    totalImages = 0
    for dirIndx, dir in enumerate(frame_paths):

        imCount = len(os.listdir(dir))
        totalImages += imCount
        for indx, im in enumerate(os.listdir(dir)):
            img = cv2.imread(frame_paths[dirIndx] + im)
            norm = cv2.normalize(img, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
            cv2.imwrite(out_paths[dirIndx] + im, norm)
            print(f"Normalized {round((indx / imCount) * 100, 1)} % frames of {out_paths[dirIndx]}         \r", end='')
        print()
    print(f"Done normalizing {totalImages} frames.")

GetFrames()
NormalizeFrames()