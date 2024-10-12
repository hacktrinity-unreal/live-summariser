from enum import Enum
from datetime import datetime

from flask_socketio import SocketIO

from . import llm
from .stt import speech_to_text


class MessageType(Enum):
    NEW_SUMMARY = "NEW_SUMMARY"
    NEW_OPINION = "NEW_OPINION"


def process(room_id: str, audio_path: str, socketio: SocketIO) -> None:
    text_chunks = speech_to_text(audio_path)

    outputs, summaries = [], []
    text_response = None
    for chunk in text_chunks:
        text_response = llm.summarize_chunk(chunk, text_response)
        _send_message(room_id, MessageType.NEW_SUMMARY, text_response, socketio)
        outputs.append(text_response)
        lawyer_comment = llm.comment_on_summaries(outputs)
        _send_message(room_id, MessageType.NEW_OPINION, lawyer_comment, socketio)
        summaries.append(lawyer_comment)


def _send_message(room_id: str, message_type: MessageType, content: str, socketio: SocketIO) -> None:
    message = {
        "type": message_type.value,
        "data": {
            "content": content,
            "timestamp": datetime.now().timestamp(),
        }
    }
    socketio.emit("response", message, to=room_id, room=room_id, namespace="/")
    socketio.sleep(0)
