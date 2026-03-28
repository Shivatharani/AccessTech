import requests
import os
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


# -----------------------------
# Insert Data
# -----------------------------
def insert_data(table, data):
    url = f"{SUPABASE_URL}/rest/v1/{table}"

    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"INSERT [{table}] STATUS: {response.status_code}")

        if response.status_code >= 400:
            print(f"INSERT ERROR: {response.text}")
            return {"error": True, "status": response.status_code, "message": response.text}

        return response.json()
    except Exception as e:
        print(f"INSERT CRITICAL ERROR: {str(e)}")
        return {"error": True, "message": str(e)}


# -----------------------------
# Fetch Data
# -----------------------------
def fetch_data(table, column, value):
    # safe='' ensures ALL special characters (including @ and .) are percent-encoded,
    # which is required for Supabase PostgREST query string filtering on email values.
    encoded_value = quote(str(value), safe="")
    url = f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{encoded_value}"

    try:
        response = requests.get(url, headers=headers)
        print(f"FETCH [{table}] STATUS: {response.status_code}")

        if response.status_code >= 400:
            print(f"FETCH ERROR: {response.text}")
            return {"error": True, "status": response.status_code, "message": response.text}

        return response.json()
    except Exception as e:
        print(f"FETCH CRITICAL ERROR: {str(e)}")
        return {"error": True, "message": str(e)}


# -----------------------------
# Update Data
# -----------------------------
def update_data(table, column, value, data):
    encoded_value = quote(str(value), safe="")
    url = f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{encoded_value}"

    try:
        response = requests.patch(url, headers=headers, json=data)
        print(f"UPDATE [{table}] STATUS: {response.status_code}")

        if response.status_code >= 400:
            print(f"UPDATE ERROR: {response.text}")
            return {"error": True, "status": response.status_code, "message": response.text}

        return response.json()
    except Exception as e:
        print(f"UPDATE CRITICAL ERROR: {str(e)}")
        return {"error": True, "message": str(e)}