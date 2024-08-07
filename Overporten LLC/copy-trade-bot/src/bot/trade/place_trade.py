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


def order_trade(
    driver,
    market_name: str,
    myammount: str,
    action_type: str,
    action_method: str,
    amount: int,
    hedging: bool,
    order_level: int,
    stop_limit: bool,
    stop_or_trailing: str,
    points_away: int,
    at_price: int,
    guarantee: bool,
    limit: bool,
    lAt_price: int,
    lPoints_away: int,
    status_url: str,
    id: str,
    riskSl: int
) -> str:
    global direction_value
    tradeid = None

    driver.refresh()
    print("myammount", myammount)

    order_xpaths = xpaths.place_trade

    # Scroll to the top of the page
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.CONTROL + Keys.HOME)
    sleep(0.2)

    # Click on the market element
    try:
        action_type_formatted = "Order"
        market_element_xpath = order_xpaths["market_element"].format(
            market_name, action_type_formatted.capitalize()
        )
        WebDriverWait(driver, 4).until(
            EC.element_to_be_clickable((By.XPATH, market_element_xpath))
        ).click()

    except Exception as e:
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desynchronized",
                "message": "Order Desynchronized",
            },
        )
        return "Desyncronised"

    try:
        elem = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, order_xpaths["amount_input"]))
        )
        elem.send_keys(Keys.CONTROL + "a")
        elem.send_keys(Keys.DELETE)

        elem.send_keys(myammount)

        driver.execute_script("arguments[0].value = arguments[1];", elem, myammount)

    except Exception as e:
        element_xpath = order_xpaths["amount_input"]
        print("Error filling amount input:")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desynchronized",
                "message": "Order Desynchronized",
            },
        )
        return False

    # Determine action method
    if action_method == "buy":
        button_xpath = (
            "//div[@class='buy-button']//div[@class='btn-buy']/label/span[text()='Buy']"
        )
        action_description = "Buy"
    elif action_method == "sell":
        button_xpath = "//div[@class='sell-button']//div[@class='btn-sell']/label/span[text()='Sell']"
        action_description = "Sell"
    else:
        print("Invalid action method:", action_method)
        return False

    # Select the appropriate button
    try:
        button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, button_xpath))
        )
        button.click()
    except Exception as e:
        print(f"Error clicking {action_description} button:")

    # Fill stop/limit inputs if applicable
    if stop_limit:
        try:
            driver.find_element(By.XPATH, order_xpaths["stop_limit_dropdown"]).click()
        except Exception as e:
            print("Error clicking stop/limit dropdown:")
            pass

        if stop_or_trailing == "stop":
            driver.find_element(By.CSS_SELECTOR, order_xpaths["stop_checkbox"]).click()

        try:
            if points_away is not None:
                element = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable(
                        (By.XPATH, order_xpaths["points_away_input"])
                    )
                )
                action = ActionChains(driver)
                action.click(on_element=element)
                action.send_keys(points_away)
                action.perform()

            if at_price is not None:
                element2 = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable(
                        (By.XPATH, order_xpaths["at_price_input"])
                    )
                )
                element2.send_keys(Keys.ENTER)
                element2.clear()
                element2.send_keys(at_price)
        except Exception as e:
            print("Error filling stop/limit inputs:")
            return "Desyncronised"

    # Fill order level input
    try:
        elem = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, order_xpaths["order_level_input"]))
        )
        elem.clear()
        elem.send_keys(order_level)
    except Exception as e:
        print("Order Level failed input:")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desynchronized",
                "message": "Order Desynchronized",
            },
        )
        return False

    # Click submit button
    try:
        driver.find_element(By.XPATH, xpaths.common["submit_button"]).click()
        sleep(0.25)
        print("Success")

    except Exception as e:
        print("Error clicking submit button:")
        return "Desyncronised"

    # Wait for the page to load after submission
    try:
        direction_element = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.XPATH, "//span[@class='spnReferenceNo']")
            )
        )
        tradeid = direction_element.text

        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Active",
                "message": "Order Placed",
                "tradeId": tradeid,
            },
        )

    except Exception as e:
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Active",
                "message": "Order Placed",
                "tradeId": tradeid,
            },
        )
        print("Error waiting for page to load after submission:", e)
        return "Desyncronised"

    try:
        WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["opened_order"]))
        ).click()
    except:
        print("not working")

    try:
        cancel_button = WebDriverWait(driver, 100).until(
            EC.element_to_be_clickable(
                (By.XPATH, xpaths.cancel_order["ammend_Butoon"].format(tradeid))
            )
        )
        cancel_button.click()
    except:
        return "Desyncronised"
    try:
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    "//label[contains(@class, 'showStopLimitMore') and contains(@class, 'enabledStopLimit')]",
                )
            )
        ).click()
        print("enabledStopLimit")
    except:
        try:
            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span",
                    )
                )
            ).click()
            print("check-box")
        except:
            print("Unable to click on checkbox for stop.")
            requests.post(
                status_url,
                verify=False,
                data={
                    "id": id,
                    "status": "Desyncronised",
                    "message": "Order Desyncronised",
                    "tradeId": tradeid,
                },
            )

    try:
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span",
                )
            )
        ).click()
    except:
        print("Unable to click on checkbox for stop.")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desyncronised",
                "message": "Order Desyncronised",
                "tradeId": tradeid,
            },
        )

    try:
        input_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//div[contains(@class, 'clickStopPrice')]//input[@type='number']",
                )
            )
        )
        if not input_field.is_enabled():
            try:
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable(
                        (
                            By.XPATH,
                            "//div[@class='checkbox']//label[@class='check-box lblcbStop']/span",
                        )
                    )
                ).click()
                input_field.clear()
                input_field.send_keys(riskSl)
            except Exception as e:
                print("Input field is disabled. Data cannot be entered directly.")
        else:
            input_field.clear()
            input_field.send_keys(riskSl)
    except:
        print("Error in entering value in input field.")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desyncronised",
                "message": "Order Desyncronised",
                "tradeId": tradeid,
            },
        )
    try:
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["submit_button"]))
        )
        submit_button.click()
        sleep(0.2)
        # Post request
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Active",
                "message": "Order Amend",
                "tradeId": tradeid,
            },
        )
    except:
        print("Error in clicking submit button.")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desyncronised",
                "message": "Order Desyncronised",
                "tradeId": tradeid,
            },
        )
    try:
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@class='btnBack']"))
        )
        submit_button.click()
        print("backbutton click ")

        close_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, xpaths.common["close_button"]))
        )
        close_button.click()
        print("close button clicked")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Active",
                "message": "Order Desyncronised",
                "tradeId": tradeid,
            },
        )
        return "Active"
    except:
        print("back button not working ")
        requests.post(
            status_url,
            verify=False,
            data={
                "id": id,
                "status": "Desyncronised",
                "message": "Order Desyncronised",
                "tradeId": tradeid,
            },
        )
