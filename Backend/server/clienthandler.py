import socket
import pickle
import cv2
import struct
import threading
from queue import Queue
from Backend.server.classifier import Classifier



class ClientHandler(threading.Thread):

    numbers_clienthandlers = 0

    def __init__(self, socketclient):
        threading.Thread.__init__(self)

        self.img_height = 180
        self.img_width = 320
        self.running = True

        # connectie with client
        self.socketclient = socketclient
        # id clienthandler
        ClientHandler.numbers_clienthandlers += 1

        self.id = ClientHandler.numbers_clienthandlers
        self.init_messageQ()
        self.classifier = Classifier(self.messageQ)
        self.classifier.start()


    def run(self):
        data = b""
        payload_size = struct.calcsize("Q")

        while self.running:

            while len(data) < payload_size:

                try:
                    packet = self.socketclient.recv(4*1024) # 4K
                except:
                    self.socketclient.close()
                    self.classifier.running = False
                    self.running = False
                    self.classifier.join()
                    print("Exiting Clienthandler.")
                    break

                data += packet
                
            packed_msg_size = data[:payload_size]
            data = data[payload_size:]
            msg_size = struct.unpack("Q", packed_msg_size)[0]
            
            while len(data) < msg_size:
                try:
                    data += self.socketclient.recv(4*1024) # 4K
                except:
                    self.socketclient.close()
                    self.classifier.running = False
                    self.running = False
                    self.classifier.join()
                    print("Exiting Clienthandler.")
                    break

            frame_data = data[:msg_size]
            data  = data[msg_size:]
            frame = pickle.loads(frame_data)
            frameResized = cv2.resize(frame, (self.img_width, self.img_height))
            self.messageQ.put(frameResized)


    def init_messageQ(self):
        self.messageQ = Queue()