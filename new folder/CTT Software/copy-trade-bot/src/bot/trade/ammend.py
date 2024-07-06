from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
from time import sleep
import requests
from src.bot import xpaths

TradeValue = None

def order_ammend(
        driver, market_name: str,
        ammend_point_away: int,
        ammend_at_price: int,
        action_type: str, status_url: str,
        id: str, order_created, formatted_created_at, open_price: str,TradeId : str,orderId: str,orderIdArray:str,account_id:str,reformattedData: str) -> str:
    
    ammend_xpaths = xpaths.ammend
    
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

                    # Click on cancel button
                    print("current_trade_id",current_trade_id)
                    
                    try:
                        print("if is working")
                        
                        WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                        WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["ammend_Butoon"].format(current_trade_id)))).click()
                    except:
                        print("Unable to click on cancel button.")
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        continue
                    
                            # Click on stop limit more
                    try:
                        WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.XPATH, "//label[contains(@class, 'showStopLimitMore') and contains(@class, 'enabledStopLimit')]"))).click()
                        print("enabledStopLimit")
                    except:
                        try:
                            WebDriverWait(driver, 10).until(
                                EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
                            print("check-box")
                        except:
                            print("Unable to click on checkbox for stop.")
                            requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        

                    # Click on checkbox for stop
                    try:
                        WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
                    except:
                        print("Unable to click on checkbox for stop.")
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})

                    # Enter value in input field
                    try:
                        input_field = WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'clickStopPrice')]//input[@type='number']")))
                        if not input_field.is_enabled():
                            try:
                                WebDriverWait(driver, 10).until(
                                    EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
                                input_field.clear()
                                input_field.send_keys(ammend_at_price)
                            except Exception as e:
                                print("Input field is disabled. Data cannot be entered directly.")
                        else:
                            input_field.clear()
                            input_field.send_keys(ammend_at_price)
                    except:
                        print("Error in entering value in input field.")
                        continue
                        # requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})

                    # Click on submit button
                    try:
                        submit_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"])))
                        submit_button.click()
                        sleep(.2)
                        # Post request
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Active", "message": "Order Amend", "tradeId": current_trade_id})
                    except:
                        print("Error in clicking submit button.")
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        continue
                        
                    # Click on close button
                    try:
                        submit_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[@class='btnBack']")))
                        submit_button.click()
                        print("backbutton click ")
                        
                        close_button = WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"])))
                        close_button.click()
                        print("close button clicked")
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Active", "message": "Order Active", "tradeId": current_trade_id})
                    except Exception as e:
                        requests.post(status_url, verify=False, data={"id": current_id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": current_trade_id})
                        print(f"An error occurred: ")
                        continue
                except:
                    driver.refresh()
        else:
            print("id not found")
    else:
            print("else is working")
            try:
                WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                cancel_button = WebDriverWait(driver, 100).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["ammend_Butoon"].format(TradeId))))
                cancel_button.click()
            except:
                requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId})

            # Click on stop limit more
            try:
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//label[contains(@class, 'showStopLimitMore') and contains(@class, 'enabledStopLimit')]"))).click()
                print("enabledStopLimit")
            except:
                try:
                    WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
                    print("check-box")
                except:
                    print("Unable to click on checkbox for stop.")
                    requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId})
                  

            # Click on checkbox for stop
            try:
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
            except:
                print("Unable to click on checkbox for stop.")
                requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId})

            # Enter value in input field
            try:
                input_field = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'clickStopPrice')]//input[@type='number']")))
                if not input_field.is_enabled():
                    try:
                        WebDriverWait(driver, 10).until(
                            EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
                        input_field.clear()
                        input_field.send_keys(ammend_at_price)
                    except Exception as e:
                        print("Input field is disabled. Data cannot be entered directly.")
                else:
                    input_field.clear()
                    input_field.send_keys(ammend_at_price)
            except:
                print("Error in entering value in input field.")
                requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId})

            # Click on submit button
            try:
                submit_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"])))
                submit_button.click()
                sleep(.2)
                # Post request
                requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Amend", "tradeId": TradeId})
            except:
                print("Error in clicking submit button.")
                requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId})
            try:
                submit_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[@class='btnBack']")))
                submit_button.click()
                print("backbutton click ")
                
                close_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"])))
                close_button.click()
                print("close button clicked")
                requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Desyncronised", "tradeId": TradeId})
                return "Active"
            except: 
                print("back button not working ")   
                requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desyncronised", "tradeId": TradeId}) 
                
            # try:
            #     submit_button = WebDriverWait(driver, 10).until(
            #         EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"])))
            #     submit_button.click()
            #     print("close button clicked")
            # except: 
            #     print("back button not working ")  
            # # Click on close button
            # try:
            #     back_button = driver.find_element(By.XPATH, "//button[@class='btnBack']")
            #     back_button.click()
            #     sleep(.2)
            #     print("back button clicked")
            #     sleep(.2)
            #     close_button = driver.find_element(By.XPATH, xpaths.common["close_button"])
            #     close_button.click()
            #     print("close button clicked")
            #     requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Active", "tradeId": TradeId})
            #     return "Active"
            # except Exception as e:
            #     print(f"Error in clicking close button or page refresh needed: {e}")
            #     driver.refresh()
            #     return "Desyncronised"
                
    # for key, value in reformattedData.items():
    #     if key == account_id:
    #         try:
    #             print("try")
    #             WebDriverWait(driver, 2).until(
    #             EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
                
    #         except:
    #             requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})
    #             print("except")
    #             break
    #     else:
    #         print("error ")
        



    # # Scroll to the end of the page
    # driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.END)

    # try:
    #     WebDriverWait(driver, 2).until(
    #     EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))).click()
    # except:
    #     requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})
    # try:
    #         # Wait for the element to be clickable
    #     cancel_button = WebDriverWait(driver, 100).until(
    #             EC.element_to_be_clickable((By.XPATH, xpaths.cancel_order["ammend_Butoon"].format(TradeId)))
    #         )
    #     cancel_button.click()
    # except:
    #     requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})
        
        
            
    # try:
    #     WebDriverWait(driver, 10).until(
    #         EC.element_to_be_clickable((By.XPATH, '//label[@class="showStopLimitMore enabledStopLimit"]'))).click()
    # except:
    #     requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})
        
    # try:
    #     WebDriverWait(driver, 10).until(
    #         EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
    # except:
    #     requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})

    # try:
    #     input_field = WebDriverWait(driver, 10).until(
    #         EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'clickStopPrice')]//input[@type='number']"))
    #     )
    #     if not input_field.is_enabled():
    #         try:
    #             WebDriverWait(driver, 10).until(
    #                 EC.element_to_be_clickable((By.XPATH, "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span"))).click()
    #             input_field.clear()
    #             input_field.send_keys(ammend_at_price)
    #         except Exception as e:
    #             print("Input field is disabled. Data cannot be entered directly.")
    #     else:
    #         input_field.clear()
    #         input_field.send_keys(ammend_at_price)
    #         print("Amount entered on the input")
    # except:
    #     print("error")
    #     # requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})
    # try:
    #     # Click on the submit button
    #     submit_button = WebDriverWait(driver, 10).until(
    #     EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"]))
    #     )
    #     submit_button.click()
    #     sleep(.2)
    #     # if action_type == "trade":
    #     #     back_button = WebDriverWait(driver, 10).until(
    #     #     EC.element_to_be_clickable((By.XPATH, "xpaths.common["back_button"]"))
    #     #     )
    #     # else:
    #     #     print_button = WebDriverWait(driver, 10).until(
    #     #     EC.element_to_be_clickable((By.XPATH, xpaths.common["print_button"])))

    #     # # Post request
    #     requests.post(status_url, verify=False, data={"id": id, "status": "Active", "orderCreated": order_created,"openPrice": open_price, "message": "Order Amend","tradeId": TradeId})
        
    # except:
    #     print("...")
    #     requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId": TradeId})


    # try:
    #     driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
    #     print("Clicked on the close button.")
    # except:
    #     print("page refresh")
    #     driver.refresh()
    #     pass
    # return True



