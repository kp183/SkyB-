"""
Bargain Assistant Service (P0 Headline AI Feature)
Logic: Rule-based bounds check + LLM for natural conversation phrasing only.
Never lets final price go below product.min_price.
Capped at 3 rounds max.
"""

import os
from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.models.bargain import BargainSession, BargainOffer
from backend.models.product import Product

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("LLM_API_KEY"))


def generate_bargain_message(
    product_name: str,
    offer_price: float,
    counter_price: float,
    round_number: int,
    is_accepted: bool,
    is_final_round: bool,
) -> str:
    """
    Generates a polite, natural negotiation message.
    Uses Gemini LLM API if configured; otherwise uses intelligent fallback templates.
    """
    if is_accepted:
        return f"Deal! I can accept ₹{offer_price:.2f} for the {product_name}. Let's add it to your cart!"

    if is_final_round:
        return (
            f"This is my best and final offer: ₹{counter_price:.2f} for the {product_name}. "
            f"I cannot go any lower than this!"
        )

    # Try Gemini API if key is present
    if GEMINI_API_KEY and GEMINI_API_KEY not in ["your_gemini_api_key", "your_gemini_or_llm_api_key"]:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"You are a friendly shop assistant for 'SkyB', an e-commerce store for kids' products. "
                f"A customer offered ₹{offer_price:.2f} for '{product_name}'. "
                f"Our counter-offer is ₹{counter_price:.2f} (Round {round_number} of 3). "
                f"Write a warm, concise 1-2 sentence response presenting this counter-offer."
            )
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception:
            pass

    # Deterministic fallback phrasing
    templates = [
        f"That's a bit low for this premium {product_name}, but I can do ₹{counter_price:.2f} for you!",
        f"We want to give you a great deal, but the best I can offer right now is ₹{counter_price:.2f}.",
        f"I can't match ₹{offer_price:.2f}, but how about we meet at ₹{counter_price:.2f}?",
    ]
    return templates[(round_number - 1) % len(templates)]


def process_offer(
    db: Session,
    session: BargainSession,
    product: Product,
    offer_price: float,
) -> Dict[str, Any]:
    """
    Processes one round of negotiation:
    1. Determines current round_number (max 3).
    2. Calculates rule-based counter_price strictly bounded by product.min_price.
    3. Phrases response using LLM or template.
    4. Records the round in bargain_offers.
    """
    existing_offers = (
        db.query(BargainOffer)
        .filter(BargainOffer.session_id == session.id)
        .order_by(BargainOffer.round_number.asc())
        .all()
    )
    round_number = len(existing_offers) + 1
    last_counter = float(existing_offers[-1].counter_price) if existing_offers else float(product.price)

    min_price = float(product.min_price)
    listed_price = float(product.price)

    is_final_round = round_number >= 3
    is_accepted = False

    # Rule-based pricing logic with realistic multi-round progression
    if offer_price >= listed_price:
        counter_price = listed_price
        is_accepted = True
    elif offer_price >= min_price:
        if is_final_round:
            # Round 3 (Final): Customer offered at/above floor -> accept customer offer!
            counter_price = offer_price
            is_accepted = True
        elif round_number == 1:
            # Round 1: Counter slightly above offer (concede ~15% of the gap above offer)
            gap = listed_price - offer_price
            if gap <= 10.0:
                counter_price = offer_price
                is_accepted = True
            else:
                counter_price = round(offer_price + gap * 0.15, 2)
        else:
            # Round 2: Step down closer to offer (~40% of the remaining gap from last counter)
            gap = last_counter - offer_price
            if gap <= 10.0:
                counter_price = offer_price
                is_accepted = True
            else:
                counter_price = round(offer_price + gap * 0.40, 2)
    else:
        # Customer offer is strictly below min_price:
        # Step down store counter gracefully toward min_price across rounds
        margin = listed_price - min_price
        if is_final_round:
            # Final round: Hold firm at absolute min_price floor
            counter_price = min_price
        elif round_number == 1:
            # Round 1: 30% concession from listed toward min_price
            counter_price = round(listed_price - margin * 0.30, 2)
        else:
            # Round 2: 65% concession from listed toward min_price
            counter_price = round(listed_price - margin * 0.65, 2)

    # Absolute safety assertion: counter_price must NEVER fall below min_price
    counter_price = max(counter_price, min_price)

    # Generate phrasing
    message = generate_bargain_message(
        product_name=product.name,
        offer_price=offer_price,
        counter_price=counter_price,
        round_number=round_number,
        is_accepted=is_accepted,
        is_final_round=is_final_round,
    )

    # Record offer in bargain_offers
    offer = BargainOffer(
        session_id=session.id,
        round_number=round_number,
        offer_price=offer_price,
        counter_price=counter_price,
        message=message,
    )
    db.add(offer)

    # Update session status if deal is agreed or maximum rounds reached
    if is_accepted:
        session.status = "ongoing"  # Customer still calls /accept to put in cart
    elif is_final_round:
        session.status = "ongoing"

    db.commit()
    db.refresh(offer)

    return {
        "counter_price": float(counter_price),
        "message": message,
        "round_number": round_number,
        "status": session.status,
        "is_final_round": is_final_round,
    }
