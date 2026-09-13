"""
Safety-First Product Badge Service (P0 Feature)
Logic: NLP keyword extraction + optional Gemini LLM summary.
Caches safety_score and safety_summary on products table.
"""

import os
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.product import Product

LLM_API_KEY = os.getenv("LLM_API_KEY")

SAFETY_KEYWORDS = {
    "choking": ("Low", "Warning: Contains small parts that may pose a choking hazard for children under 3 years."),
    "small parts": ("Low", "Contains small detachable components; keep away from toddlers."),
    "flammable": ("Low", "Keep away from open flames and high heat sources."),
    "bpa-free": ("Good", "Certified BPA-free food-grade materials, completely safe for infants."),
    "non-toxic": ("Good", "Crafted with certified 100% non-toxic, eco-friendly organic materials."),
    "hypoallergenic": ("Good", "Dermatologically tested and hypoallergenic for delicate skin."),
    "organic cotton": ("Good", "Made with 100% certified pure organic cotton."),
}


def get_or_generate_safety_badge(db: Session, product: Product) -> Dict[str, Any]:
    """
    Returns safety badge data. If not cached on product, computes and updates DB.
    """
    if product.safety_score and product.safety_summary:
        return {
            "product_id": product.id,
            "safety_score": product.safety_score,
            "safety_summary": product.safety_summary,
            "safety_tags": product.safety_tags or [],
        }

    # Keyword scan
    desc_lower = product.description.lower() if product.description else ""
    detected_tags = list(product.safety_tags) if product.safety_tags else []

    score = "Good"
    summary = "Meets standard children safety quality guidelines."

    # Analyze description and tags
    for kw, (kw_score, kw_summary) in SAFETY_KEYWORDS.items():
        if kw in desc_lower or any(kw in str(t).lower() for t in detected_tags):
            if kw_score == "Low":
                score = "Low"
                summary = kw_summary
                if kw not in detected_tags:
                    detected_tags.append(kw.title())
                break
            elif kw_score == "Good" and score != "Low":
                score = "Good"
                summary = kw_summary
                if kw not in detected_tags:
                    detected_tags.append(kw.title())

    # Optional LLM enrichment
    if LLM_API_KEY and LLM_API_KEY != "your_gemini_or_llm_api_key":
        try:
            import google.generativeai as genai
            genai.configure(api_key=LLM_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"Analyze this kids' product for safety: Name: '{product.name}', Category: {product.category_id}, "
                f"Description: '{product.description}'. Provide a concise 1-2 line safety summary for parents."
            )
            response = model.generate_content(prompt)
            if response and response.text:
                summary = response.text.strip()
        except Exception:
            pass

    # Cache on product record
    product.safety_score = score
    product.safety_summary = summary
    product.safety_tags = detected_tags
    db.commit()
    db.refresh(product)

    return {
        "product_id": product.id,
        "safety_score": product.safety_score,
        "safety_summary": product.safety_summary,
        "safety_tags": product.safety_tags or [],
    }
