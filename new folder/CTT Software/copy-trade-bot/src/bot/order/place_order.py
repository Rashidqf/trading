from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains
import requests
from src.bot import xpaths
import threading

direction_value = None

def switch_multiple_window(driver, *args):
    process = threading.Thread(target=trade_order, args=(driver, *args))
    process.start()
    process.join()

def trade_order(driver, market_name, action_type, action_method, amount, hedging, order_level, 
                stop_limit, stop_or_trailing, points_away, at_price, guarantee, limit, 
                lAt_price, lPoints_away, status_url, id):
    
    global direction_value
    
    order_xpaths = xpaths.place_order

    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    
    # Placing order
    try:
        WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, order_xpaths['market_element'].format(market_name,action_type.capitalize())))).click()
    except:
        print("Element not found")
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Trade Desynchronised - Element not found"})
        return "Desyncronised"

    # Entering amount and clicking action button
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.clear()
        elem.send_keys(amount)
        WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(action_method)))).click()
    except Exception as e:
        print("Element not found")
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Trade Desyncronised"})
        return "Desyncronised"

    # Submitting order
    try:
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        sleep(.25)
    except Exception as e:
        return "Desyncronised"

    # Checking for successful order placement
    try:
        direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        tradeid = direction_element.text
        open_price_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnOpenPrice']")))
        open_price = open_price_element.text
        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        requests.post(status_url, verify=False, data={"id": id, "tradeId": tradeid, "status": "Active", "message": "Trade Active", "openPrice": open_price})
        return "Active"
    except Exception as e:
        requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Trade Desyncronised"})
        print("Error waiting for page to load after submission:")
        return "Desyncronised"
