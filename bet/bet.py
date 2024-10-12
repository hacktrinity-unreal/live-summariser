import json
class Bet:
    def __init__(self,path=None):
        self.bets = []

        if path:
            with open(path,"r") as f:
                self.bets = json.loads(f.read())

    def get_odds(self):

        guilty_payout, not_guilty_payout = self.get_payout()

        if guilty_payout == 0 and not_guilty_payout == 0:
            return 0.5, 0.5

        return 1 - guilty_payout / (
            guilty_payout + not_guilty_payout
        ), 1 - not_guilty_payout / (guilty_payout + not_guilty_payout)

    def add_bet(self, stake: float, position: str, uuid: str = None):
        odds = self.get_odds()
        guilty_payout, not_guilty_payout = 0, 0
        if position == "guilty":
            guilty_payout = odds[0] * stake
        else:
            not_guilty_payout = odds[1] * stake
        self.bets.append(
            {
                "stake": stake,
                "guilty_payout": guilty_payout,
                "not_guilty_payout": not_guilty_payout,
                "uuid": uuid,
            }
        )

    def get_payout(self):
        total_guilty, total_not_guilty = 0, 0
        for bet in self.bets:
            total_guilty += bet["guilty_payout"]
            total_not_guilty += bet["not_guilty_payout"]
        return total_guilty, total_not_guilty
    
    def save_to(self,path):
        with open(path,"w") as f:
            f.write(json.dumps(self.bets))
    


