import sys
from pathlib import Path
sys.path[0] = str(Path(sys.path[0]).parent.parent)

import socket
import threading
from Backend.server.clienthandler import ClientHandler


serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind((socket.gethostname(), 9999))
serversocket.listen(5)
print("SERVER STARTED")       


while True:

    try:
        clientSocket, address = serversocket.accept()
    except Exception as ex:
        print(ex)
        serversocket.close()
        break

    print('Connected to: ' + address[0] + ':' + str(address[1]))
    clh = ClientHandler(clientSocket)
    clh.start()