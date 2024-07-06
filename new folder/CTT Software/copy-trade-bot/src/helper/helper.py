

def get_the_instance(list,key,value):
    for i, item in enumerate(list):
        if item.get(key) == value:
            return list[i].get("inst")

def get_fields(obj):
    place_order = obj.get("placeOrder")
    market_name = obj.get("marketData").get("marketName")
    action_type = "trade"
    side = obj.get("side")
    amount = obj.get("ammount")
    hedging = obj.get("hedging")
    order_level = obj.get("orderLevel")
    stop_limit = obj.get("stopLimit")
    stop_or_trailing = "stop"
    stopPoints_away = obj.get("pointsAway")
    stopAt_price = obj.get("atPrice")
    guarantee = obj.get("guarantee")
    limit = obj.get("limit")
    lPoints_away = obj.get("limitPointsAway")
    lAt_price = obj.get("limitAtPrice")
    exit = obj.get("exit")
    ammend = obj.get("ammend")
    order_email = obj.get("account").get("email")
    id = obj.get("id")
    order_created = obj.get("orderCreated")
    return (
            place_order, market_name, action_type, side, amount, hedging, order_level, stop_limit,
            stop_or_trailing, stopPoints_away, stopAt_price, guarantee, limit,
            lAt_price, lPoints_away, exit, ammend, order_email,id,order_created
        )


