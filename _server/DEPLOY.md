# Deploying the E-Commerce Scraper API

Since this API is hosted in a subdirectory (`_server`) of your main repository, you need to configure your hosting provider to look in that folder.

## Option 1: Render (Recommended - Free Tier)

1.  Push your code to **GitHub**.
2.  Sign up at [render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Important Settings**:
    *   **Root Directory**: `_server`  <-- *Crucial step!*
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6.  Click **Create Web Service**.

## Option 2: Railway

1.  Sign up at [railway.app](https://railway.app).
2.  Start a **New Project** -> **Deploy from GitHub repo**.
3.  Select your repo.
4.  Go to **Settings** -> **Root Directory** and set it to `/_server`.
5.  Railway usually auto-detects the `Procfile` and `requirements.txt` once the root is set.
6.  If not, set the Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Option 3: GitHub Codespaces (For Development)

If you just want to run it in the cloud for testing/development:
1.  Go to your GitHub repo.
2.  Click **Code** -> **Codespaces** -> **Create codespace on main**.
3.  In the terminal there, run:
    ```bash
    cd _server
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
4.  Codespaces will pop up a notification to "Open in Browser" or make the port public.
