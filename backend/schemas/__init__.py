from backend.schemas.common import ApiResponse
from backend.schemas.user import UserRegister, UserLogin, UserResponse, AuthResponse
from backend.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from backend.schemas.category import CategoryCreate, CategoryResponse
from backend.schemas.cart import CartAddRequest, CartUpdateRequest, CartItemResponse, CartSummaryResponse
from backend.schemas.wishlist import WishlistAddRequest, WishlistItemResponse
from backend.schemas.order import CheckoutRequest, MockPayRequest, OrderResponse, OrderItemResponse, MockPayResponse
from backend.schemas.bargain import (
    BargainStartRequest,
    BargainStartResponse,
    BargainOfferRequest,
    BargainOfferResponse,
    BargainAcceptRequest,
    BargainAcceptResponse,
)
from backend.schemas.coupon import CouponCreate, CouponUpdate, CouponResponse
from backend.schemas.child import ChildCreate, ChildUpdate, ChildResponse
from backend.schemas.review import ReviewCreate, ReviewResponse
from backend.schemas.ai import (
    SafetyBadgeResponse,
    SubstituteResponse,
    SizeSuggestionResponse,
    ReorderPredictionResponse,
    BundleSuggestionResponse,
)

__all__ = [
    "ApiResponse",
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "AuthResponse",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "CategoryCreate",
    "CategoryResponse",
    "CartAddRequest",
    "CartUpdateRequest",
    "CartItemResponse",
    "CartSummaryResponse",
    "WishlistAddRequest",
    "WishlistItemResponse",
    "CheckoutRequest",
    "MockPayRequest",
    "OrderResponse",
    "OrderItemResponse",
    "MockPayResponse",
    "BargainStartRequest",
    "BargainStartResponse",
    "BargainOfferRequest",
    "BargainOfferResponse",
    "BargainAcceptRequest",
    "BargainAcceptResponse",
    "CouponCreate",
    "CouponUpdate",
    "CouponResponse",
    "ChildCreate",
    "ChildUpdate",
    "ChildResponse",
    "ReviewCreate",
    "ReviewResponse",
    "SafetyBadgeResponse",
    "SubstituteResponse",
    "SizeSuggestionResponse",
    "ReorderPredictionResponse",
    "BundleSuggestionResponse",
]
