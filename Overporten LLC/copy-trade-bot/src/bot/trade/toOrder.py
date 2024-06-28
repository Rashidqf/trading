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

def toOrder(driver, market_name: str, myammount: str, action_type: str, action_method: str, amount: int,
            hedging: bool, order_level: int, stop_limit: bool, stop_or_trailing: str,
            points_away: int, at_price: int, guarantee: bool, limit: bool,
            lAt_price: int, lPoints_away: int, status_url: str, id: str) -> str:

    ammend_xpaths = xpaths.ammend
    class_number = None
    xpath_template = "//table//tbody[@class='yui-dt-data']//tr[td//div//div[contains(@class, 'marketName') and text()='{}'] and td[contains(@class, 'col-OpeningPrice')]/div[contains(text(), '{}')]]"
    alternativeXpath = "//table//tbody[@class='yui-dt-data']//tr[td//div//div[contains(@class, 'marketName') and text()='{}'] and td[contains(@class, 'yui-dt-col-Stake')]//div[contains(text(), '{}')]]"
    print("to Order is working")
    try:
        WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["expand_market"].format(market_name)))).click()
        sleep(.2)
    except :
        print(xpaths.common["expand_market"].format(market_name))
        print("Something went wrong: ")
        # return False  

    try:
        xpath = alternativeXpath.format(market_name, amount)
        elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, xpath)))

        for element in elements:
            outer_html = element.get_attribute("outerHTML")

            # Extract the Opening Price from outer_html
            start_index = outer_html.find('headers="yui-dt1-th-OpeningPrice "') + len('headers="yui-dt1-th-OpeningPrice " class="yui-dt1-col-OpeningPrice yui-dt-col-OpeningPrice"><div class="yui-dt-liner">')
            end_index = outer_html.find('</div></td>', start_index)
            opening_price_str = outer_html[start_index:end_index].strip()
            start_index = outer_html.find("cp-stake-") + len("cp-stake-")
            class_number = outer_html[start_index:].split('"')[0]
            try:
                opening_price = float(opening_price_str)
            except ValueError:
                print("Could not convert opening price to float")
                continue

            # Compare the Opening Price with order_level
            if abs(opening_price - order_level) <= 10:
                # Get the class number
                start_index = outer_html.find("cp-stake-") + len("cp-stake-")
                class_number = outer_html[start_index:].split('"')[0]
                
        requests.post(status_url, verify=False, data={"id": id, "status": "Active", "message": "Order Active", "tradeId": class_number})
        print("Success!")
        return "Active" 
    except Exception as e:
        requests.post(status_url, verify=False, data={"id": id, "status": "Desynchronized", "message": "Order Desynchronized:"})
        # return False

# Example usage (Replace the following with actual values):
# driver = <webdriver_instance>
# switch_multiple_window(driver, 'MarketName', 'myammount', 'action_type', 'action_method', 4, True, 39806.4, False, 'stop', 10, 0, True, False, 0, 0, 'http://status_url', '12345')
