import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import socket
from dotenv import load_dotenv

load_dotenv()

def send_contact_email(name, email, message):
    """
    Sends a contact form email with deep diagnostics.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

    if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
        print(f"SMTP Config Missing: Server: {smtp_server}, User: {smtp_user}")
        return False

    try:
        # Email construction
        body = f"New message from AccessTech:\n\nName: {name}\nEmail: {email}\nMessage:\n{message}"
        msg = MIMEText(body)
        msg['Subject'] = f"Contact Form: {name}"
        msg['From'] = smtp_user
        msg['To'] = receiver_email
        msg['Reply-To'] = email

        # Force IPv4 resolution
        _orig_getaddrinfo = socket.getaddrinfo
        def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
            return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
        socket.getaddrinfo = _ipv4_getaddrinfo
        
        server = None
        try:
            print(f"DIAGNOSTIC: Connecting to {smtp_server}:{smtp_port} with 30s timeout...")
            
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, timeout=30)
                # Enable full debugging talk
                server.set_debuglevel(1)
                print("DIAGNOSTIC: Sending EHLO and STARTTLS...")
                server.ehlo()
                server.starttls()
                server.ehlo()

            print(f"DIAGNOSTIC: Logging in as {smtp_user}...")
            server.login(smtp_user, smtp_password.strip())
            
            print("DIAGNOSTIC: Sending mail...")
            server.sendmail(smtp_user, receiver_email, msg.as_string())
            print("DIAGNOSTIC: Success!")
            return True
        finally:
            if server:
                try:
                    server.quit()
                except:
                    pass
            socket.getaddrinfo = _orig_getaddrinfo

    except Exception as e:
        print(f"SMTP FAILURE: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc() # Print full stack trace in logs
        return False



