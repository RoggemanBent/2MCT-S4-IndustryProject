import sys
from pathlib import Path
sys.path[0] = str(Path(sys.path[0]).parent.parent)

import socket
import threading
from Backend.server.clienthandler import ClientHandler

class ClassificationServer(threading.Thread):

    def __init__(self, host, port):
        threading.Thread.__init__(self, name="Thread-Server", daemon=True)
        self.host = host
        self.port = port
        self.serversocket = None

    def initServer(self):
        self.serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.serversocket.bind((self.host, self.port))
        self.serversocket.listen(5)
        print("SERVER STARTED")       


    # thread-klasse!
    def run(self):
        try:
            while True:
                print("waiting for a new client...")

                # establish a connection
                socket_to_client, addr = self.serversocket.accept()
                print(f"Got a connection from {addr}")
                clh = ClientHandler(socket_to_client)
                clh.start()
                print(f"Current Thread count: {threading.active_count()}.")

        except Exception as ex:
            print(f"Serversocket afgesloten: {ex}")


server = ClassificationServer("127.0.0.1", 9999)
server.initServer()
server.start()