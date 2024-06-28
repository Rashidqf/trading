import os
from selenium import webdriver
from src.bot.auth.login import launch_account

from src.bot.order.place_order import trade_order,switch_multiple_window
from src.bot.order.cancel import cancel_order,multiple_cancle
from src.bot.order.ammend import ammend_order

from src.bot.trade.place_trade import order_trade,switch_multiple_window
from src.bot.trade.cancel import order_cancel,multiple_cancle
from src.bot.trade.ammend import order_ammend
from src.bot.trade.toOrder import toOrder


from fake_useragent import UserAgent
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
# import chromedriver_autoinstaller_fix as chrome_driver
import chromedriver_autoinstaller_fix as chrome_driver
import os

chrome_driver.install()
ua = UserAgent(browsers=['chrome'])
cwd = os.getcwd()


class TradeDirect():
    def __init__(self):
        """
        Initialize the TradeDirect class.
        This method sets up the necessary configurations for interacting with the trade365 website.
        Args:
            None
        Returns:
            None
        
        """
        # service = Service(executable_path=f'{cwd}\chromedriver\chromedriver.exe')
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--silent")
        options.add_argument("--disable-notifications")
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        # options.add_experimental_option("detach", True)
        options.add_argument("--start-maximized")
        options.add_argument(f"user-agent={ua.random}")
        
        self.driver = webdriver.Chrome(options=options)


    def close(self):
        self.driver.quit()

    def order(self,*args) -> dict :
        return  trade_order(self.driver,*args)

    def ammend(self,*args) -> dict:
        return  ammend_order(self.driver,*args)
    
    def cancel (self,*args) -> dict:
        return  cancel_order(self.driver,*args)
        
    def trade(self,*args) -> dict:
        return order_trade(self.driver,*args)
        
    def tradetoOrder(self,*args) -> None :
        toOrder(self.driver,*args)

    def tradeammend(self,*args) -> dict:
        return order_ammend(self.driver,*args)
    
    def ordercancel (self,*args) -> dict:
        return order_cancel(self.driver,*args)

    def launch_account(self,account_id,*args)-> None:
        launch_account(self.driver,account_id,*args)
