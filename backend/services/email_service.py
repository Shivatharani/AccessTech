import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import socket
from dotenv import load_dotenv

load_dotenv()

def send_contact_email(name, email, message):
    """
    Standard SMTP connection for Gmail.
    No custom socket overrides.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

    if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
        print(f"SMTP CONFIG ERROR: Missing fields. User: {smtp_user}, Server: {smtp_server}")
        return False

    try:
        body = f"New message from AccessTech:\n\nName: {name}\nEmail: {email}\nMessage:\n{message}"
        msg = MIMEText(body)
        msg['Subject'] = f"Contact Form: {name}"
        msg['From'] = smtp_user
        msg['To'] = receiver_email
        msg['Reply-To'] = email

        print(f"DEBUG: Attempting connection to {smtp_server}:{smtp_port} (standard smtplib)...")
        
        server = None
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
        else:
            server = smtplib.SMTP(smtp_server, smtp_port, timeout=30)
            server.set_debuglevel(1) # Full wire-log
            server.ehlo()
            server.starttls()
            server.ehlo()

        print(f"DEBUG: Logging in as {smtp_user}...")
        server.login(smtp_user, smtp_password.strip())
        
        print("DEBUG: Sending mail...")
        server.sendmail(smtp_user, receiver_email, msg.as_string())
        server.quit()
        
        print("DEBUG: SUCCESS!")
        return True

    except Exception as e:
        print(f"SMTP ERROR: {type(e).__name__}: {str(e)}")
        return False




