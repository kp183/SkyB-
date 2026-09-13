import os
import sys
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv

# Ensure root directory is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.routers import (
    auth_router,
    products_router,
    categories_router,
    reviews_router,
    cart_router,
    wishlist_router,
    bargain_router,
    orders_router,
    ai_features_router,
    admin_router,
    children_router,
    coupons_router,
)

load_dotenv()

app = FastAPI(
    title="SkyB — AI-Powered Kids' E-Commerce API",
    description="Backend API supporting catalog, cart, checkout, mock payments, admin CRUD, and AI features.",
    version="1.0.0",
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers enforcing standard JSON shape: { "data": ..., "error": ... }
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"data": None, "error": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg") if errors else "Validation error"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"data": None, "error": f"Validation error: {first_msg}"},
    )


# Health Check
@app.get("/health", tags=["System"])
def health_check():
    return {"data": {"status": "ok", "app": "SkyB API", "version": "1.0.0"}, "error": None}


# Register all routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(reviews_router)
app.include_router(cart_router)
app.include_router(wishlist_router)
app.include_router(bargain_router)
app.include_router(orders_router)
app.include_router(ai_features_router)
app.include_router(admin_router)
app.include_router(children_router)
app.include_router(coupons_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
