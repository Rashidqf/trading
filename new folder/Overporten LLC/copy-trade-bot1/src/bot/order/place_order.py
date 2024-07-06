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

def switch_multiple_window(driver,*args):
    
    process = threading.Thread(target=trade_order,args=(driver,*args))
    process.start()
    process.join()

    
    

def trade_order(
            driver,
            market_name:str,action_type:str,
            action_method:str,amount:int,
            hedging:bool,order_level:int,
            stop_limit:bool,stop_or_trailing:str,
            points_away:int, at_price:int,
            guarantee:bool,limit:bool,
            lAt_price:int,lPoints_away:int,
            status_url:str,id:str
            ) -> dict:
       
        global direction_value 
        ammend_xpaths = xpaths.ammend
        
        """ This function create the order on trade365.

        Args:
            market_name(str): name of the marketplace.
            action_type(str): order type(Trade/Order)
            action_method(str): order method(Buy/Sell)
            amount(int):  amount of the order.
            hedging(bool):  if hedging for the order
            order_level(str):  order level for Order
            stop_limit(str): stop limit for the order
            stop_or_trailing (str):  stop or trailing for the order.
            points_away(str): stop points away for the order
            at_price(str):  stop at price for the order
            guarantee(bool):  if guarantee for the order
            limit(bool):  if limit for the order
            lPoints_away(str): limit points away for the order
            lAt_price (str): limit at price for the order
            id(str): order id

        Returns:
            The return value. True and send the status for Active, False otherwise.

        """

        order_xpaths = xpaths.place_order
        driver.refresh()
        driver.find_element(By.TAG_NAME,"body").send_keys(Keys.CONTROL + Keys.HOME)
        sleep(.2)
        try:
            xpath = order_xpaths['market_element'].format(market_name, action_type.capitalize())
            print("XPath:", xpath)
            WebDriverWait(driver, 4).until(EC.element_to_be_clickable((By.XPATH, xpath))).click()
            print("market_element")
        except NoSuchElementException as e:
            print("Element not found:", e)
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desynchronised - Element not found"})
            return "Desyncronised"
        except TimeoutException as e:
            print("Timeout waiting for element to be clickable:", e)
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desynchronised - Timeout waiting for element"})
            return "Desyncronised"
        except Exception as e:
            print("Error:", e)
            requests.post(status_url, verify=False, data={"id": id, "status": "Desyncronised", "message": "Order Desynchronised - Unknown error"})
            return "Desyncronised"


        #token amount
        try:
            # print(action_method)
            # print(amount)
            # print(order_xpaths["action_button"].format(action_method))
            elem = WebDriverWait(driver,5).until(
                         EC.element_to_be_clickable((By.XPATH,order_xpaths["amount_input"])))
            elem.clear()
            elem.send_keys(amount)
            WebDriverWait(driver, 3).until(
                    EC.element_to_be_clickable((By.XPATH, order_xpaths["action_button"].format(action_method)))).click()

        except Exception as e:
            print("Element not found")

            requests.post(status_url,verify=False,data={"id":id,"tradeId" : direction_value,"status":"Desyncronised","message":"Ordrer Desyncronised"})
            return "Desyncronised"



        if stop_limit:
            try:
                driver.find_element(By.XPATH,order_xpaths["stop_limit_dropdown"]).click()
            except:
                #print("Unable to click stoplimit dropdown!")
                pass

            if stop_or_trailing == "stop":
                driver.find_element(By.CSS_SELECTOR,order_xpaths["stop_checkbox"]).click() 
            try:
                if points_away is not None:
                    print("points away value recieve")
                    element = WebDriverWait(driver, 2).until(
                            EC.element_to_be_clickable((By.XPATH,order_xpaths["points_away_input"])))
                    action = ActionChains(driver)
                    action.click(on_element = element)
                    action.send_keys(points_away)
                    action.perform()
                    
                if at_price is not None:
                    print("at price value recieve")
                    element2 = WebDriverWait(driver, 2).until(
                                        EC.element_to_be_clickable((By.XPATH,order_xpaths["at_price_input"])))
                    element2.send_keys(Keys.ENTER)
                    element2.clear()
                    element2.send_keys(at_price)
            except Exception as e:
                pass
                #print(e)
                #print("Error! element not found .")

        #submission for token
        try:
            # print("Submit here")
            driver.find_element(By.XPATH,xpaths.common["submit_button"]).click()
            sleep(.25)
            print("submit_button")
        except Exception as e:
            pass
            #print("Error!")
        try:
            direction_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//span[@class='spnReferenceNo']")))
            tradeid = direction_element.text
            direction_value= tradeid
            sleep(0.25)
            print("Trade ID:", tradeid)
            print("close2")
            driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
            requests.post(status_url,verify=False,data = {"id":id,"tradeId" : tradeid, "status":"Active","message":"Ordrer Active"}) 
            driver.refresh()
            # return "Active"
        except Exception as e:
            requests.post(status_url,verify=False,data = {"id":id, "status":"Desyncronised","message":"Ordrer Desyncronised"})
            print("Error waiting for page to load after submission:")
            # return "Desyncronised"
        try:
            WebDriverWait(driver, 1).until(
                    EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(direction_value)))).click()
            print("trade_ammed")
            print(ammend_xpaths["edit_button"].format(direction_value))
            sleep(.2)
        except Exception as e:
            try:
                WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(market_name)))).click()
                print("Expanded")
                print(direction_value)
                sleep(.2)

                WebDriverWait(driver, 1).until(
                    EC.element_to_be_clickable((By.XPATH, ammend_xpaths["edit_button"].format(direction_value)))).click()
                print("edit_button")
                sleep(.2)
            except:
                print("Something went wrong")
                requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Desyncronised","tradeId" : direction_value})
                
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
                requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised","message":"Ordrer Desyncronised","tradeId" : direction_value})
                print("orderCreated")
            try:
                driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
                sleep(.2)
                
                print("success")
                requests.post(status_url,verify=False,data={"id":id,"status":"Active","message":"Ordrer Ammend","tradeId" : direction_value})
                return "Active"
            except Exception as e:
                        print("Something went wrong !!")
                        # try:
                        #     sleep(.2)
                        #     driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
                        #     sleep(.15)
                        # except: 
                        #     pass
                        #     #print("Close btn not found")
                        requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised","message":"Ordrer Desyncronised","tradeId" : direction_value})
                        return "Desyncronised"
                                # return False
           
        # try:
        #     if action_type =="order":
        #         WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["back_button"])))
        #     else:
        #         # print("here")
        #         sleep(.5)
        #         WebDriverWait(driver, 6).until(EC.element_to_be_clickable((By.XPATH, xpaths.common["print_button"])))
        #         print("close")
        #     driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        
        # except Exception as e:
        #     sleep(.2)
        #     print("close2")
        #     driver.find_element(By.XPATH, xpaths.common["close_button"]).click()
        #     requests.post(status_url,verify=False,data = {"id":id,"tradeId" : direction_value, "status":"Desyncronised","message":"Ordrer Desyncronised"})
        #     return False
        
        creation_time = get_creation_time(driver,market_name,action_type)

        # print(creation_time)
        # print({"market_name":market_name,"id":id,tradeId : tradeId,"creation time": creation_time})
        
        # try:
        #     try:
        #         sleep(.25)
        #         open_price = WebDriverWait(driver, 2.5).until(EC.element_to_be_clickable((By.XPATH,order_xpaths["opening_price2"].format(market_name)))).text
        #     except:
        #         open_price = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,order_xpaths["opening_price1"].format(market_name)))).text
        #     print(open_price)
        #     print("Completed.")
        # except Exception as e:
        #     print("Something went wrong with OpenPrice")
        #     open_price = None
        # # print(tradeId)
        # requests.post(status_url,verify=False,data={"id":id,"tradeId" : direction_value,"status":"Active","orderCreated":creation_time,"openPrice":open_price,"message":"Order Placed"})




def get_creation_time(driver,market_name:str,action:str) -> str:

    driver.find_element(By.TAG_NAME,"body").send_keys(
        Keys.CONTROL + Keys.END)


    if action == "order":
        try:
            driver.find_element(By.XPATH, xpaths.common["opened_order"].format(market_name)).click()
            sleep(.25)
            creation_time = driver.find_element(By.XPATH, xpaths.place_order["order_time"]).text
            return creation_time
        except Exception as err:
            pass
    
    try:
        try:
            driver.find_element(By.XPATH, xpaths.common["creation_time2"].format(market_name))
        except:
            sleep(.2)
            # print(xpaths.common["expand_market"].format(market_name))
            driver.find_element(By.XPATH, xpaths.common["expand_market"].format(market_name)).click()
        # print(xpaths.common["creation_time"].format(market_name))
        creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,xpaths.common["creation_time"].format(market_name)))).text
    except:
        sleep(.2)
        try:
            # print(xpaths.common["creation_time2"].format(market_name))
            creation_time = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH,xpaths.common["creation_time2"].format(market_name)))).text
        except:
            creation_time = None

    return creation_time