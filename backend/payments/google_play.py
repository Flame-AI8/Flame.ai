from fastapi import APIRouter, HTTPException
import httpx
import configparser
import os

router = APIRouter()
CONFIG_PATH = os.path.abspath("../user_data/.config")

@router.post("/google-verify")
async def verify_google_purchase(token: str, plan_type: str):
    # This validates the purchase with Google's Auth servers
    endpoint = f"https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.yourapp.id/purchases/products/{plan_type}/tokens/{token}"
    
    async with httpx.AsyncClient() as client:
        # In production, you must include an OAuth2 access_token header here
        response = await client.get(endpoint)
        
        if response.status_code == 200:
            update_config(plan_type)
            return {"status": "success", "source": "google_play"}
        
    raise HTTPException(status_code=400, detail="Invalid Google Play Token")

def update_config(tier):
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_PATH):
        config.read(CONFIG_PATH)
    if 'LICENSE' not in config:
        config.add_section('LICENSE')
    config.set('LICENSE', 'tier', tier)
    config.set('LICENSE', 'active', 'true')
    with open(CONFIG_PATH, 'w') as f:
        config.write(f)
