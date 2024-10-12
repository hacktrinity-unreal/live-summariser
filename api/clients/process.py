from . import llm
from .stt import speech_to_text

SUMMARY_PATH = "./summary.txt"
COMMENTS_PATH = "./comments.txt"


def process(audio_path: str) -> None:
    text_chunks = speech_to_text(audio_path)

    outputs, summaries = [], []
    text_response = None
    for chunk in text_chunks:
        print("Hello")
        text_response = llm.summarize_chunk(chunk, text_response)
        print(text_response)
        with open(SUMMARY_PATH, "a") as f:
            f.write(text_response)
        outputs.append(text_response)
        lawyer_comment = llm.comment_on_summaries(outputs)
        with open(COMMENTS_PATH, "a") as f:
            f.write(lawyer_comment)

        summaries.append(lawyer_comment)
