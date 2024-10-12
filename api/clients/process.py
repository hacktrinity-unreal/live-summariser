from enum import Enum
from datetime import datetime

from . import llm
from .stt import speech_to_text

SUMMARY_PATH = "./summary.txt"
COMMENTS_PATH = "./comments.txt"


class MessageType(Enum):
    NEW_SUMMARY = "NEW_SUMMARY"
    NEW_OPINION = "NEW_OPINION"


def process(audio_path: str, socketio) -> None:
    text_chunks = speech_to_text(audio_path)

    outputs, summaries = [], []
    text_response = None
    for chunk in text_chunks:
        print("Hello")
        text_response = llm.summarize_chunk(chunk, text_response)
        _send_message("123", MessageType.NEW_SUMMARY, text_response, socketio)
        print(text_response)
        outputs.append(text_response)
        lawyer_comment = llm.comment_on_summaries(outputs)
        _send_message("123", MessageType.NEW_OPINION, lawyer_comment, socketio)

        summaries.append(lawyer_comment)
        return


def _send_message(room_id: str, message_type: MessageType, content: str, socketio) -> None:
    message = {
        "type": message_type.value,
        "data": {
            "content": content,
            "timestamp": datetime.now().timestamp(),
        }
    }
    # with current_app.test_request_context("/"):
    socketio.emit("response", message, to=room_id, room=room_id, namespace="/")
