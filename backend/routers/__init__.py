from backend.routers.auth import router as auth_router
from backend.routers.products import router as products_router
from backend.routers.categories import router as categories_router
from backend.routers.reviews import router as reviews_router
from backend.routers.cart import router as cart_router
from backend.routers.wishlist import router as wishlist_router
from backend.routers.bargain import router as bargain_router
from backend.routers.orders import router as orders_router
from backend.routers.ai_features import router as ai_features_router
from backend.routers.admin import router as admin_router
from backend.routers.children import router as children_router
from backend.routers.coupons import router as coupons_router

__all__ = [
    "auth_router",
    "products_router",
    "categories_router",
    "reviews_router",
    "cart_router",
    "wishlist_router",
    "bargain_router",
    "orders_router",
    "ai_features_router",
    "admin_router",
    "children_router",
    "coupons_router",
]
