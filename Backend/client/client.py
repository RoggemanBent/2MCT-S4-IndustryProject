import cv2
import socket
import pickle
import struct
import io

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serverSocket.connect((socket.gethostname(), 5000))

img_height = 360
img_width = 640

cap = cv2.VideoCapture(0)

try:
    while True:
        succes, frame = cap.read()
        
        if succes:
            
            frameResized = cv2.resize(frame, (img_width, img_height))
            frameSer = pickle.dumps(frameResized)

            msg = struct.pack("Q", len(frameSer)) + frameSer
            serverSocket.sendall(msg)


except KeyboardInterrupt:
    print("Stopping stream...")
    cap.release()
    serverSocket.close()