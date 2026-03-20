from fastapi import APIRouter, HTTPException
from winsdk.windows.services.store import StoreContext, StorePurchaseStatus
import configparser
import os

router = APIRouter()
CONFIG_PATH = os.path.abspath("../user_data/.config")

@router.post("/ms-purchase")
async def process_ms_purchase(plan_type: str):
    # Mapping plan types to your actual Microsoft Store Add-on IDs
    store_ids = {
        "pro": "9NBLGGH4R3PV", 
        "enterprise": "9NBLGGH4R3PN"
    }
    
    store_id = store_ids.get(plan_type)
    if not store_id:
        raise HTTPException(status_code=400, detail="Invalid plan type")

    context = StoreContext.get_default()
    result = await context.request_purchase_async(store_id)

    if result.status == StorePurchaseStatus.SUCCEEDED:
        update_config(plan_type)
        return {"status": "success", "source": "microsoft_store"}
    
    raise HTTPException(status_code=402, detail="Transaction cancelled or failed")

def update_config(tier):
    config = configparser.ConfigParser()
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    if os.path.exists(CONFIG_PATH):
        config.read(CONFIG_PATH)
    if 'LICENSE' not in config:
        config.add_section('LICENSE')
    config.set('LICENSE', 'tier', tier)
    config.set('LICENSE', 'active', 'true')
    with open(CONFIG_PATH, 'w') as f:
        config.write(f)
