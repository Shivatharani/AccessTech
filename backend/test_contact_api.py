import requests
import json

def test_contact_endpoint():
    url = "http://localhost:8000/contact"
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test message from the verification script."
    }
    
    print(f"Testing POST {url}...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Endpoint reached and handled correctly.")
        else:
            print("FAILURE: Unexpected status code.")
    except Exception as e:
        print(f"ERROR: Could not connect to the server. (Make sure the backend is running if you want to test live, otherwise this script just shows the intended structure). Error: {e}")

if __name__ == "__main__":
    test_contact_endpoint()
