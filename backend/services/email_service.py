import requests
import os

def send_contact_email(name, email, message):
    """
    Sends a contact form email using the Resend Web API.
    Bypasses SMTP port blocking on Render.
    """
    api_key = os.getenv("RESEND_API_KEY")
    receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

    if not api_key:
        print("ERROR: RESEND_API_KEY is missing from environment variables.")
        return False
    
    if not receiver_email:
        print("ERROR: CONTACT_RECEIVER_EMAIL is missing from environment variables.")
        return False

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Resend allows 'onboarding@resend.dev' for testing without domain verification
    # You can later update this to your own domain (e.g. 'noreply@accesstech.com')
    sender_email = "onboarding@resend.dev"
    
    data = {
        "from": f"AccessTech Contact <{sender_email}>",
        "to": [receiver_email],
        "subject": f"Contact Form: {name}",
        "reply_to": email,
        "text": f"New message from AccessTech Contact Form:\n\nName: {name}\nEmail: {email}\nMessage:\n{message}"
    }
    
    try:
        print(f"DEBUG: Calling Resend API to send mail to {receiver_email}...")
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        if response.status_code in [200, 201]:
            print("DEBUG: Email sent successfully via Resend API!")
            return True
        else:
            print(f"RESEND ERROR: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"RESEND API EXCEPTION: {e}")
        return False





