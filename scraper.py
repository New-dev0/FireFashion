from curl_cffi import requests
import time
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

    def _fetch_page(self, payload):
        """Helper to fetch a single page with retries."""
        for attempt in range(3):
            try:
                # Impersonate Chrome to bypass basic anti-bot checks
                response = self.session.post(
                    self.base_url,
                    json=payload,
                    headers=self.headers,
                    impersonate="chrome120",
                    timeout=10
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 403:
                    print(f"Access Denied (403) on attempt {attempt + 1}. Retrying...")
                    time.sleep(2 * (attempt + 1))
                else:
                    print(f"Error {response.status_code} on attempt {attempt + 1}")
                    
            except Exception as e:
                print(f"Exception on attempt {attempt + 1}: {e}")
                time.sleep(1)
        
        return None

    def search(self, query: str, page: int = 1, limit: int = 20) -> list:
        """
        Search for products on Meesho.
        :param query: Search term (e.g., 'tshirt')
        :param page: Page number (1-based)
        :param limit: Number of items per page
        :return: List of product dictionaries
        """
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

        data = self._fetch_page(payload)
        if not data:
            return []

        catalogs = data.get("catalogs", [])
        products = []
        
        for item in catalogs:
            reviews = item.get("catalog_reviews_summary", {})
            
            # Extract high-res images from the 'product_images' list if available,
            # otherwise fallback to 'image' or 'images' fields.
            raw_images = item.get("product_images", [])
            image_urls = [img.get('url') for img in raw_images if img.get('url')]
            
            if not image_urls:
                 # Fallback
                 if item.get("image"):
                     image_urls.append(item.get("image"))
                 if isinstance(item.get("images"), list):
                      for img in item.get("images"):
                           if isinstance(img, str):
                                image_urls.append(img)
            
            # Deduplicate while preserving order
            image_urls = list(dict.fromkeys(image_urls))

            product = {
                "id": item.get("id"),
                "product_id": item.get("product_id"), # Alphanumeric code often used in URLs
                "name": item.get("name"),
                "price": item.get("min_product_price"),
                "original_price": item.get("min_catalog_price"),
                "discount": 0, # Calculate if needed
                "category_id": item.get("category_id"),
                "category_name": item.get("sub_sub_category_name"),
                "description": item.get("description"),
                "cover_image": item.get("image"),
                "images": image_urls,
                "rating": reviews.get("average_rating"),
                "review_count": reviews.get("review_count"),
                "url": f"https://www.meesho.com/s/p/{item.get('product_id')}" if item.get("product_id") else None,
                "supplier_name": item.get("supplier_name"),
                "is_assured": item.get("assured_details", {}).get("is_assured", False)
            }
            
            if product["price"] and product["original_price"]:
                 product["discount"] = int(((product["original_price"] - product["price"]) / product["original_price"]) * 100)

            products.append(product)
            
        return products

    def get_product(self, product_id: str) -> dict:
        """
        Get details for a single product. 
        Note: We use the search endpoint with the product_id as the query 
        because the detailed PDP endpoint is heavily protected.
        """
        # "product_id" can be the numeric ID or the alphanumeric slug code.
        # The search API handles both well usually.
        results = self.search(product_id, limit=1)
        if results:
            return results[0]
        return None
