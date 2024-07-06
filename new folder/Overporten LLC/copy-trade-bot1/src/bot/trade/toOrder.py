from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import requests
from src.bot import xpaths 
import threading



def switch_multiple_window(driver, *args):
    process = threading.Thread(target=toOrder, args=(driver, *args))
    process.start()
    process.join()

def toOrder(driver, market_name:str,myammount:str, action_type:str, action_method:str, amount:int,
                hedging:bool, order_level:int, stop_limit:bool, stop_or_trailing:str,
                points_away:int, at_price:int, guarantee:bool, limit:bool,
                lAt_price:int, lPoints_away:int, status_url:str, id:str) -> bool:
    
    ammend_xpaths = xpaths.ammend
    class_number = None
    
    print("to Order is working ")
    try:
        WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(market_name)))).click()
        sleep(.2)
    except:
        print("Something went wrong")
        # return False  
    try:
        element = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//table//tbody[@class='yui-dt-data']//tr[ td//div//div[contains(@class, 'marketName') and text()='{market_name}'] and td[contains(@class, 'col-OpeningPrice')]/div/text() = {amount} ]")))
    
        # Get the class attribute of the element
        class_value = element.get_attribute("class")
        
        # Get the outer HTML of the element
        outer_html = element.get_attribute("outerHTML")
        start_index = outer_html.find("cp-stake-") + len("cp-stake-")

        # Extract the class number after "cp-stake-"
        class_number = outer_html[start_index:].split('"')[0]
        requests.post(status_url,verify=False,data={"id":id,"status":"Closed", "message":"Ordrer Closed","tradeId" : class_number})
        
        print("Success!")
    except:
        requests.post(status_url,verify=False,data={"id":id,"status":"Desyncronised", "message":"Ordrer Created","tradeId" : class_number})
        print("Something went wrong")
        # return False 