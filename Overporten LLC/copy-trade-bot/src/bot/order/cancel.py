from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from time import sleep
from src.bot import xpaths
import requests
import threading

direction_value = None

def multiple_cancle(driver,*args):
    
    process = threading.Thread(target=cancel_order, args=(driver,*args))
    process.start()
    process.join()




def cancel_order(driver,action_type:str,
                sel_market_name:str,
                selling_type:str,
                amount:int,
                status_url:str,
                id:str,order_created,
                open_price:str,
                TradeId: str,
                reformattedData: str,
                account_id: str,
                ) -> str:
    
        global direction_value 
        
        direction_value = TradeId
        """ This function allow to exit or partial exit from the existing order.

        Args:
            sel_market_name(str): name of the marketplace.
            action_type(str): order type(Trade/Order)
            amount(int):  amount of the order.
            selling_type(str):  order exit type(Entire/Partial).
            id(str): order id

        Returns:
            The return value. True and send the status for Closed, Desyncronised and return False otherwise.

        """
        cancel_xpaths = xpaths.cancel_order
        # driver.refresh()
        driver.find_element(By.TAG_NAME,"body").send_keys(Keys.CONTROL + Keys.END)
        sleep(.2)
        
        if reformattedData is not None and account_id is not None and account_id in reformattedData:
            account_data = reformattedData[account_id]
            ids = account_data['ids']
            trade_ids = account_data['tradeIds']

    # Flag variable to indicate successful iteration
            successful_iteration = False
            status = "Active"
            if ids is not None:
                for i in range(len(ids)):
                    print("if")
                    try:
                        print("if")
                        current_id = ids[i]
                        current_trade_id = trade_ids[i]
                        print("ID:", current_id)
                        print("Trade ID:", current_trade_id)
                        try:
                            WebDriverWait(driver, 1).until(
                                    EC.element_to_be_clickable((By.XPATH, '//a[div[contains(text(), "Open Positions")]]'))).click()
                        except: 
                            print("open Posotion is not working ")

                        try:
                            WebDriverWait(driver, 2).until(
                                EC.element_to_be_clickable((By.XPATH, cancel_xpaths["trade_close"].format(current_trade_id)))).click()
                        except:
                                try:
                                    WebDriverWait(driver, 2).until(
                                        EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(sel_market_name)))).click()
                                    print("Expanded in loop")
                                    sleep(.2)
                                    xpath_to_click = cancel_xpaths["trade_close"].format(current_trade_id)
                                    print("XPath to click:", cancel_xpaths["trade_close"].format(current_trade_id))

                                    WebDriverWait(driver, 3).until(
                                        EC.element_to_be_clickable((By.XPATH, xpath_to_click))).click()
                                    print("trade_close in loop")

                                except:
                                    # WebDriverWait(driver, 2).until(
                                    #     EC.element_to_be_clickable((By.XPATH, cancel_xpaths["cancel_button"].format(order_created)))).click()
                                    print("Something went wrong")
                        try:
                            sleep(.2)
                            amount_elem = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,cancel_xpaths["amount_input"])))
                            amount_elem.clear()
                            amount_elem.send_keys(amount)
                        except:
                            requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "orderCreated": order_created,"message":"Trade Desyncronised","TradeId" : current_trade_id,})
                            return False
                
                            # Click on submit button
                        try:
                            submit_button = WebDriverWait(driver, 10).until(
                                EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"])))
                            submit_button.click()
                            sleep(.2)
                            print("Clicked on submit button.")
                            # Post request
                            requests.post(status_url, verify=False, data={"id": current_id, "status": "Active", "message": "Trade Amend", "tradeId": current_trade_id})
                        except:
                            print("Error in clicking submit button.")
                            requests.post(status_url, verify=False, data={"id": current_id, "status": "Active", "message": "Trade Active", "tradeId": current_trade_id})
                            continue
                            
                        # Click on close button
                        try:
                            driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
                            print("Clicked on the close button.")
                            requests.post(status_url, verify=False, data={"id": current_id, "status": "Active", "message": "Trade Active", "tradeId": current_trade_id})
                        except:
                            print("Error in clicking close button or page refresh needed.")
                            driver.refresh()
                            continue
            
                    except:
                        print("Error occurred or page refresh needed.")
                        driver.refresh()
            else:
                success = "Desyncronised"
                print("id not found")
        
        elif selling_type == "Exit":
            print("tradeId", TradeId)
            try:
                WebDriverWait(driver, 1).until(
                        EC.element_to_be_clickable((By.XPATH, '//a[div[contains(text(), "Open Positions")]]'))).click()
            except: 
                print("open Posotion is not working ")
            try:
                close_button_xpath = cancel_xpaths["trade_close"].format(TradeId)
                
                try:
                    # Attempt to click the trade close button directly
                    WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, close_button_xpath))).click()
                except:
                    # If clicking the close button fails, expand the market and retry
                    expand_market_xpath = xpaths.common["expand_market"].format(sel_market_name)
                    WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, expand_market_xpath))).click()
                    WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, close_button_xpath))).click()
                
                # Submit the order
                WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"]))).click()
                print("Success!")
                requests.post(status_url, verify=False, data={
                    "id": id, 
                    "TradeId": TradeId, 
                    "status": "Closed", 
                    "message": "Trade Closed", 
                    "orderCreated": order_created
                })
            except Exception as e:
                print(f"Error during exit process: {e}")
                requests.post(status_url, verify=False, data={
                    "id": id, 
                    "TradeId": TradeId, 
                    "status": "Desyncronised", 
                    "orderCreated": order_created, 
                    "message": "Trade Desyncronised"
                })
                return "Desyncronised"

            try:
                # Close the confirmation dialog
                driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
            except Exception as e:
                print(f"Close button not found: {e}")

            return "Active"

        elif selling_type == "Partial Exit":
            print(cancel_xpaths["trade_close"].format(TradeId))
            try:
                WebDriverWait(driver, 1).until(
                        EC.element_to_be_clickable((By.XPATH, '//a[div[contains(text(), "Open Positions")]]'))).click()
            except: 
                print("open Posotion is not working ")
            try:
                # Attempt to close the trade directly
                close_button_xpath = cancel_xpaths["trade_close"].format(TradeId)
                WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, close_button_xpath))).click()
                
            except:
                try:
                    # If clicking the close button fails, expand the market and retry
                    expand_market_xpath = xpaths.common["expand_market"].format(sel_market_name)
                    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, expand_market_xpath))).click()
                    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, close_button_xpath))).click()
                except:
                    print("Something went wrong while closing the trade")
                    requests.post(status_url, verify=False, data={
                        "id": id,
                        "status": "Desyncronised",
                        "orderCreated": order_created,
                        "message": "Trade Desyncronised",
                        "TradeId": TradeId
                    })

            try:
                # Enter the amount and submit the order
                amount_elem = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, cancel_xpaths["amount_input"])))
                amount_elem.clear()
                amount_elem.send_keys(amount)
                WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"]))).click()
                requests.post(status_url, verify=False, data={
                    "id": id,
                    "status": "Active",
                    "orderCreated": order_created,
                    "message": "Trade Created",
                    "TradeId": TradeId
                })
                return "Active"
                
            except Exception as e:
                print(f"Error during partial exit: {e}")
                requests.post(status_url, verify=False, data={
                    "id": id,
                    "status": "Desyncronised",
                    "orderCreated": order_created,
                    "message": "Trade Desyncronised",
                    "TradeId": TradeId
                })
                return "Desyncronised"

                
             
                
                
                
                