import requests
import json
print(json.loads(requests.get("http://0.0.0.0:8080/get_returns").content))