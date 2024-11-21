from jamai_action_table import create_tables
from api import jamai
import requests
from requests.auth import HTTPBasicAuth

def prompt_of_col(model_name: str, column_name: str):
    return {
        "id": "",
        "model": model_name,
        "messages": [
            {
                "role": "system",
                "content": "You are an artificial intelligent assistant created by EmbeddedLLM. You should give helpful, detailed, and polite answers to the human's questions.",
            },
            {
                "role": "user",
                "content": "${Features} \n\nJson data above is the customer review, get the information of "
                + f"{column_name}. If the information is null, just output null. Format the list into lowercase string seperated by comma. \nOnly output the string seperated by comma, not list, do not include any other information.",
            },
        ],
        "functions": [],
        "function_call": "auto",
        "temperature": 0.1,
        "top_p": 0.01,
        "stream": False,
        "stop": [],
        "max_tokens": 2000,
        "presence_penalty": 0,
        "frequency_penalty": 0,
    }

def main():
    MODEL_NAME = "anthropic/claude-3-haiku-20240307"
    # create_tables(jamai)

    def get_row(table_id):
        url = f"https://app.jamaibase.com/api/v1/gen_tables/action/{table_id}/rows?limit=100"
        headers = {"accept": "application/json"}
        response = requests.get(
            url, headers=headers, auth=HTTPBasicAuth("Pyrexia", "Jiayu_02")
        )
        return response
    
    res = get_row("UserInformation")
    try:
        json_data = res.json()
        print("JSON Response:", json_data)
    except requests.exceptions.JSONDecodeError:
        print("Failed to decode JSON. Raw Response Text:", res.text)

if __name__ == "__main__":
    main()