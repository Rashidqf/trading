from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep, time
import requests
from src.bot import xpaths 
import threading

direction_value = None

def switch_multiple_window(driver, *args):
    process = threading.Thread(target=order_trade, args=(driver, *args))
    process.start()
    process.join()

def order_trade(driver, market_name:str, myamount:str, action_type:str, action_method:str, amount:int,
                hedging:bool, order_level:int, stop_limit:bool, stop_or_trailing:str,
                points_away:int, at_price:int, guarantee:bool, limit:bool,
                lAt_price:int, lPoints_away:int, status_url:str, id:str) -> str:
    global direction_value
    start_time = time()
    print(f"Time taken for clicking market element: {time() - start_time:.2f} seconds")
    
    order_xpaths = xpaths.place_trade 
    
    # Scroll to the top of the page
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    
    # Click on the market element
    try:
        action_type_formatted = "Order" 
        market_element_xpath = order_xpaths['market_element'].format(market_name, action_type_formatted.capitalize())
        start_time = time()
        WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, market_element_xpath))).click()
        print(f"Time taken for clicking market element: {time() - start_time:.2f} seconds")

    except Exception as e:
        print("Error clicking market element:", e)
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return "Desyncronised"

    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.send_keys(Keys.CONTROL + "a")
        elem.send_keys(Keys.DELETE)
        
        start_time = time()
        elem.send_keys(myamount)
        print(f"Time taken for filling amount input: {time() - start_time:.2f} seconds")
        
        start_time = time()
        driver.execute_script("arguments[0].value = arguments[1];", elem, myamount)
        print(f"Time taken for executing JavaScript to set amount: {time() - start_time:.2f} seconds")

    except Exception as e:
        print("Error filling amount input:", e)
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return "Desyncronised"
    
    # Determine action method
    if action_method == "buy":
        button_xpath = "//div[@class='buy-button']//div[@class='btn-buy']/label/span[text()='Buy']"
        action_description = "Buy"
    elif action_method == "sell":
        button_xpath = "//div[@class='sell-button']//div[@class='btn-sell']/label/span[text()='Sell']"
        action_description = "Sell"
    else:
        print("Invalid action method:", action_method)
        return "Desyncronised"

    # Select the appropriate button
    try:
        start_time = time()
        button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))
        button.click()
        print(f"Time taken for clicking {action_description} button: {time() - start_time:.2f} seconds")
    except Exception as e:
        print(f"Error clicking {action_description} button:", e)
        return "Desyncronised"

    # Fill stop/limit inputs if applicable
    if stop_limit:
        try:
            driver.find_element(By.XPATH, order_xpaths["stop_limit_dropdown"]).click()
        except Exception as e:
            print("Error clicking stop/limit dropdown:", e)
            pass

        if stop_or_trailing == "stop":
            driver.find_element(By.CSS_SELECTOR, order_xpaths["stop_checkbox"]).click() 
        
        try:
            start_time = time()
            if points_away is not None:
                element = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["points_away_input"])))
                action = ActionChains(driver)
                action.click(on_element=element)
                action.send_keys(points_away)
                action.perform()
                print(f"Time taken for filling points away input: {time() - start_time:.2f} seconds")
                
            if at_price is not None:
                start_time = time()
                element2 = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["at_price_input"])))
                element2.send_keys(Keys.ENTER)
                element2.clear()
                element2.send_keys(at_price)
                print(f"Time taken for filling at price input: {time() - start_time:.2f} seconds")
        except Exception as e:
            print("Error filling stop/limit inputs:", e)
            return "Desyncronised"
            
    # Fill order level input
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["order_level_input"])))
        elem.clear()
        start_time = time()
        elem.send_keys(order_level)
        print(f"Time taken for filling order level input: {time() - start_time:.2f} seconds")
    except Exception as e:
        print("Error filling order level input:", e)
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return "Desyncronised"

    # Click submit button
    try:
        start_time = time()
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        print(f"Time taken for clicking submit button: {time() - start_time:.2f} seconds")
        sleep(0.25)
    except Exception as e:
        print("Error clicking submit button:", e)
        return "Desyncronised"
        
    # Wait for the page to load after submission
    try:
        start_time = time()
        direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        newTradeid = direction_element.text
        print(f"Time taken for waiting and retrieving trade ID: {time() - start_time:.2f} seconds")
        
        start_time = time()
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"]))).click()
        print(f"Time taken for clicking close button: {time() - start_time:.2f} seconds")
        
        print("Success")
        requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Placed","tradeId": newTradeid})
        return "Active"
        
    except Exception as e:
        print("Error waiting for page to load after submission:", e)
        return "Desyncronised"

