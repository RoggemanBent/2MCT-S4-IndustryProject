import socket

HEADERSIZE = 10

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serverSocket.connect((socket.gethostname(), 5000))
msg = "Client sending data!"

while True:

    print("Sending Data...")

    msg = f"{len(msg):<{HEADERSIZE}}"+msg

    serverSocket.send(bytes(msg,"utf-8"))
    print("Done!")
    msg = input()