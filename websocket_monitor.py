import json

from websocket import create_connection
ws = create_connection("ws://localhost:8000/ws/calc/121/")

while True:
    result = ws.recv()
    result = json.loads(result)
    print ("Received '%s'" % result)

ws.close()