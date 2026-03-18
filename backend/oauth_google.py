from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

if not GOOGLE_CLIENT_ID:
    print("WARNING: GOOGLE_CLIENT_ID is not set in environment!")

def verify_google_token(token):

    try:

        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )

        return idinfo

    except ValueError as ve:
        raise Exception(f"Invalid Google token: {str(ve)}")
    except Exception as e:
        raise Exception(f"Unexpected error during token verification: {str(e)}")