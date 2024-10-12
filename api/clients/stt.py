import moviepy.editor as mp
import speech_recognition as sr


def speech_to_text(video_path: str) -> str:
    video = mp.VideoFileClip(video_path)
    audio = video.audio

    path = f"{_strip_extension(video_path)}.wav"
    audio.write_audiofile(path)
    text = _recognise_text(path)
    return text


def _strip_extension(file_path: str) -> str:
    parts = file_path.split(".")
    if len(parts) > 1:
        return ".".join(parts[:-1])
    return file_path


def _recognise_text(audio_path: str) -> str:
    recogniser = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        data = recogniser.record(source)

    text = recogniser.recognize_google(data)
    return text
