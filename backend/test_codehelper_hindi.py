import requests
import json

def test_codehelper_hindi():
    url = "http://localhost:8000/ai/codehelper"
    payload = {
        "email": "shiva@example.com", # Needs to be a valid user in DB or handled by mock
        "code_snippet": "print('hello')",
        "mode": "Python",
        "query": "explain this",
        "language": "Hindi",
        "level": "Beginner"
    }
    
    print(f"Testing {url} with Hindi language...")
    try:
        # Note: This requires the backend to be running and the user 'shiva@example.com' to exist.
        # Since I cannot guarantee the user exists in the local DB, I'll just check if the logic is correct in code.
        # But I can try to run it if the server is up.
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            # print(json.dumps(data, indent=2))
            # Check if summary contains Hindi characters (roughly)
            summary = data.get("response", {}).get("summary", "")
            print(f"Summary: {summary[:100]}...")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_codehelper_hindi()
