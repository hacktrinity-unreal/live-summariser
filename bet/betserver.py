from aiohttp import web
import json
from bet import Bet

PATH = "bets.json"


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
}


async def handle_add_bet(request):
    data = await request.json()
    
    bet = Bet(PATH)

    print(bet.get_odds())

    stake = data["stake"] if "stake" in data else 1
    position = data["position"] if "position" in data else "guilty"
    bet.add_bet(stake, position)
    bet.save_to(PATH)

    response_data = {"status": "success", "received": data}
    return web.json_response(body=json.dumps(response_data), headers=CORS_HEADERS)


async def handle_get_returns(request):
    bet = Bet(PATH)

    prob2odds = lambda x: x / (1 - x    )
    response = json.dumps(
        {
            "guilty": round(prob2odds(bet.get_odds()[0]), 4),
            "not_guilty": round(prob2odds(bet.get_odds()[1]), 4),
        }
    )
    return web.json_response(body=response, headers=CORS_HEADERS)


app = web.Application()
# position is either "guilty" or "not_guilty"
app.add_routes(
    [web.post("/bet", handle_add_bet), web.get("/get_returns", handle_get_returns)]
)

if __name__ == "__main__":
    web.run_app(app)
