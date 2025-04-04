import socket
import threading
address="127.0.0.1"
def start_server(port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((address,port))
    server.listen()
    print(f"Backend server running on port {port}")
    while True:
        client_socket, addr = server.accept()
        client_thread = threading.Thread(target=process_request, args=(client_socket, addr, port))
        client_thread.start()
def process_request(client_socket, addr, port):
    print(f"request received from {addr} on server {port}")
    try:
        request=client_socket.recv(1024).decode()
        response="response to "+request
        j=0
        for i in range(0,1000000):
           j+=1 
        client_socket.sendall(response.encode())
    except Exception as e:
        print(f"⚠️ Error: {e}")
    finally:
        client_socket.close()
if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) 
    start_server(port)
    

