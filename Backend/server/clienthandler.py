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
        # connectie with client
        self.socketclient = socketclient
        # id clienthandler
        ClientHandler.numbers_clienthandlers += 1
        self.id = ClientHandler.numbers_clienthandlers
        self.init_messageQ()
        self.classifier = Classifier(self.messageQ)


    def run(self):
        data = b""
        payload_size = struct.calcsize("Q")

        while True:

            while len(data) < payload_size:

                try:
                    packet = self.socketclient.recv(4*1024) # 4K
                except:
                    self.socketclient.close()
                    break

                data += packet
                
            packed_msg_size = data[:payload_size]
            data = data[payload_size:]
            msg_size = struct.unpack("Q", packed_msg_size)[0]
            
            while len(data) < msg_size:
                data += self.socketclient.recv(4*1024)

            frame_data = data[:msg_size]
            data  = data[msg_size:]
            frame = pickle.loads(frame_data)

            self.imToClassifier(frame)


    def init_messageQ(self):
        self.messageQ = Queue()
        self.thread_listener_queue = threading.Thread(target=self.imToClassifier, name="Image transfer thread", daemon=True)
        self.thread_listener_queue.start()

    def imToClassifier(self, im):
        message = self.messageQ.put(im)