from openai import OpenAI

YOUR_API_KEY = "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"
MODEL_NAME_HERE = "llama-3.1-sonar-small-128k-online"


messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence assistant and you need to "
            "engage in a helpful, detailed, polite conversation with a user."
        ),
    },
    {
        "role": "user",
        "content": (
            "How many stars are in the universe?"
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# chat completion without streaming
response = client.chat.completions.create(
    model=MODEL_NAME_HERE,
    messages=messages,
)
print(response)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model=MODEL_NAME_HERE,
    messages=messages,
    stream=True,
)
for response in response_stream:
    print(response)
