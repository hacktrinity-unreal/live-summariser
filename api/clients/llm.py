from openai import OpenAI, Stream
import os

from openai.types.chat import ChatCompletionChunk

BASE_URL = "https://api.perplexity.ai"
API_KEY = os.environ["PERPLEXITY_API_KEY"]

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)


def punctuate_transcription(raw_text: str) -> Stream[ChatCompletionChunk]:
    messages = [
        {
            "role": "system",
            "content": (
                "You are a court reporter. I will provide you with the raw text from a transcription of a court case "
                "which will not contain any punctuation. I want you to punctuate the text, ensuring the grammar rules "
                "of english are upheld. Ensure you only return exactly the updated text with no additional comments."
            ),
        },
        {
            "role": "user",
            "content": raw_text
        },
    ]

    response = client.chat.completions.create(
        messages=messages,
        model="llama-3.1-sonar-small-128k-online",
        stream=True
    )

    return response
