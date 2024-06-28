from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from time import sleep
import requests
from src.bot import xpaths


def order_ammend(
        driver, market_name: str,
        ammend_point_away: int,
        ammend_at_price: int,
        action_type: str, status_url: str,
        id: str, order_created, formatted_created_at, open_price: str,TradeId : str) -> bool:

    print("TradeId", TradeId)
    print("formatted_created_at", formatted_created_at)
    print("Market Name:", market_name)
    print("Amend Point Away:", ammend_point_away)
    print("Amend At Price:", ammend_at_price)
    print("Action Type:", action_type)
    print("Status URL:", status_url)
    print("ID:", id)
    print("order_created:", order_created)
    print("Order Created:", order_created)
    print("Open Price:", open_price)
    
    # Scroll to the end of the page
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.END)
    
    
    try:
        WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"].format(market_name)))).click()
        WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.XPATH, ammend_xpaths["ammend_order"].format(order_created)))).click()
        sleep(.2)
    except Exception as e:
        pass