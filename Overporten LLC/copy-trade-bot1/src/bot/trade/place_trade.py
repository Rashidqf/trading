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
    process = threading.Thread(target=order_trade, args=(driver, *args))
    process.start()
    process.join()

def order_trade(driver, market_name:str,myammount:str, action_type:str, action_method:str, amount:int,
                hedging:bool, order_level:int, stop_limit:bool, stop_or_trailing:str,
                points_away:int, at_price:int, guarantee:bool, limit:bool,
                lAt_price:int, lPoints_away:int, status_url:str, id:str) -> dict:
    print("order level",order_level)
    global direction_value
    
    driver.refresh()
    
    order_xpaths = xpaths.place_trade 
    
    # Scroll to the top of the page
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    sleep(0.2)
    
    # Click on the market element
    try:
        action_type_formatted = "Order" 
        market_element_xpath = order_xpaths['market_element'].format(market_name, action_type_formatted.capitalize())
        print(f"Final XPath: {market_element_xpath}")  # This line prints the constructed XPath
        WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, market_element_xpath))).click()
        print("Market element clicked.",market_name)

    except Exception as e:
        print("Error clicking market element:")
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return  "Desyncronised"

    # # Click on the action button
    # try:
    #     WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(action_method)))).click()
    #     print("Action button clicked.",action_method)
    # except Exception as e:
    #     print("Error clicking action button:")
    #     requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
    #     return False
            
    # Fill amount input
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.send_keys(Keys.CONTROL + "a")
        elem.send_keys(Keys.DELETE)

        elem.send_keys(myammount)
        
        driver.execute_script("arguments[0].value = arguments[1];", elem, myammount)
        print("amount submitted")

    except Exception as e:
        element_xpath = order_xpaths["amount_input"]
        print("Error filling amount input:")
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return  "Desyncronised"
    
    # Determine action method
    if action_method == "buy":
        button_xpath = "//div[@class='buy-button']//div[@class='btn-buy']/label/span[text()='Buy']"
        action_description = "Buy"
    elif action_method == "sell":
        button_xpath = "//div[@class='sell-button']//div[@class='btn-sell']/label/span[text()='Sell']"
        action_description = "Sell"
    else:
        print("Invalid action method:", action_method)
        return  "Desyncronised"

    # Select the appropriate button
    try:
        button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))
        button.click()
        print(f"{action_description} button clicked.")
    except Exception as e:
        print(f"Error clicking {action_description} button:")


    # # Fill stop/limit inputs if applicable
    if stop_limit:
        try:
            driver.find_element(By.XPATH, order_xpaths["stop_limit_dropdown"]).click()
            print("Stop/Limit dropdown clicked.")
        except Exception as e:
            print("Error clicking stop/limit dropdown:")
            pass

        if stop_or_trailing == "stop":
            driver.find_element(By.CSS_SELECTOR, order_xpaths["stop_checkbox"]).click() 
            print("Stop checkbox clicked.")
        
        try:
            if points_away is not None:
                element = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["points_away_input"])))
                action = ActionChains(driver)
                action.click(on_element=element)
                action.send_keys(points_away)
                action.perform()
                print("Points away input filled.")
                
            if at_price is not None:
                element2 = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["at_price_input"])))
                element2.send_keys(Keys.ENTER)
                element2.clear()
                element2.send_keys(at_price)
                print("At price input filled.")
        except Exception as e:
            print("Error filling stop/limit inputs:")
            
    # Fill order level input
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["order_level_input"])))
        elem.clear()
        elem.send_keys(order_level)
        print(order_level)
        print("Order Level input filled.")
    except Exception as e:
        print("Order Level failed input:")
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
        return  "Desyncronised"

    # Click submit button
    try:
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        sleep(0.25)
        print("Submit button clicked.")
    except Exception as e:
        print("Error clicking submit button:")
        return  "Desyncronised"

    # Wait for the page to load after submission
    try:
        direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        newTradeid = direction_element.text
        
        requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Placed","tradeId": newTradeid})
        print("Trade id selected")
        return "Active"
    except Exception as e:
        print("Error waiting for page to load after submission:",e)
        return  "Desyncronised"

    # Proceed to click the back button
    try:
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"]))).click()
        # Retrieve trade ID before clicking back button
        # direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        # newTradeid = direction_element.text
        # sleep(0.25)
        # print(newTradeid)
        # # print("Trade ID:", direction_value)
        # requests.post(status_url, verify=False, data={"id": id, "status": "Active", "orderCreated": creation_time, "message": "Order Placed","tradeId": newTradeid})
        driver.refresh()

    except Exception as e:
            sleep(0.2)
            print("Error clicking close button:")
            driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
            requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized"})
            
            return  "Desyncronised"


    # Get creation time
    # print("tradeid :",direction_value)
    # creation_time = get_creation_time(driver, market_name, action_type)
    # requests.post(status_url, verify=False, data={"id": id, "status": "Active", "orderCreated": creation_time, "message": "Order Placed","tradeId": direction_value})

# def get_creation_time(driver, market_name:str, action:str) -> str:
#     driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.END)

#     if action == "trade":
#         try:
#             driver.find_element(By.XPATH, xpaths.common["opened_order"].format(market_name)).click()
#             sleep(0.25)
#             creation_time = driver.find_element(By.XPATH, xpaths.place_trade["order_time"]).text
#             return creation_time
#         except Exception as err:
#             pass
    
#     try:
#         try:
#             driver.find_element(By.XPATH, xpaths.common["creation_time2"].format(market_name))
#         except:
#             sleep(0.2)
#             driver.find_element(By.XPATH, xpaths.common["expand_market"].format(market_name)).click()
#         creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["creation_time"].format(market_name)))).text
#     except:
#         sleep(0.2)
#         try:
#             creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["creation_time2"].format(market_name)))).text
#         except:
#             creation_time = None

#     return creation_time
