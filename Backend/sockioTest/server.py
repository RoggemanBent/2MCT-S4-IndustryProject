import socket
import pickle
import cv2
import struct


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((socket.gethostname(), 5000))
s.listen(5)

clientsocket, address = s.accept()
print(f"Connection from {address} has been established.")



data = b""
payload_size = struct.calcsize("Q")

while True:

	while len(data) < payload_size:
		packet = clientsocket.recv(4*1024) # 4K

		if not packet: 
			break
		data += packet
		
	packed_msg_size = data[:payload_size]
	data = data[payload_size:]
	msg_size = struct.unpack("Q", packed_msg_size)[0]
	
	while len(data) < msg_size:
		data += clientsocket.recv(4*1024)

	frame_data = data[:msg_size]
	data  = data[msg_size:]
	frame = pickle.loads(frame_data)
	cv2.imshow("RECEIVING VIDEO", frame)

	if cv2.waitKey(1) == ord('q'):
		break

clientsocket.close()
cv2.destroyAllWindows()