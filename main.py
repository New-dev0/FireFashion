from fastapi import FastAPI, HTTPException, Query
from scraper import MeeshoScraper
from myntra_scraper import MyntraScraper
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="E-Commerce Scraper API (Meesho + Myntra)",
    description="Unofficial API for searching and retrieving product data from Meesho and Myntra.",
    version="2.0.0"
)

meesho_scraper = MeeshoScraper()
myntra_scraper = MyntraScraper()

@app.get("/", tags=["General"])
def read_root():
    return {
        "message": "Welcome to the E-Commerce Scraper API",
        "usage": {
            "meesho_search": "/meesho/search?q=query&page=1",
            "meesho_product": "/meesho/product/{product_id}",
            "myntra_search": "/myntra/search?q=query&page=1",
            "docs": "/docs"
        }
    }

# --- Meesho Endpoints ---
@app.get("/meesho/search", tags=["Meesho"])
def search_meesho(
    q: str = Query(..., description="Search query term"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page")
):
    """Search for products on Meesho."""
    results = meesho_scraper.search(q, page=page, limit=limit)
    return {
        "platform": "meesho",
        "query": q,
        "page": page,
        "count": len(results),
        "results": results
    }

@app.get("/meesho/product/{product_id}", tags=["Meesho"])
def get_meesho_product(product_id: str):
    """Get single Meesho product."""
    product = meesho_scraper.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- Myntra Endpoints ---
@app.get("/myntra/search", tags=["Myntra"])
def search_myntra(
    q: str = Query(..., description="Search query term"),
    page: int = Query(1, ge=1, description="Page number")
):
    """Search for products on Myntra."""
    results = myntra_scraper.search(q, page=page)
    return {
        "platform": "myntra",
        "query": q,
        "page": page,
        "count": len(results),
        "results": results
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
