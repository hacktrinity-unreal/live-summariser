from bet import Bet
import random
import unittest

class TestBet(unittest.TestCase):

    def test_runs(self):
        bet = Bet()
        
        for x in [(["guilty","not_guilty"][random.randint(0,1)],random.randint(1,100)) for _ in range(100)]:
            bet.add_bet(x[1],x[0])
        self.assertEqual(sum(bet.get_odds()),1)

if __name__ == "__main__":
    unittest.main()