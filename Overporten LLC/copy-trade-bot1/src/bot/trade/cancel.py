
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
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
                )-> dict:
    
        global direction_value 
    
        print("TradeId" , TradeId)
        print("Action Type:", action_type)
        print("Selected Market Name:", sel_market_name)
        print("Selling Type:", selling_type)
        print("Amount:", amount)
        print("Status URL:", status_url)
        print("ID:", id)
        print("Order Created:", order_created)
        print("Open Price:", open_price)
        print("side", side)
        print("idsArray",idsArray)
        print("reformattedData",reformattedData)
        print("account_id",account_id)
        
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
            print("if")
    
    # Flag variable to indicate successful iteration
        successful_iteration = False
        if ids is not None:
            for i in range(len(ids)):
                print("if")
                try:
                    print("if")
                    current_id = ids[i]
                    current_trade_id = trade_ids[i]
                    print("ID:", current_id)
                    print("Trade ID:", current_trade_id)

                    # Click on cancel button
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                        cancel_button = WebDriverWait(driver, 100).until(
                        EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["remove_Button"].format(current_trade_id))))
                                # Click on the button
                        cancel_button.click()
                        print(current_trade_id)
                        print("its working")
                    except:
                        print("Unable to click on cancel button.")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Desynchronized", "message": "Order Desynchronized", "tradeId": current_trade_id})
                        continue
            
                    # Click on submit button
                    try:
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,cancel_xpaths["confirm"]))).click()
                        print("Clicked on submit button.")
                        # Post request
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Closed", "message": "Closed closed", "tradeId": current_trade_id})
                    except:
                        print("Error in clicking submit button.")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Desynchronized", "message": "Order Desynchronized", "tradeId": current_trade_id})
                        continue
                        
                    # Click on close button
                    try:
                        driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
                        print("Clicked on the close button.")
                        requests.post(trade_url, verify=False, data={"id": current_id, "status": "Desynchronized", "message": "Order Desynchronized", "tradeId": current_trade_id})
                    except:
                        print("Error in clicking close button or page refresh needed.")
                        driver.refresh()
                        continue
                except:
                    print("Error occurred or page refresh needed.")
                    driver.refresh()        
        
        
        elif selling_type == "MultipleExit":
            try:
                xpath = order_xpaths['market_element'].format(sel_market_name, action_type.capitalize())
                print("XPath:", xpath)
                WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, xpath))).click()
                print("market_element")
            except:
                print("Error:")
                requests.post(status_url, verify=False, data={"id": id, "tradeId": TradeId, "status": "Desyncronised", "message": "Order Desynchronised - Unknown error"})
                return False
            #token amount
            try:
                elem = WebDriverWait(driver,5).until(
                            EC.element_to_be_clickable((By.XPATH,order_xpaths["amount_input"])))
                elem.clear()
                elem.send_keys(amount)
                WebDriverWait(driver, 3).until(
                        EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(new_side)))).click()
                print("action_button")

            except Exception as e:
                print("Element not found")

                requests.post(status_url,verify=False,data={"id":id,"tradeId" : TradeId,"status":"Desyncronised","message":"Ordrer Desyncronised"})
                return False
            try:
                driver.find_element(By.XPATH,xpaths.common["submit_button"]).click()
                sleep(.25)
                print("submit_button")
                requests.post(status_url,verify=False,data={"id":id,"tradeId" : TradeId,"status":"Closed","message":"Ordrer Closed","idsArray":idsArray})
            except Exception as e:
                pass
        else:
            
            driver.refresh()
            driver.find_element(By.TAG_NAME,"body").send_keys(Keys.CONTROL + Keys.END)
            sleep(.2)
        
        
            try:
                WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                # print("Clicked on the opened order.")
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
                        # print("Clicked on the cancel button.")
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
                        # print("Clicked on the close button")
                        print("success")
                        sleep(.5)
                        return "Closed"
                    except: 
                        print("error on close button")
                        return "Desyncronised"

            except Exception as e:
                    print("An error occurred:", e)
                    return "Desyncronised"

        
