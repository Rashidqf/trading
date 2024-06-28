from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.trigger.bot import place_order, set_accounts, place_Trade
import urllib3

# Initiate the server
app = FastAPI()

# Custom CORSMiddleware to allow all origins (consider more specific origins in production)
class DynamicCORSMiddleware(CORSMiddleware):
    def is_allowed_origin(self, origin: str) -> bool:
        return True  # Allow all origins for development (change in production)

origins = [
    "http://localhost:3000",
    "http://localhost:9998/api"
]

# Ignore CORS for development (configure more granular CORS rules in production)
app.add_middleware(
    DynamicCORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=['Accept', 'Accept-Language', 'Content-Language', 'Content-Type'],
)

http = urllib3.PoolManager(maxsize=1000)  # Consider adjusting based on expected load

all_instance = []

@app.post("/api/order")
async def create_order(request: Request):
    """
    Get order from user and trigger the bot.

    Args:
        request: Request body from the user.

    Returns:
        Response indicating order received.
    """
    try:
        obj = await request.json()
        # print("obj",obj)
        data = place_order(all_instance, obj)
        print("returndata ",data)
        return {"status": data}
    except Exception as e:  # Catch and log general exceptions
        print(f"Error processing order: {e}")
        return {"error": "An error occurred while processing your order."}

@app.post("/api/trade")
async def create_order(request: Request):
    """
    Get order from user and trigger the bot for trade.

    Args:
        request: Request body from the user.

    Returns:
        Response indicating trade order received.
    """
    try:
        obj = await request.json()
        # print(obj)
        data = place_Trade(all_instance, obj)
        print("returndata ",data)
        return {"status": data}
    except Exception as e:  # Catch and log general exceptions
        print(f"Error processing trade: {e}")
        return {"error": "An error occurred while processing your trade order."}

@app.post("/api/accounts")
async def accounts(req: Request) -> dict:
    """
    Get all accounts and create bot instance.

    Args:
        request: Request body from the user.

    Returns:
        Response acknowledging receipt of accounts.
    """
    try:
        acc_objs = await req.json()
        set_accounts(all_instance, acc_objs)
        return {"message": "Accounts received"}
    except Exception as e:  # Catch and log general exceptions
        print(f"Error processing accounts: {e}")
        return {"error": "An error occurred while processing your accounts."}

# Run the FastAPI application (use appropriate server like Gunicorn)
# uvicorn main:app --host 0.0.0.0 --port 8000
