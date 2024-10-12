import flask
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, join_room

from flask_socketio import emit

from clients.process import process

import logging

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on("join")
def handle_join(json):
    room = json["room"]
    join_room(room, sid=flask.request.sid, namespace="/")
    message = {"type": "JOIN_ROOM", "data": f"You have entered room: {room}"}
    logger.info(f"New entry for room {room}")
    emit("response", message, to=room, include_self=True, broadcast=True, room=room)
    socketio.start_background_task(process, room, "oj1.wav", socketio)


if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)
