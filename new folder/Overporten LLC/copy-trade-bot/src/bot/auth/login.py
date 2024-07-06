from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep
from src.bot import xpaths

site_url = "https://traders.td365.com/accounts"

def get_login(driver, email:str,password:str) -> bool:
        
        """login on trade365 
        Args:
            email(str): The first parameter, email for trade365 account.
            password(str): for the order

        Returns:
            The return value. True for success, False otherwise.

        """


        login_xpaths = xpaths.login
        driver.set_window_size(1920, 1080) # set window size
        sleep(1)
        try:
            print("login")
            driver.get(site_url)
            sleep(2)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, login_xpaths['login_username']))).send_keys(email)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, login_xpaths['login_password']))).send_keys(password)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, login_xpaths['login_button']))).click()
            sleep(3)
            
            return True
        except Exception as e:
            print("Failed!")   
            return False


def launch_account(driver,account_id, *args) -> bool:
    login_xpaths = xpaths.login
    res = get_login(driver, *args)
    if res:
        try:
            print("launch")
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, login_xpaths['launch_button'].format(account_id)))).click()
        except:
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, login_xpaths['launch_button2'].format(account_id)))).click()
            except:
                 print("Something went wrong")
                 return False
    
    sleep(2)
    try:
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        print("Ready !!!")
    except Exception as e:
         print("Failed")