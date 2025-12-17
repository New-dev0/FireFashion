from curl_cffi import requests
import json
import time
import random
from typing import Optional, List, Dict

class MyntraScraper:
    """
    Scraper for Myntra using server-side rendered data extraction.
    Mimics browser behavior to extract the hidden 'window.__myx' JSON blob.
    """
    
    def __init__(self):
        self.base_url = "https://www.myntra.com"
        self.headers = {
            "authority": "www.myntra.com",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
            "sec-ch-ua": '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
        self.session = requests.Session()

    def _extract_myx(self, html: str) -> Optional[Dict]:
        """
        Extracts the window.__myx JSON blob from HTML.
        This contains the preloaded Redux state with all product data.
        """
        start_marker = "window.__myx ="
        start_index = html.find(start_marker)
        
        if start_index == -1:
            return None
            
        # Move past marker
        content_start = start_index + len(start_marker)
        
        # Find the end of the script tag
        end_index = html.find("</script>", content_start)
        if end_index == -1:
            return None
            
        json_text = html[content_start:end_index].strip()
        
        # Clean up semicolon
        if json_text.endswith(";"):
            json_text = json_text[:-1]
            
        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            return None

    def _fetch_with_retry(self, url: str) -> Optional[str]:
        """Fetch URL with exponential backoff retry logic."""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.session.get(
                    url, 
                    headers=self.headers, 
                    impersonate="chrome120",
                    timeout=15
                )
                
                if response.status_code == 200:
                    return response.text
                elif response.status_code in [403, 429]:
                    sleep_time = (attempt + 1) * 2
                    print(f"Myntra Blocked ({response.status_code}). Retrying in {sleep_time}s...")
                    time.sleep(sleep_time)
                else:
                    print(f"Myntra Error {response.status_code}")
                    return None
                    
            except Exception as e:
                print(f"Request Error: {e}")
                time.sleep(1)
                
        return None

    def search(self, query: str, page: int = 1) -> List[Dict]:
        """
        Search for products on Myntra.
        
        Args:
            query (str): Search term
            page (int): Page number
            
        Returns:
            list: List of product dictionaries
        """
        clean_query = query.replace(" ", "-")
        url = f"{self.base_url}/{clean_query}?rawQuery={query}&p={page}"
        
        print(f"Fetching {url}...")
        html = self._fetch_with_retry(url)
        
        if not html:
            return []
            
        data = self._extract_myx(html)
        if not data or "searchData" not in data:
            print("Failed to extract valid search data (Structure might have changed).")
            return []
            
        products = data["searchData"].get("results", {}).get("products", [])
        
        formatted_products = []
        for item in products:
            # Extract image URLs
            img_list = []
            for img_obj in item.get("images", []):
                 if isinstance(img_obj, dict) and "src" in img_obj:
                     img_list.append(img_obj["src"])
                 elif isinstance(img_obj, str):
                     img_list.append(img_obj)
            
            # Dedupe images
            img_list = list(dict.fromkeys(img_list))
            
            # Fallback image
            if not img_list and item.get("searchImage"):
                img_list.append(item.get("searchImage"))

            formatted_products.append({
                "id": item.get("productId"),
                "name": item.get("productName"),
                "brand": item.get("brand"),
                "price": item.get("price"),
                "original_price": item.get("mrp"),
                "discount": item.get("discount"),
                "rating": item.get("rating"),
                "review_count": item.get("ratingCount"),
                "images": img_list,
                "url": f"https://www.myntra.com/{item.get('landingPageUrl')}" if item.get("landingPageUrl") else None,
                "description": item.get("productAdditionalInfo")
            })
            
        return formatted_products

    def get_product(self, product_id: str) -> Optional[Dict]:
        """
        Get single product details.
        
        Note: Currently re-uses search logic as typically product ID 
        search redirects to PDP or shows single result in search API.
        """
        results = self.search(str(product_id), page=1)
        return results[0] if results else None

