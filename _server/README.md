# E-Commerce Scraper API (Meesho + Myntra) 🚀

A production-ready, unofficial API for retrieving product data from major Indian e-commerce platforms. Built with FastAPI and powered by custom `curl_cffi` scrapers that mimic real browser behavior to bypass anti-bot protections.

## ✨ Features

-   **Multi-Platform**: Support for **Meesho** and **Myntra**.
-   **Server-Ready API**: Fully functional REST API using FastAPI.
-   **Anti-Bot Bypass**: Uses `curl_cffi` to impersonate Chrome (TLS fingerprinting) and bypass 403 blocks / Akamai.
-   **Full Data Extraction**: 
    -   High-res images (multiple per product)
    -   Pricing, Discounts, MR
    -   Ratings & Review Counts
    -   Descriptions & Specifications
-   **Swagger Documentation**: Built-in interactive API docs at `/docs`.

## 🛠️ Installation

1.  **Navigate to the server directory**
    ```bash
    cd _server
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

## 🏃 Usage

### Start the Server
Run the FastAPI server:
```bash
uvicorn main:app --reload
```
The server will start at `http://127.0.0.1:8000`.

### API Endpoints

#### 🛍️ Meesho
- **Search**: `GET /meesho/search?q=saree&page=1`
- **Product**: `GET /meesho/product/{id}`

#### 🛍️ Myntra
- **Search**: `GET /myntra/search?q=tshirt&page=1`
  *(Note: Myntra product IDs are included in the search results. Myntra search covers most use cases.)*

## 🧠 Technical Deep Dive

### Meesho (CSR/API Strategy)
Meesho uses Client Side Rendering (CSR). We reverse-engineered their internal API (`/api/v1/products/search`) and used `curl_cffi` to bypass Akamai WAF protection by mimicking a Chrome TLS fingerprint. We discovered embedded image lists in the search API, avoiding the need for complex and blocked PDP scraping.

### Myntra (SSR Strategy)
Myntra uses Server Side Rendering (SSR) for its search pages. Instead of an XHR API, the data is embedded in a global JavaScript variable `window.__myx` within the HTML.
**Our Approach**:
1. Fetch the search results page (e.g. `myntra.com/tshirt`).
2. Regex match the `window.__myx = {...}` script.
3. Parse the JSON blob to extract structured product data (images, prices, ratings) without executing any JavaScript.

## ⚠️ Disclaimer
This project is for **educational purposes only**. Scraping data from websites may violate their Terms of Service. Use responsibly and do not overwhelm their servers. This project is not affiliated with Meesho or Myntra.

## 📄 License
MIT License
