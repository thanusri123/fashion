from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import logging
import uuid
from datetime import datetime
import asyncio
import json
import aiohttp
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# FastAPI app setup
app = FastAPI(title="Fashion Discovery Platform", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    price: float
    original_price: Optional[float] = None
    currency: str = "USD"
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    images: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    tags: List[str] = []
    rating: Optional[float] = None
    reviews_count: int = 0
    availability: bool = True
    url: Optional[str] = None
    trend_score: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StylePreference(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    style_type: str  # casual, formal, streetwear, bohemian, etc.
    preferred_colors: List[str] = []
    preferred_brands: List[str] = []
    preferred_categories: List[str] = []
    size_preferences: Dict[str, str] = {}  # {"tops": "M", "bottoms": "32", "shoes": "9"}
    budget_range: Dict[str, float] = {"min": 0, "max": 1000}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OutfitRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    occasion: str  # casual, work, party, date, etc.
    products: List[str]  # product IDs
    style_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    preferences: Optional[StylePreference] = None
    saved_products: List[str] = []
    liked_outfits: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Mock fashion data for demo (will be replaced with real API calls)
MOCK_FASHION_DATA = [
    {
        "id": "1",
        "name": "Classic Denim Jacket",
        "brand": "Levi's",
        "price": 89.99,
        "original_price": 120.00,
        "currency": "USD",
        "category": "Jackets",
        "subcategory": "Denim",
        "description": "Timeless denim jacket perfect for layering",
        "images": ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&h=600&fit=crop"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Blue", "Black", "Light Blue"],
        "tags": ["casual", "denim", "classic"],
        "rating": 4.5,
        "reviews_count": 127,
        "availability": True,
        "trend_score": 85
    },
    {
        "id": "2",
        "name": "Floral Summer Dress",
        "brand": "Zara",
        "price": 49.99,
        "currency": "USD",
        "category": "Dresses",
        "subcategory": "Summer",
        "description": "Light and airy floral dress perfect for summer",
        "images": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop"],
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Floral", "Pink", "Blue"],
        "tags": ["summer", "floral", "feminine"],
        "rating": 4.2,
        "reviews_count": 89,
        "availability": True,
        "trend_score": 92
    },
    {
        "id": "3",
        "name": "Streetwear Hoodie",
        "brand": "Nike",
        "price": 75.00,
        "currency": "USD",
        "category": "Hoodies",
        "subcategory": "Streetwear",
        "description": "Comfortable oversized hoodie with urban style",
        "images": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "Grey", "White", "Red"],
        "tags": ["streetwear", "comfort", "urban"],
        "rating": 4.7,
        "reviews_count": 203,
        "availability": True,
        "trend_score": 78
    },
    {
        "id": "4",
        "name": "Leather Ankle Boots",
        "brand": "Dr. Martens",
        "price": 159.99,
        "currency": "USD",
        "category": "Shoes",
        "subcategory": "Boots",
        "description": "Durable leather boots with iconic style",
        "images": ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop"],
        "sizes": ["6", "7", "8", "9", "10", "11"],
        "colors": ["Black", "Brown", "Cherry Red"],
        "tags": ["boots", "leather", "durable"],
        "rating": 4.8,
        "reviews_count": 156,
        "availability": True,
        "trend_score": 73
    },
    {
        "id": "5",
        "name": "Silk Blouse",
        "brand": "H&M",
        "price": 39.99,
        "currency": "USD",
        "category": "Tops",
        "subcategory": "Blouses",
        "description": "Elegant silk blouse for professional wear",
        "images": ["https://images.unsplash.com/photo-1564257577-6b0b3e6b9d4e?w=500&h=600&fit=crop"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Black", "Navy", "Blush"],
        "tags": ["professional", "silk", "elegant"],
        "rating": 4.3,
        "reviews_count": 94,
        "availability": True,
        "trend_score": 67
    }
]

# Helper function to seed database
async def seed_database():
    """Seed database with mock fashion data"""
    try:
        # Check if products already exist
        existing_count = await db.products.count_documents({})
        if existing_count == 0:
            # Insert mock data
            await db.products.insert_many(MOCK_FASHION_DATA)
            logger.info(f"Seeded database with {len(MOCK_FASHION_DATA)} products")
        else:
            logger.info(f"Database already has {existing_count} products")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

# API Routes
@app.get("/api/")
async def root():
    return {"message": "Fashion Discovery Platform API", "version": "1.0.0"}

@app.get("/api/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: float = 0,
    max_price: float = 10000,
    search: Optional[str] = None,
    sizes: Optional[str] = Query(None),
    colors: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    sort_by: str = "trend_score",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0
):
    """Get products with advanced filtering and sorting"""
    query = {
        "price": {"$gte": min_price, "$lte": max_price},
        "availability": True
    }
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    
    if sizes:
        size_list = [s.strip() for s in sizes.split(",")]
        query["sizes"] = {"$in": size_list}
    
    if colors:
        color_list = [c.strip() for c in colors.split(",")]
        query["colors"] = {"$in": color_list}
    
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        query["tags"] = {"$in": tag_list}
    
    # Sort configuration
    sort_direction = -1 if sort_order == "desc" else 1
    
    try:
        products = await db.products.find(query).sort(sort_by, sort_direction).skip(offset).limit(limit).to_list(length=limit)
        return [Product(**product) for product in products]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/products/trending", response_model=List[Product])
async def get_trending_products(limit: int = 10):
    """Get trending products based on trend score"""
    try:
        products = await db.products.find({"availability": True}).sort("trend_score", -1).limit(limit).to_list(length=limit)
        return [Product(**product) for product in products]
    except Exception as e:
        logger.error(f"Error fetching trending products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    try:
        product = await db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return Product(**product)
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/categories")
async def get_categories():
    """Get all available product categories"""
    try:
        categories = await db.products.distinct("category")
        subcategories = await db.products.distinct("subcategory")
        return {
            "categories": categories,
            "subcategories": [sc for sc in subcategories if sc is not None]
        }
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/brands")
async def get_brands():
    """Get all available brands"""
    try:
        brands = await db.products.distinct("brand")
        return {"brands": sorted(brands)}
    except Exception as e:
        logger.error(f"Error fetching brands: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/filters")
async def get_filters():
    """Get all available filter options"""
    try:
        categories = await db.products.distinct("category")
        brands = await db.products.distinct("brand")
        sizes = await db.products.distinct("sizes")
        colors = await db.products.distinct("colors")
        tags = await db.products.distinct("tags")
        
        # Flatten nested arrays
        all_sizes = set()
        all_colors = set()
        all_tags = set()
        
        for size_list in sizes:
            all_sizes.update(size_list)
        for color_list in colors:
            all_colors.update(color_list)
        for tag_list in tags:
            all_tags.update(tag_list)
        
        return {
            "categories": sorted(categories),
            "brands": sorted(brands),
            "sizes": sorted(list(all_sizes)),
            "colors": sorted(list(all_colors)),
            "tags": sorted(list(all_tags))
        }
    except Exception as e:
        logger.error(f"Error fetching filters: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/products/{product_id}/like")
async def like_product(product_id: str):
    """Increase trend score for a product (like functionality)"""
    try:
        result = await db.products.update_one(
            {"id": product_id},
            {"$inc": {"trend_score": 1}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Broadcast update to connected clients
        await manager.broadcast(f"PRODUCT_LIKED:{product_id}")
        
        return {"message": "Product liked successfully"}
    except Exception as e:
        logger.error(f"Error liking product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    """Initialize database with mock data"""
    await seed_database()

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection"""
    client.close()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)