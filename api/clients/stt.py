from typing import Generator
import speech_recognition as sr
from pydub import AudioSegment

from utils import make_temp_directory

CHUNK_SIZE = 60000  # milliseconds


def speech_to_text(audio_path: str) -> Generator[str, None, None]:
    audio = AudioSegment.from_wav(audio_path)
    num_chunks = len(audio) // CHUNK_SIZE + (1 if len(audio) % CHUNK_SIZE > 0 else 0)

    with make_temp_directory() as td:
        for i in range(num_chunks):
            start_time = i * CHUNK_SIZE
            end_time = start_time + CHUNK_SIZE
            chunk = audio[start_time:end_time]
            chunk_filename = f"{td}/chunk_{i}.wav"
            chunk.export(chunk_filename, format="wav")

            try:
                recognised_text = _recognise_text(chunk_filename)
            except (Exception,):
                recognised_text = ""

            yield recognised_text


def _recognise_text(audio_path: str) -> str:
    recogniser = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        data = recogniser.record(source)

    text = recogniser.recognize_google(data)
    return text
