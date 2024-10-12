from aiohttp import web
import json
from bet import Bet
PATH = "bets.json"
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
    return web.json_response(response_data)

async def handle_get_returns(request):
    bet = Bet(PATH)

    
    return web.json_response({
        "guilty":1.5,
        "not_guilty":1.4

    })



app = web.Application()
#position is either "guilty" or "not_guilty"
app.add_routes([web.get('/bet/{amount}/{position}', handle_add_bet),
                web.get('/get_returns', handle_get_returns)])

if __name__ == '__main__':
    web.run_app(app)