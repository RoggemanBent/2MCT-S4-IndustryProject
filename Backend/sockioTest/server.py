import socket

HEADERSIZE = 10

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((socket.gethostname(), 5000))
s.listen(5)

clientsocket, address = s.accept()
print(f"Connection from {address} has been established.")


new_msg = True
full_msg = ''

while True:

    try:
        msg = clientsocket.recv(16)
    except:
        print(f"Connection to {address} lost. Exiting...")
        break

    if new_msg:
        msglen = int(msg[:HEADERSIZE])
        print(f"full message length: {msglen}")
        new_msg = False

    full_msg += msg.decode("utf-8")

    if len(full_msg)-HEADERSIZE == msglen:
        print("full msg recvd")
        print(f"Client data: {full_msg[HEADERSIZE:]}")
        new_msg = True
        full_msg = ''