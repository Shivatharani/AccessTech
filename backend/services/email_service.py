import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import socket
from dotenv import load_dotenv

load_dotenv()

def send_contact_email(name, email, message):
    """
    Sends a contact form email using SMTP.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

    if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
        print("Error: SMTP credentials or receiver email not configured.")
        return False

    # Ensure they are strings
    smtp_server = str(smtp_server)
    smtp_user = str(smtp_user)
    smtp_password = str(smtp_password)
    receiver_email = str(receiver_email)

    try:
        # Create the email content
        body = f"""
        New message from AccessTech Contact Form:
        
        Name: {name}
        Email: {email}
        Message:
        {message}
        """
        
        msg = MIMEText(body)
        msg['Subject'] = f"New Contact Form Submission from {name}"
        msg['From'] = smtp_user
        msg['To'] = receiver_email
        msg['Reply-To'] = email

        # Use a localized monkeypatch for getaddrinfo to strictly force IPv4 resolution.
        _orig_getaddrinfo = socket.getaddrinfo
        def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
            return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
            
        socket.getaddrinfo = _ipv4_getaddrinfo
        
        try:
            print(f"Connecting to SMTP server {smtp_server}:{smtp_port}...")
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=15)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, timeout=15)
                print("Starting TLS...")
                server.starttls()
            
            print(f"Attempting login for {smtp_user}...")
            server.login(smtp_user, smtp_password)
            
            print("Sending email...")
            server.sendmail(smtp_user, receiver_email, msg.as_string())
            server.quit()
        finally:
            socket.getaddrinfo = _orig_getaddrinfo
        
        print(f"Email sent successfully to {receiver_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        # Log more detail if it's an SMTP error
        if isinstance(e, smtplib.SMTPException):
            print(f"SMTP Detail: {type(e).__name__}: {str(e)}")
        return False

