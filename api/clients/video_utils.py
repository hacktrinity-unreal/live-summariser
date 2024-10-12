from openai import OpenAI
import os
from typing import Generator
import speech_recognition as sr
from pydub import AudioSegment
import subprocess
import os
import tiktoken


def convert_mp4_to_wav(input_file, output_file):
    command = [
        "ffmpeg",
        "-i",
        input_file,  # Input file
        "-vn",  # No video
        "-acodec",
        "pcm_s16le",  # Audio codec
        "-ar",
        "44100",  # Sample rate
        "-ac",
        "2",  # Number of audio channels
        output_file,  # Output file path
    ]
    subprocess.run(command, check=True)
    print(f"Converted {input_file} to {output_file}")



def speech_to_text(audio_path: str) -> Generator[str, None, None]:
    CHUNK_SIZE = 60000
    audio = AudioSegment.from_wav(audio_path)
    num_chunks = len(audio) // CHUNK_SIZE + (1 if len(audio) % CHUNK_SIZE > 0 else 0)
    try:
        os.mkdir(
        "temp"
        )
    except:
        os.system("temp/*")

    td= "temp"
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

