import json
from curl_cffi import requests
import time
import sys
import random

class MeeshoScraper:
    def __init__(self):
        self.base_url = "https://www.meesho.com/api/v1/products/search"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "meesho-iso-country-code": "IN",
            "Origin": "https://www.meesho.com",
            "Referer": "https://www.meesho.com/",
        }
        self.session = requests.Session()

    def search(self, query, num_pages=1):
        all_products = []
        limit = 20
        
        print(f"Starting scrape for query: '{query}'")

        for page in range(1, num_pages + 1):
            offset = (page - 1) * limit
            
            payload = {
                "query": query,
                "type": "text_search",
                "page": page,
                "offset": offset,
                "limit": limit,
                "cursor": None,
                "isDevicePhone": False
            }

            try:
                print(f"Fetching page {page}...")
                response = self.session.post(
                    self.base_url,
                    json=payload,
                    headers=self.headers,
                    impersonate="chrome120"
                )
                
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}. Status: {response.status_code}")
                    print(response.text[:200])
                    break
                
                data = response.json()
                catalogs = data.get("catalogs", [])
                
                if not catalogs:
                    print("No more products found (empty catalogs list).")
                    break
                
                for item in catalogs:
                    reviews = item.get("catalog_reviews_summary", {})
                    
                    product = {
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "price": item.get("min_product_price"),
                        "original_price": item.get("min_catalog_price"),
                        "category_id": item.get("category_id"),
                        "category_name": item.get("sub_sub_category_name"),
                        "description": item.get("description"),
                        "image": item.get("image"),
                        "images": [img.get('url') for img in item.get("product_images", [])] if item.get("product_images") else [item.get("image")],
                        "rating": reviews.get("average_rating"),
                        "review_count": reviews.get("review_count"),
                        "url": f"https://www.meesho.com/s/p/{item.get('product_id')}" if item.get("product_id") else None,
                        "supplier_name": item.get("supplier_name") # Might be missing, but good to check
                    }
                    all_products.append(product)
                
                print(f"Found {len(catalogs)} products on page {page}.")
                
                # Sleep briefly to be polite and avoid rate limits
                time.sleep(random.uniform(2, 4))

            except Exception as e:
                print(f"Error on page {page}: {e}")
                break
        
        return all_products

    def save_to_json(self, data, filename):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(data)} products to {filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python meesho.py <search_query> [num_pages]")
        sys.exit(1)
    
    query = sys.argv[1]
    pages = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    scraper = MeeshoScraper()
    results = scraper.search(query, num_pages=pages)
    
    output_file = f"meesho_{query.replace(' ', '_')}.json"
    scraper.save_to_json(results, output_file)
