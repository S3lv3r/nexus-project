import math
import random
from typing import Tuple

class PricingEngine:
    def calculate_initial_price(self, rating: float = 75.0, hypes: int = 0, follows: int = 0, rating_count: int = 0) -> float:
        norm_rating = max(10.0, min(100.0, rating if rating else 75.0))
        norm_hypes = min(1500, hypes if hypes else 0)
        norm_follows = min(15000, follows if follows else 0)
        norm_votes = min(10000, rating_count if rating_count else 0)

        base_from_rating = norm_rating * 0.85
        hype_bonus = math.log1p(norm_hypes) * 5.0
        follows_bonus = math.log1p(norm_follows) * 3.5
        votes_bonus = math.log1p(norm_votes) * 2.8

        raw_price = base_from_rating + hype_bonus + follows_bonus + votes_bonus
        return round(max(10.0, raw_price), 2)

    def calculate_sentiment_score(self, rating: float = 75.0, hypes: int = 0, change_24h: float = 0.0) -> float:
        norm_rating = max(0.0, min(100.0, rating if rating else 75.0))
        hype_factor = min(35.0, (hypes if hypes else 0) * 0.08)
        momentum = max(-25.0, min(25.0, change_24h))

        sentiment = (norm_rating * 0.5) + (hype_factor * 0.8) + (momentum * 0.5) + 12.0
        return round(max(5.0, min(99.0, sentiment)), 1)

    def apply_trade_impact(self, current_price: float, quantity: float, is_buy: bool, liquidity_depth: float = 5000.0) -> Tuple[float, float]:
        order_value = current_price * quantity
        impact_ratio = order_value / (order_value + liquidity_depth)
        max_slippage = 0.08
        actual_impact = min(max_slippage, impact_ratio)

        if is_buy:
            execution_price = current_price * (1.0 + (actual_impact * 0.5))
            new_price = current_price * (1.0 + actual_impact)
        else:
            execution_price = current_price * (1.0 - (actual_impact * 0.5))
            new_price = current_price * (1.0 - actual_impact)

        return round(max(1.0, execution_price), 2), round(max(1.0, new_price), 2)

    def generate_market_tick_price(self, current_price: float, sentiment_score: float, rating: float = 75.0, hypes: int = 0) -> float:
        sentiment_bias = (sentiment_score - 50.0) / 450.0
        random_shock = random.gauss(0.0, 0.018)
        total_delta_pct = sentiment_bias + random_shock

        max_tick_pct = 0.06
        bounded_delta = max(-max_tick_pct, min(max_tick_pct, total_delta_pct))
        new_price = current_price * (1.0 + bounded_delta)
        return round(max(1.0, new_price), 2)

pricing_engine = PricingEngine()
