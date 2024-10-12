from openai import OpenAI
import os
from typing import Generator
import speech_recognition as sr
from pydub import AudioSegment
import subprocess
import os
import tiktoken
from video_utils import *

os.system("sh /home/fedora/prog/live-summariser/.env")
YOUR_API_KEY="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"
MODEL_NAME_HERE = "llama-3.1-sonar-large-128k-online"

COMMENTS_PATH = "/home/fedora/prog/live-summariser/llm/comments.txt"
SUMMARY_PATH = "/home/fedora/prog/live-summariser/llm/summary.txt"

with open(COMMENTS_PATH, "w") as f:
    pass
with open(SUMMARY_PATH, "w") as f:
    pass






text = speech_to_text("output.wav")


def chunk_trancript(text):
    # Load GPT-4 tokenizer
    encoding = tiktoken.encoding_for_model("gpt-4o")
    max_tokens = 8000
    tokens = encoding.encode(text)
    chunks = [tokens[i : i + max_tokens] for i in range(0, len(tokens), max_tokens)]

    text_chunks = [encoding.decode(chunk) for chunk in chunks]
    return text_chunks


def gen_single_message(chunk, text_response):
    postfix = (
        f"Here is the summary that was generated from the previous chunk '{text_response}'"
        if text_response
        else ""
    )
    current_message = [
        {
            "role": "system",
            "content": (
                "You are a lawyer who summarises the transcript of legal cases. Be concise, accurate and understandable. Do not include an introduction or a conclusion. Speak in a neutral tone and do not give advice. Only discuss what is in the source material. Use a tone that would fit in a news article."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Summarize the current body of text, which is a chunk of a larger document '{chunk}'. Your summarization should contain all the important details in a readable form. Be concise."
                + postfix
            ),
        },
    ]
    return current_message


def gen_lawyer_message(summaries):
    current_message = [
        {
            "role": "system",
            "content": (
                "You are a lawyer who analyzes snippets court cases based on their transcripts/summaries. Provide insightful and interesting commentary on the proceedings of the cases. Keep your comments short and to the point, do not give an introduction or conclusion."
            ),
        },
        {
            "role": "user",
            "content": (
                f'Analyze the following proceedings and give unique and interesting opinions on it. Clarify any points that may not be accessible to a general audience."{' '.join(summaries)}"'
            ),
        },
    ]
    return current_message


def summarize_chunk(chunk, text_response):
    message = gen_single_message(chunk, text_response)

    response = client.chat.completions.create(
        model=MODEL_NAME_HERE,
        messages=message,
    )
    text_response = response.choices[0].message.content.strip()
    return text_response


def comment_on_summaries(outputs):
    message = gen_lawyer_message(outputs)

    response = client.chat.completions.create(
        model=MODEL_NAME_HERE,
        messages=message,
    )
    text_response = response.choices[0].message.content.strip()
    return text_response


while True:
    text_chunks = chunk_trancript(next(text))

    client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

    outputs, summaries = [], []
    text_response = None
    for chunk in text_chunks:
        text_response = summarize_chunk(chunk, text_response)
        with open(SUMMARY_PATH, "a") as f:
            f.write(text_response)
        outputs.append(text_response)
        lawyer_comment = comment_on_summaries(outputs)
        with open(COMMENTS_PATH, "a") as f:
            f.write(lawyer_comment)

        summaries.append(lawyer_comment)
