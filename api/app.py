from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room

import logging

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def hello_world():
    return "<p>Hello, World! </p>"


@socketio.on("join")
def handle_join(json):
    room = json["room"]
    join_room(room)
    message = {"type": "JOIN_ROOM", "data": f"You have entered room: {room}"}
    logger.info(f"New entry for room {room}")
    emit("response", message, to=room, include_self=True, broadcast=True, room=room)


if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)
