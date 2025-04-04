import socket
import time
def make_request(addr,port,request_data):
    try:
        client=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        client.connect((addr,port))
        start=time.time()
        client.sendall(request_data.encode())
        response=client.recv(1024).decode()
        print(response)
        client.close()
        end=time.time()
        print(f" {round(end - start, 3)}s")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
if __name__ == "__main__":
        make_request("127.0.0.1",5000,"cmon")
