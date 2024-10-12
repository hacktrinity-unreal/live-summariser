from aiohttp import web
import json

async def handle_add_bet(request):
    request.Response
    
    return web.Response(status=200)

async def handle_get_returns(request):
    response = json.dumps({
        "guilty":1.5,
        "not_guilty":1.4

    })
    return web.json_response(body=response)



app = web.Application()
#position is either "guilty" or "not_guilty"
app.add_routes([web.get('/bet/{amount}/{position}', handle_add_bet),
                web.get('/get_returns', handle_get_returns)])

if __name__ == '__main__':
    web.run_app(app)