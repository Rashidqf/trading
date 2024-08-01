
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
from src.bot import xpaths
import requests
import threading

def multiple_cancle(driver,*args):
    
    process = threading.Thread(target=order_cancel, args=(driver,*args))
    process.start()
    process.join()




def order_cancel(driver,action_type:str,
                sel_market_name:str,
                selling_type:str,
                amount:int,
                status_url:str,
                id:str,order_created,
                open_price:str,
                TradeId : str,
                side: str,
                idsArray: str,
                reformattedData: str,
                account_id: str,
                trade_url:str
                )-> str:
    
        global direction_value 
        print("selling_type",selling_type)

        
        cancel_xpaths = xpaths.cancel_order
        
        def toggle_side(side):
            if side == "buy":
                return "sell"
            elif side == "sell":
                return "buy"
            else:
                return "Invalid input"

        # Example usage:
        new_side = toggle_side(side)
    
        global TradeIdValue
        TradeIdValue = TradeId
        order_xpaths = xpaths.place_order
        
        matching_data = None
        ids = None
        
        if reformattedData is not None and account_id in reformattedData:
            account_data = reformattedData[account_id]
            ids = account_data['ids']
            trade_ids = account_data['tradeIds']
    
    # Flag variable to indicate successful iteration
        successful_iteration = False
        if ids is not None:
            for i in range(len(ids)):
                try:
                    current_id = ids[i]
                    current_trade_id = trade_ids[i]
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                    except:
                        print("Unable to click on cancel button.")
                    # Click on cancel button
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                        cancel_button = WebDriverWait(driver, 100).until(
                        EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["remove_Button"].format(current_trade_id))))
                                # Click on the button
                        cancel_button.click()
                        print("remove_Button")
                    except:
                        print("Unable to click on cancel button.")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        continue
            
                    # Click on submit button
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,cancel_xpaths["confirm"]))).click()

                        # Post request
                        print("confirm")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Closed", "message": "Closed closed", "tradeId": current_trade_id})
                    except:
                        print("Error in clicking submit button.")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        continue
                        
                    # Click on close button
                    try:
                        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Closed", "message": "Order Closed", "tradeId": current_trade_id})
                        print("last close button")
                    except:
                        print(xpaths.common["closeButtonUpdated"])
                        print("Error in clicking close button or page refresh needed.")
                        continue
                except:
                    print("Error occurred or page refresh needed.")
                    driver.refresh()        
        
        elif selling_type == "MultipleExit":
            current_url = driver.current_url
            print("Selling TYpe", selling_type)
            try:
                driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
                sleep(0.2)
                xpath = order_xpaths['market_element'].format(sel_market_name, action_type.capitalize())
                
                element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, xpath)))
                WebDriverWait(driver, 4).until(EC.visibility_of(element))
                element.click()
                
            except:
                WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, xpath))).click()
                requests.post(status_url, verify=False, data={"id": id, "tradeId": TradeId, "status": "Desyncronised", "message": "Order Desynchronised - Unknown error"})
                return False
            #token amount
            try:
                elem = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"])))
                elem.clear()
                elem.send_keys(amount)
                WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(new_side)))).click()
            except Exception as e:
                print("Element not found")
                requests.post(status_url, verify=False, data={"id": id, "tradeId": TradeId, "status": "Desyncronised", "message": "Order Desynchronised"})
                return False
            try:
                driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
                print("success")
                sleep(.25)
                driver.find_element(By.XPATH,xpaths.common["close_button"]).click()
                print("Clicked on the close button")
                requests.post(status_url, verify=False, data={"id": id, "tradeId": TradeId, "status": "Closed", "message": "Order Closed", "idsArray": idsArray})
            except Exception as e:
                pass
        
        else:
                    
            driver.refresh()
            driver.find_element(By.TAG_NAME,"body").send_keys(Keys.CONTROL + Keys.END)
            sleep(.2)
        
        
            try:
                WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
            except: 
                print("error on close button")
                requests.post(trade_url,verify=False,data={"id":id,"status":"Desyncronised", "orderCreated": order_created,"message":"Ordrer Desyncronised","tradeId": TradeId})
                return "Desyncronised"
            
            try:    
                    try:
                        cancel_button = WebDriverWait(driver, 100).until(
                        EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["remove_Button"].format(TradeId))))
                                # Click on the button
                        cancel_button.click()
                        print("Clicked on the cancel button.")
                    except:
                        print("error on close button")
                        requests.post(trade_url,verify=False,data={"id":id,"status":"Desyncronised", "orderCreated": order_created,"message":"Ordrer Desyncronised","tradeId": TradeId})
                        return "Desyncronised"
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,cancel_xpaths["confirm"]))).click()
                        requests.post(trade_url, verify=False, data={"id": id, "status": "Closed", "message": "Order Closed", "tradeId": TradeId})
                    except: 
                        print("error on close button")
                        requests.post(trade_url,verify=False,data={"id":id,"status":"Desyncronised", "orderCreated": order_created,"message":"Ordrer Desyncronised","tradeId": TradeId})
                        return "Desyncronised"
                    try:
                        driver.find_element(By.XPATH,xpaths.common["close_button"]).click()
                        print("Clicked on the close button")
                        print("success")
                        sleep(.5)
                        return "Active"
                    except: 
                        print("error on close button")
                        return "Desyncronised"

            except Exception as e:
                    print("An error occurred:", e)
                    return "Desyncronised"

        
