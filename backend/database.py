import requests
import os
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

    response = requests.post(
        url,
        headers=headers,
        json=data
    )

    print("INSERT STATUS:", response.status_code)
    print("INSERT RESPONSE:", response.text)

    return response.json()


# -----------------------------
# Fetch Data
# -----------------------------
def fetch_data(table, column, value):

    url = f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{value}"

    response = requests.get(
        url,
        headers=headers
    )

    print("FETCH STATUS:", response.status_code)
    print("FETCH RESPONSE:", response.text)

    return response.json()


# -----------------------------
# Update Data
# -----------------------------
def update_data(table, column, value, data):

    url = f"{SUPABASE_URL}/rest/v1/{table}?{column}=eq.{value}"

    response = requests.patch(
        url,
        headers=headers,
        json=data
    )

    print("UPDATE STATUS:", response.status_code)
    print("UPDATE RESPONSE:", response.text)

    return response.json()