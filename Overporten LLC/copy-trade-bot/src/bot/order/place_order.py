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
    process = threading.Thread(target=trade_order, args=(driver, *args))
    process.start()
    process.join()

def trade_order(driver, market_name, action_type, action_method, amount, hedging, order_level, 
                stop_limit, stop_or_trailing, points_away, at_price, guarantee, limit, 
                lAt_price, lPoints_away, status_url, id,stopLoss,riskSl):
    
    global direction_value
    tradeid = None
    open_price = None
    ammend_xpaths = xpaths.ammend
    
    order_xpaths = xpaths.place_order

    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    
    # Placing order
    try:
        start_time = time()
        xpath = order_xpaths['market_element'].format(market_name, action_type.capitalize())
        WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, xpath))).click()
        end_time = time()
        print(f"Enteringclicking action button took {end_time - start_time:.2f} seconds")
    except:
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Trade Desynchronised"})
        return "Desyncronised"

    # Entering amount and clicking action button
    try:
        start_time = time()
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.clear()
        # driver.execute_script("arguments[0].value = '';", elem)
        elem.send_keys(amount)
        WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(action_method)))).click()
        end_time = time()
        print(f"Entering amount and clicking action button took {end_time - start_time:.2f} seconds")
    except Exception as e:
        print("Element not found")
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Trade Desynchronised"})
        return "Desyncronised"

    # Submitting order
    try:
        start_time = time()
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        end_time = time()
        print(f"Submitting order took {end_time - start_time:.2f} seconds")
    except Exception as e:
        return "Desyncronised"

    # Checking for successful order placement
    try:
        print("its working")
        direction_element = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        tradeid = direction_element.text
        print("tradeid",tradeid)
        print("working")
        open_price_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnOpenPrice']")))
        open_price = open_price_element.text
        print("working")
        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        requests.post(status_url, verify=False, data={"id": id, "tradeId": tradeid, "status": "Active", "message": "Trade Active", "openPrice": open_price})
        
    except Exception as e:
        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Trade Desynchronised"})
        print("Error waiting for page to load after submission:")
        return "Desyncronised"
    try:
        WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(tradeid)))).click()
        print("Step 1: Clicked edit_button")
        print(ammend_xpaths["edit_button"].format(tradeid))
        sleep(.2)
        try:
            try:
                WebDriverWait(driver, 4).until(
                    EC.element_to_be_clickable((By.XPATH, ammend_xpaths["stop_price_input_selected"])))
                print("Step 4: stop_price_input_selected")
                already_selected = True
            except Exception as e:
                print(f"Error at Step 4: {e}")
                driver.find_element(By.CSS_SELECTOR, ammend_xpaths["stop_checkbox"]).click()
                already_selected = False
                print("Step 5: Clicked stop_checkbox")

            print(riskSl)
            print("at price")
            if not already_selected:
                at_price_path = ammend_xpaths["stop_price_input_not_selected"]
            else:
                at_price_path = ammend_xpaths["ammend_at_price_input"]

            ammend_elem = driver.find_element(By.XPATH, at_price_path)
            ammend_elem.send_keys(Keys.ENTER)
            print("Step 6: Pressed ENTER in ammend_elem")
            ammend_elem.clear()
            print("Step 7: Cleared ammend_elem")
            ammend_elem.send_keys(riskSl)
            print("Step 8: Entered riskSl in ammend_elem")

        except Exception as e:
            print(f"Error at Steps 4-8: {e}")
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Trade Desyncronised", "tradeId": tradeid, "openPrice": open_price})
            print("orderCreated")
            
        try:
            driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
            sleep(.2)
            print("Step 9: Clicked submit_button")
            requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Trade Ammend", "tradeId": tradeid, "openPrice": open_price})
            return "Active"
        except Exception as e:
            print(f"Error at Step 9: {e}")
            print("Something went wrong !!")

    except Exception as e:
        print(f"Error at Step 1: {e}")
        try:
            WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(market_name)))).click()
            print("Step 2: Expanded market")
            print(tradeid)
            sleep(.2)

            WebDriverWait(driver, 1).until(
                EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(tradeid)))).click()
            print("Step 3: Clicked edit_button after expanding market")
            sleep(.2)
        except Exception as e:
            print(f"Error at Step 2-3: {e}")
            print("Something went wrong")
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Trade Desyncronised", "tradeId": tradeid})

        try:
            try:
                WebDriverWait(driver, 4).until(
                    EC.element_to_be_clickable((By.XPATH, ammend_xpaths["stop_price_input_selected"])))
                print("Step 4: stop_price_input_selected")
                already_selected = True
            except Exception as e:
                print(f"Error at Step 4: {e}")
                driver.find_element(By.CSS_SELECTOR, ammend_xpaths["stop_checkbox"]).click()
                already_selected = False
                print("Step 5: Clicked stop_checkbox")

            print(riskSl)
            print("at price")
            if not already_selected:
                at_price_path = ammend_xpaths["stop_price_input_not_selected"]
            else:
                at_price_path = ammend_xpaths["ammend_at_price_input"]

            ammend_elem = driver.find_element(By.XPATH, at_price_path)
            ammend_elem.send_keys(Keys.ENTER)
            print("Step 6: Pressed ENTER in ammend_elem")
            ammend_elem.clear()
            print("Step 7: Cleared ammend_elem")
            ammend_elem.send_keys(riskSl)
            print("Step 8: Entered riskSl in ammend_elem")

        except Exception as e:
            print(f"Error at Steps 4-8: {e}")
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Trade Desyncronised", "tradeId": tradeid, "openPrice": open_price})
            print("orderCreated")
            
        try:
            driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
            sleep(.2)
            print("Step 9: Clicked submit_button")
            requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Trade Ammend", "tradeId": tradeid, "openPrice": open_price})
            return "Active"
        except Exception as e:
            print(f"Error at Step 9: {e}")
            print("Something went wrong !!")
