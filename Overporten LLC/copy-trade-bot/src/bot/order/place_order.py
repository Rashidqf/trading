from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
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
    tradeid = None
    open_price = None
    ammend_xpaths = xpaths.ammend
    
    order_xpaths = xpaths.place_order

    driver.refresh()
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    
    # Placing order
    try:
        xpath = order_xpaths['market_element'].format(market_name, action_type.capitalize())
        WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, xpath))).click()
    except:
        print("Element not found")
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Order Desynchronised - Element not found"})
        return "Desyncronised"

    # Entering amount and clicking action button
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.clear()
        elem.send_keys(amount)
        WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(action_method)))).click()
    except Exception as e:
        print("Element not found")
        requests.post(status_url, verify=False, data={"id": id, "tradeId": direction_value, "status": "Desyncronised", "message": "Order Desynchronised"})
        return "Desyncronised"

    # Submitting order
    try:
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
    except Exception as e:
        return "Desyncronised"
    print(direction_value)

    # Checking for successful order placement
    try:
        direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        tradeid = direction_element.text
        open_price_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnOpenPrice']")))
        open_price = open_price_element.text
        print( "openPrice", open_price)
        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        requests.post(status_url, verify=False, data={"id": id, "tradeId": tradeid, "status": "Active", "message": "Order Active", "openPrice": open_price})
        
    except Exception as e:
        requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desynchronised"})
        print("Error waiting for page to load after submission:")
        return "Desyncronised"
    try:
        WebDriverWait(driver, 1).until(
                EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(tradeid)))).click()
        print("trade_ammed")
        print(ammend_xpaths["edit_button"].format(tradeid))
        sleep(.2)
    except Exception as e:
        try:
            WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(market_name)))).click()
            print("Expanded")
            print(tradeid)
            sleep(.2)

            WebDriverWait(driver, 1).until(
                EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(tradeid)))).click()
            print("edit_button")
            sleep(.2)
        except:
            print("Something went wrong")
            requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId" : tradeid})
            
        try:
            try:
                WebDriverWait(driver, 4).until(
                        EC.element_to_be_clickable((By.XPATH,ammend_xpaths["stop_price_input_selected"])))
                print("stop_price_input_selected")
                already_selected = True
            except: 
                driver.find_element(By.CSS_SELECTOR, ammend_xpaths["stop_checkbox"]).click()
                already_selected = False
                print("stop_checkbox")

            print(amount)
            # if amount:
            #     if already_selected:
            #         input_path = ammend_xpaths["points_away_input_selected"]
            #     else:
            #         input_path = ammend_xpaths["stop_point_input_selected"]
            #     input_elem = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH,input_path)))
            #     input_elem.click()
            #     sleep(.1)
            #     if not already_selected:
            #         input_elem.send_keys(amount)
            #     else:
            #         send_amount_elem = WebDriverWait(driver, 3).until(
            #             EC.element_to_be_clickable((By.XPATH, ammend_xpaths["points_away_input"])))
            #         send_amount_elem.clear()
            #         send_amount_elem.send_keys(amount)
            
            # elif amount:
                
            print("at price")
            if not already_selected:
                at_price_path = ammend_xpaths["stop_price_input_not_selected"]
            else:
                at_price_path = ammend_xpaths["ammend_at_price_input"]

            ammend_elem = driver.find_element(By.XPATH,at_price_path)
            ammend_elem.send_keys(Keys.ENTER)
            ammend_elem.clear()
            ammend_elem.send_keys(amount)
            print("at price")
        
        except Exception as e:
            requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised","message":"Ordrer Desyncronised","tradeId" : tradeid, "openPrice": open_price})
            print("orderCreated")
        try:
            driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
            sleep(.2)
            print("success")
            requests.post(status_url,verify=False,data={"id":id,"status":"Active","message":"Ordrer Ammend","tradeId" : tradeid,"openPrice": open_price})
            return "Active"
        except Exception as e:
                    print("Something went wrong !!")
