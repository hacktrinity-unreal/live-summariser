from bet import Bet
import random
import unittest
import os
import subprocess
import requests
import time
import json


class TestBet(unittest.TestCase):

    def test_runs(self):
        bet = Bet()

        for x in [
            (["guilty", "not_guilty"][random.randint(0, 1)], random.randint(1, 100))
            for _ in range(100)
        ]:
            bet.add_bet(x[1], x[0])
        self.assertAlmostEqual(sum(bet.get_odds()), 1)

    def test_save(self):
        bet = Bet()

        for x in [
            (["guilty", "not_guilty"][random.randint(0, 1)], random.randint(1, 100))
            for _ in range(100)
        ]:
            bet.add_bet(x[1], x[0])

        bet.save_to("bets.json")

        bet2 = Bet(path="bets.json")
        self.assertEqual(bet.bets, bet2.bets)

    def test_post(self):
        server = subprocess.Popen(["python", "betserver.py"])

        content = {
            "position": "guilty",
            "stake": 50,
        }
        time.sleep(2)
        r = requests.post("http://0.0.0.0:8080/bet", json=json.dumps(content))

        print(r)
        server.terminate()
        assert r.status_code == 200


if __name__ == "__main__":
    unittest.main()
