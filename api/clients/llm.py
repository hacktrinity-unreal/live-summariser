from typing import List, Dict

from openai import OpenAI, Stream
import os

from openai.types.chat import ChatCompletionChunk

BASE_URL = "https://api.perplexity.ai"
API_KEY = os.environ["PERPLEXITY_API_KEY"]
MODEL = "llama-3.1-sonar-large-128k-online"

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)


def punctuate_transcription(raw_text: str) -> Stream[ChatCompletionChunk]:
    messages = [
        {
            "role": "system",
            "content": (
                "You are a court reporter. I will provide you with the raw text from a transcription of a court case "
                "which will not contain any punctuation. I want you to punctuate the text, ensuring the grammar rules "
                "of English are upheld. Ensure you only return exactly the updated text with no additional comments."
            ),
        },
        {
            "role": "user",
            "content": raw_text
        },
    ]

    response = client.chat.completions.create(
        messages=messages,
        model=MODEL,
        stream=True
    )

    return response


def summarize_chunk(chunk: str, text_response: str) -> str:
    message = _gen_single_message(chunk, text_response)

    response = client.chat.completions.create(
        model=MODEL,
        messages=message,
    )
    text_response = response.choices[0].message.content.strip()
    return text_response


def comment_on_summaries(outputs: List[str]) -> str:
    message = _gen_lawyer_message(outputs)

    response = client.chat.completions.create(
        model=MODEL,
        messages=message,
    )
    text_response = response.choices[0].message.content.strip()
    return text_response


def _gen_single_message(chunk: str, text_response: str) -> List[Dict[str, str]]:
    postfix = (
        f"Here is the summary that was generated from the previous chunk '{text_response}'"
        if text_response
        else ""
    )
    current_message = [
        {
            "role": "system",
            "content": (
                "You are a court reporter who summarises the transcript of legal cases. Be concise, accurate and understandable."
                " Do not include an introduction or a conclusion. Speak in a neutral tone and do not give advice. Only "
                "discuss what is in the source material. Use a tone that would fit in a news article."
            ),
        },
        {
            "role": "user",
            "content": (
                    f"Summarize the current body of text, which is a chunk of a larger document '{chunk}'. Your "
                    f"summarization should contain all the important details in a readable form. Be concise."
                    + postfix
            ),
        },
    ]
    return current_message


def _gen_lawyer_message(summaries: List[str]) -> List[Dict[str, str]]:
    current_message = [
        {
            "role": "system",
            "content": (
                "You are a lawyer who analyzes snippets court cases based on their transcripts/summaries. Provide "
                "insightful and interesting commentary on the proceedings of the cases. Keep your comments short and "
                "to the point, do not give an introduction or conclusion."
            ),
        },
        {
            "role": "user",
            "content": (
                f'Analyze the following proceedings and give unique and interesting opinions on it. Clarify any points '
                f'that may not be accessible to a general audience."{' '.join(summaries)}"'
            ),
        },
    ]
    return current_message
