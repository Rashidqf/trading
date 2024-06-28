from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import requests
from src.bot import xpaths  # Assuming you have xpaths defined in a separate module
import threading

direction_value = None


def switch_multiple_window(driver, *args):
    process = threading.Thread(target=order_trade, args=(driver, *args))
    process.start()
    process.join()

def order_trade(driver, market_name:str,myammount:str, action_type:str, action_method:str, amount:int,
                hedging:bool, order_level:int, stop_limit:bool, stop_or_trailing:str,
                points_away:int, at_price:int, guarantee:bool, limit:bool,
                lAt_price:int, lPoints_away:int, status_url:str, id:str) -> bool:
    global direction_value  # Declare trade_id_value as global
    print("myammount", myammount)
    print("Order is working")
    print("Market Name:", market_name)
    print("Action Type:", action_type)
    print("Action Method:", action_method)
    print("Amount:", amount)
    print("Hedging:", hedging)
    print("Order Level:", order_level)
    print("Stop Limit:", stop_limit)
    print("Stop or Trailing:", stop_or_trailing)
    print("Points Away:", points_away)
    print("At Price:", at_price)
    print("Guarantee:", guarantee)
    print("Limit:", limit)
    print("Limit At Price:", lAt_price)
    print("Limit Points Away:", lPoints_away)
    print("Status URL:", status_url)
    print("ID:", id)
    
    order_xpaths = xpaths.place_trade  # Assuming xpaths is defined in a separate module
    
    # Scroll to the top of the page
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    sleep(0.2)
    
    # Click on the market element
    try:
        if action_type == "trade":
            action_type_formatted = "Order" 
            market_element_xpath = order_xpaths['market_element'].format(market_name, action_type_formatted)
            print(f"Final XPath: {market_element_xpath}")  # This line prints the constructed XPath
            WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, market_element_xpath))).click()
            print("Market element clicked.",market_name)

    except Exception as e:
        print("Error clicking market element:")
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized","tradeId": direction_value})
        return False

    # # Click on the action button
    # try:
    #     WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["actionButtonNew"].format(action_method)))).click()
    #     print("Action button clicked.",action_method)
    # except Exception as e:
    #     print("Error clicking action button:")
    #     requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized","tradeId": direction_value})
    #     return False
            
    # Fill amount input
    try:
        elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
        elem.clear()
        elem.send_keys(myammount)
        print("Amount input filled.",myammount)
        element_xpath = order_xpaths["amount_input"]
        print("XPath of the element:", element_xpath)
    except Exception as e:
        element_xpath = order_xpaths["amount_input"]
        print("XPath of the element:", element_xpath)
        print("Error:", e)
        print("Error filling amount input:")
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized","tradeId": direction_value})
        return False
    
    # Determine action method
    if action_method == "buy":
        button_xpath = "//div[@class='buy-button']//div[@class='btn-buy']/label/span[text()='Buy']"
        action_description = "Buy"
    elif action_method == "sell":
        button_xpath = "//div[@class='sell-button']//div[@class='btn-sell']/label/span[text()='Sell']"
        action_description = "Sell"
    else:
        print("Invalid action method:", action_method)
        return False

    # Select the appropriate button
    try:
        button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))
        button.click()
        print(f"{action_description} button clicked.")
    except Exception as e:
        print(f"Error clicking {action_description} button:")


    # Fill stop/limit inputs if applicable
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
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized","tradeId": direction_value})
        return False

    # Click submit button
    # Click submit button
    try:
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        sleep(0.25)
        print("Submit button clicked.")
    except Exception as e:
        print("Error clicking submit button:")

    # Wait for the page to load after submission
    try:
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        print("Page loaded after submission.")
    except Exception as e:
        print("Error waiting for page to load after submission:")
        return False

    # Proceed to click the back button
    try:
        direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
        direction_value = direction_element.text
        sleep(0.25)
        print("Trade ID:", direction_value)
        
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["back_button"])))
        # Retrieve trade ID before clicking back button
        

    except Exception as e:
            sleep(0.2)
            print("Error clicking close button:")
            driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
            requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized","tradeId": direction_value})
            return False


    # Get creation time
    print("tradeid :",direction_value)
    creation_time = get_creation_time(driver, market_name, action_type)
    requests.post(status_url, verify=False, data={"id": id, "status": "Active", "orderCreated": creation_time, "message": "Order Placed","tradeId": direction_value})

def get_creation_time(driver, market_name:str, action:str) -> str:
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.END)

    if action == "trade":
        try:
            driver.find_element(By.XPATH, xpaths.common["opened_order"].format(market_name)).click()
            sleep(0.25)
            creation_time = driver.find_element(By.XPATH, xpaths.place_trade["order_time"]).text
            return creation_time
        except Exception as err:
            pass
    
    try:
        try:
            driver.find_element(By.XPATH, xpaths.common["creation_time2"].format(market_name))
        except:
            sleep(0.2)
            driver.find_element(By.XPATH, xpaths.common["expand_market"].format(market_name)).click()
        creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["creation_time"].format(market_name)))).text
    except:
        sleep(0.2)
        try:
            creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["creation_time2"].format(market_name)))).text
        except:
            creation_time = None

    return creation_time
