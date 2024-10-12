from typing import Generator
import ffmpeg
import moviepy.editor as mp
import speech_recognition as sr
from pydub import AudioSegment

from utils import make_temp_directory

CHUNK_SIZE = 60000  # milliseconds


def speech_to_text(video_path: str) -> Generator[str, None, None]:
    video = mp.VideoFileClip(video_path)
    audio = video.audio
    path = f"{_strip_extension(video_path)}.wav"
    audio.write_audiofile(path)
    return _process_in_chunks(path)


def _strip_extension(file_path: str) -> str:
    parts = file_path.split(".")
    if len(parts) > 1:
        return ".".join(parts[:-1])
    return file_path


def _process_in_chunks(audio_path: str) -> Generator[str, None, None]:
    audio = AudioSegment.from_wav(audio_path)
    num_chunks = len(audio) // CHUNK_SIZE + (1 if len(audio) % CHUNK_SIZE > 0 else 0)

    with make_temp_directory() as td:
        for i in range(num_chunks):
            start_time = i * CHUNK_SIZE
            end_time = start_time + CHUNK_SIZE
            chunk = audio[start_time:end_time]
            chunk_filename = f"{td}/chunk_{i}.wav"
            chunk.export(chunk_filename, format="wav")

            yield _recognise_text(chunk_filename)


def _recognise_text(audio_path: str) -> str:
    recogniser = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        data = recogniser.record(source)

    text = recogniser.recognize_google(data)
    return text
