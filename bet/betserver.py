from aiohttp import web
import json
from bet import Bet
PATH = "bets.json"


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
}


async def handle_add_bet(request):
    data = await request.json()
    bet = Bet(PATH)
    
    print(data)

    stake = data['stake'] if 'stake' in data else 1
    position = data['position'] if 'position' in data else 'guilty'
    bet.add(stake,position)
    bet.save_to(PATH)

    
    response_data = {
            'status': 'success',
            'received': data
        }
    return web.json_response(body=response_data, headers=CORS_HEADERS)

async def handle_get_returns(request):
    bet = Bet(PATH)

    prob2odds = lambda x:x/(x-1)
    response = json.dumps({
        "guilty":prob2odds(bet.get_odds()[0]),
        "not_guilty":prob2odds(bet.get_odds()[1])

    })
    return web.json_response(body=response, headers=CORS_HEADERS)



app = web.Application()
#position is either "guilty" or "not_guilty"
app.add_routes([web.get('/bet', handle_add_bet),
                web.get('/get_returns', handle_get_returns)])

if __name__ == '__main__':
    web.run_app(app)
