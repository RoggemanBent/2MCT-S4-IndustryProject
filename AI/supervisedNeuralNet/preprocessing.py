import cv2
import scipy.io

data_path = 'E:\\GolfData\\golfDB.mat'
videos_path = "E:\\GolfData\\Videos\\"

frame_paths = {'positives': "E:\\GolfData\\Frames\\Positives\\", 'negatives': "E:\\GolfData\\Frames\\Negatives\\"}
out_paths = ["E:\\GolfData\\Normalized\\Positives\\", "E:\\GolfData\\Normalized\\Negatives\\"]

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 120
width = 640
height = 360

mat = scipy.io.loadmat(data_path)
numvideos = len(mat["golfDB"][0])

def GetFrames(negatives = 20):

    negatives //= 2
    positivesDone = 0
    negativesDone = 0

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

            startNegatives = framenumbers[0] - negatives
            endNegatives = framenumbers[-1] - negatives


            for framenum in range(startNegatives, framenumbers[0]):

                if cap.set(cv2.CAP_PROP_POS_FRAMES, framenum):
                    ret, frame = cap.read()
                    if ret:
                        outputfilename = frame_paths['negatives'] + video[1][0] + "_" + str(framenum) + ".png"
                        cv2.imwrite(outputfilename, frame)
                        negativesDone += 1

                        print(f"Done {positivesDone} positive frames and {negativesDone} negative frames.                  \r", end='')
                    else:
                        print("Could not read frame " + str(framenum) + " from " + videoname)
                else:
                    print("Could not go to frame " + str(framenum) + " in " + videoname)

            for i in range(10):

                    framenum = framenumbers[i]
                    if cap.set(cv2.CAP_PROP_POS_FRAMES, framenum):
                        ret, frame = cap.read()
                        if ret:
                            outputfilename = frame_paths['positives'] + video[1][0] + "_" + str(framenum) + ".png"
                            cv2.imwrite(outputfilename, frame)
                            positivesDone += 1

                            print(f"Done {positivesDone} positive frames and {negativesDone} negative frames.                  \r", end='')

                        else:
                            print("Could not read frame " + str(framenum) + " from " + videoname)
                    else:
                        print("Could not go to frame " + str(framenum) + " in " + videoname)
            else:
                print("Could not open " + videoname)


            for framenum in range(framenumbers[-1], endNegatives):

                if cap.set(cv2.CAP_PROP_POS_FRAMES, framenum):
                    ret, frame = cap.read()
                    if ret:
                        outputfilename = frame_paths['negatives'] + video[1][0] + "_" + str(framenum) + ".png"
                        cv2.imwrite(outputfilename, frame)
                        negativesDone += 1

                        print(f"Done {positivesDone} positive frames and {negativesDone} negative frames.                  \r", end='')
                    else:
                        print("Could not read frame " + str(framenum) + " from " + videoname)
                else:
                    print("Could not go to frame " + str(framenum) + " in " + videoname)

    print()

# def NormalizeFrames():
    
#     totalImages = 0
#     for dirIndx, dir in enumerate(frame_paths):

#         imCount = len(os.listdir(dir))
#         totalImages += imCount
#         for indx, im in enumerate(os.listdir(dir)):
#             img = cv2.imread(frame_paths[dirIndx] + im)
#             norm = cv2.normalize(img, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
#             cv2.imwrite(out_paths[dirIndx] + im, norm)
#             print(f"Normalized {round((indx / imCount) * 100, 1)} % frames of {out_paths[dirIndx]}         \r", end='')
#         print()
#     print(f"Done normalizing {totalImages} frames.")

GetFrames()
