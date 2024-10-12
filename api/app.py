import flask
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
# from clients.process import process
from enum import Enum
from datetime import datetime
from flask import current_app

from flask_socketio import emit

from clients import llm
from clients.process import process
from clients.stt import speech_to_text

import logging

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


class MessageType(Enum):
    NEW_SUMMARY = "NEW_SUMMARY"
    NEW_OPINION = "NEW_OPINION"


@app.route("/")
def hello_world():
    emit("response", {"type": "FOO", "data": {"foo": "bar"}}, to="123", include_self=True, broadcast=True,
                room="123", namespace="/")
    return {}


@socketio.on("join")
def handle_join(json):
    room = json["room"]
    print(flask.request.sid)
    print(flask.request.namespace)
    join_room(room, sid=flask.request.sid, namespace="/")
    message = {"type": "JOIN_ROOM", "data": f"You have entered room: {room}"}
    logger.info(f"New entry for room {room}")
    emit("response", message, to=room, include_self=True, broadcast=True, room=room)
    socketio.start_background_task(process, "oj1.wav", socketio)
#
#
# def _process(audio_path: str) -> None:
#     text_chunks = speech_to_text(audio_path)
#
#     outputs, summaries = [], []
#     text_response = None
#     for chunk in text_chunks:
#         print("Hello")
#         text_response = llm.summarize_chunk(chunk, text_response)
#         _send_message("123", MessageType.NEW_SUMMARY, text_response)
#         print(text_response)
#         # with open(SUMMARY_PATH, "a") as f:
#         #     f.write(text_response)
#         outputs.append(text_response)
#         lawyer_comment = llm.comment_on_summaries(outputs)
#         # with open(COMMENTS_PATH, "a") as f:
#         #     f.write(lawyer_comment)
#         _send_message("123", MessageType.NEW_OPINION, lawyer_comment)
#
#         summaries.append(lawyer_comment)
#
#
# def _send_message(room_id: str, message_type: MessageType, content: str) -> None:
#     message = {
#         "type": message_type.value,
#         "data": {
#             "content": content,
#             "timestamp": datetime.now().timestamp(),
#         }
#     }
#     # app.app_context()
#     with app.app_context():
#         emit("response", message, to="123", include_self=True, broadcast=True,
#                 room="123", namespace="/")


if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)
