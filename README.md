### Live legal case summariser

This product is part of HackTrinity 2024 GenAI x Legal. We have built a live summariser of legal cases with a few extra features.

#### Technical
Setting up local instances:

You must have a `PERPLEXITY_API_KEY` defined in `api/.env` for this to work.

```bash
## installation
$ cd live-app-sum
$ npm install
$ cd ..
$ python3 -m venv .venv
$ pip install -r requirements.txt
$ source .venv/bin/activate

## running the services requires three terminal windows
### window 1
$ npm run start --prefix=live-app-sum

### window 2
$ cd bet
$ python betserver.py

### window 3
$ cd api
$ python app.py
```

Go to `http://localhost:3000` and select a case.


The intention of this is to work with a live video / audio stream that is processed on the fly. For our proof of concept, we load the audio file of one of OJ Simpson's court appearances (`api/oj1.wav`). This file was 2 hours long so is processed in chunks of 1 minute. Each chunk is sent to a [perplexity](https://perplexit.ai) model (`llama-3.1-sonar-large-128k-online`) for a summary. Once a summary is completed, it is sent via a websocket notification to any clients subscribed to this particular court case. At the same time, the summaries are piped to the same model with a different prompt to provide an "AI expert opinion". These opinions are also published to the clients with websockets.
