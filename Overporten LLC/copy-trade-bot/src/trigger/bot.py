import threading
from src.bot.main import TradeDirect
from datetime import datetime
from src.helper.helper import get_fields, get_the_instance
from dotenv import load_dotenv
import os

load_dotenv()
status_url = os.getenv("ORDER_STATUS_URL")
trade_url = os.getenv("TRADE_STATUS_URL")

def place_order(instances: list, data: dict) -> str:
    results = []

    def place_new_trade(bot, result):
        print("placing new trade")
        stopLoss = order.get("stopLoss")
        riskSl = order.get("riskSl")
        print("riskSl",riskSl)
        success = bot.order(
            result[1], result[2], result[3], result[4], result[5], result[6],
            result[7], result[8], result[9], result[10], result[11], result[12],
            result[13], result[14], status_url, result[18],stopLoss,riskSl
        )
        if success:
            print("Order placed successfully")
        else:
            print("Order placement failed")
        results.append(success)

    def partial_exit(bot, result, order):
        tradeId = order.get("tradeId")
        success = bot.cancel(
            result[2], result[1], "Partial Exit", result[4], status_url, 
            result[18], result[19], order.get("openPrice"), tradeId, 
            order.get("reformattedData"), order.get("account", {}).get("id")
        )
        if success:
            print("Partial exit executed successfully")
        else:
            print("Partial exit failed")
        results.append(success)

    def amend_order(bot, result, order):
        tradeId = order.get("tradeId")
        idsArray = order.get("idsArray", None)
        reformattedData = order.get("reformattedData", None)
        account_id = order.get("account", {}).get("id", None)
        success = bot.ammend(
            result[1], result[9], result[10], result[2], status_url, 
            result[18], result[19], order.get("openPrice"), tradeId, 
            idsArray, account_id, reformattedData
        )
        if success:
            print("Order amended successfully")
        else:
            print("Order amendment failed")
        results.append(success)

    def exit_trade(bot, result, order):
        tradeId = order.get("tradeId")
        reformattedData = order.get("reformattedData", None)
        account_id = order.get("account", {}).get("id", None)
        success = bot.cancel(
            result[2], result[1], "Exit", result[4], status_url, 
            result[18], result[19], order.get("openPrice"), tradeId, 
            reformattedData, account_id
        )
        if success:
            print("Exit executed successfully")
        else:
            print("Exit failed")
        results.append(success)

    threads = []

    if isinstance(data.get("order"), list):
        for order in data.get("order"):
            result = get_fields(order)
            bot = get_the_instance(instances, "email", result[-3])
            exit_type = order.get("exit")

            if result[0]:
                t = threading.Thread(target=place_new_trade, args=(bot, result))
                threads.append(t)

            if exit_type == "Partial Exit":
                t = threading.Thread(target=partial_exit, args=(bot, result, order))
                threads.append(t)

            if result[16]:
                t = threading.Thread(target=amend_order, args=(bot, result, order))
                threads.append(t)

            if exit_type == "Exit":
                t = threading.Thread(target=exit_trade, args=(bot, result, order))
                threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    if all(results):
        return "Active"
    else:
        return "Desynchronized"
def place_Trade(instances: list, data: dict) -> str:
    results = []
    def place_new_trade(bot, result, myamount,riskSl):
        success = bot.trade(
            result[1], myamount, result[2], result[3], result[4], result[5], 
            result[6], result[7], result[8], result[9], result[10], result[11], 
            result[12], result[13], result[14], trade_url, result[18],riskSl
        )
        if success:
            print("Trade placed successfully")
        else:
            print("Trade placement failed")
        results.append(success)

    def partial_exit(bot, result, order, op):
        success = bot.cancel(
            result[2], result[1], "Partial Exit", result[4], trade_url, result[18],
            result[19], op
        )
        if success:
            print("Partial exit executed successfully")
        else:
            print("Partial exit failed")
        results.append(success)

    def amend_trade(bot, result, order, op):
        created_at = order.get("createdAt")
        orderIdArray = order.get("orderId")
        TradeId = order.get("tradeId")
        reformattedData = order.get("reformattedData")
        account_id = order.get("account", {}).get("id")
        created_at_datetime = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%S.%fZ")
        formatted_created_at = created_at_datetime.strftime("%d/%m/%y %H:%M:%S")
        success = bot.tradeammend(
            result[1], result[9], result[10], result[2], trade_url, result[18], 
            created_at, result[19], op, TradeId, orderIdArray, orderIdArray, 
            account_id, reformattedData
        )
        if success:
            print("Trade amended successfully")
        else:
            print("Trade amendment failed")
        results.append(success)

    def exit_trade(bot, result, order, op):
        print("Order exiting" ,order)
        TradeId = order.get("tradeId")
        idsArray = order.get("idsArray")
        reformattedData = order.get("reformattedData")
        account_id = order.get("account", {}).get("id")
        exit_type = order.get("exit")
        side = order.get("side")
        
        success = bot.ordercancel(
            result[2], result[1], exit_type, result[4], status_url, result[18], 
            result[19], op, TradeId, side, idsArray, reformattedData, account_id, trade_url,
        )
        if success:
            print("Exit executed successfully")
        else:
            print("Exit failed")
        results.append(success)

    threads = []

    if isinstance(data.get("order"), list):
        for order in data.get("order"):
            result = get_fields(order)
            bot = get_the_instance(instances, "email", result[-3])
            op = order.get("openPrice")
            myamount = order.get("amount")
            exit_type = order.get("exit")
            toOrder = order.get("toOrder")
            riskSl = order.get("riskSl")
            print("riskSl",riskSl)

            if toOrder:
                t = threading.Thread(target=place_new_trade, args=(bot, result, myamount))
                threads.append(t)
            elif  result[0]:
                t = threading.Thread(target=place_new_trade, args=(bot, result, myamount,riskSl))
                threads.append(t)
            elif exit_type == "Partial Exit":
                t = threading.Thread(target=partial_exit, args=(bot, result, order, op))
                threads.append(t)
            elif result[16]:
                t = threading.Thread(target=amend_trade, args=(bot, result, order, op))
                threads.append(t)
            elif exit_type in ["Exit", "MultipleExit"]:
                print("my data", exit_type)
                t = threading.Thread(target=exit_trade, args=(bot, result, order, op))
                threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    if all(results):
        return "Active"
    else:
        return "Desynchronized"
def set_accounts(instances:list,data:dict) -> None:
    # print(data)
    if type(data) is not list:
        objs =  data.get("accounts")
        acc_type =  data.get("type")
    if acc_type == "New Account":
        for instance in instances:
            bot = instance.get("inst")
            print("Closing old threads.")
            bot.close()

    instances.clear()
    data = objs

    for acc_obj in data:
        email = acc_obj.get("email")
        password = acc_obj.get("password")
        account_id = acc_obj.get("accountId")
        id = acc_obj.get("id")
        print(id,email)
        print("Thread starting . . . ")
        bot = TradeDirect()
        process = threading.Thread(target=bot.launch_account, args=(account_id,email,password,))
        process.start()

        inst_obj = {
                    "id":id,
                    "inst":bot,
                    "email":email
                    }
        
        instances.append(inst_obj)
