import cv2
import socket
import pickle
import struct

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serverSocket.connect((socket.gethostname(), 9999))
# serverSocket.connect(("127.0.0.1", 9999))

img_height = 320
img_width = 640

cap = cv2.VideoCapture(0)


while True:
    succes, frame = cap.read()
    
    if succes:
        
        frameResized = cv2.resize(frame, (img_width, img_height))
        frameSer = pickle.dumps(frameResized)

        msg = struct.pack("Q", len(frameSer)) + frameSer
        serverSocket.sendall(msg)

        cv2.imshow("Capture", frameResized)

        if cv2.waitKey(10) == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            serverSocket.close()
            print("Closing client.")
            break