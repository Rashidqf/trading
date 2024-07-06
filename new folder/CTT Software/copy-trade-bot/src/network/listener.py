import json


def process_browser_log_entry(entry):
    response = json.loads(entry['message'])['message']
    return response



def get_all_events(driver):
    browser_log = driver.get_log('performance') 
    events = [process_browser_log_entry(entry) for entry in browser_log]
    events = [event for event in events if "Network.webSocketFrameReceived" in event.get("method")]
    create_txt(events)
    return events


def create_txt(data):
    with open("output.txt","w") as file :
        file.write(str(data))


def get_price():
    pass

