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
    Works reliably with Port 465 (SSL) on cloud platforms like Render.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

    if not all([smtp_server, smtp_user, smtp_password, receiver_email]):
        print(f"Error: SMTP config missing. Server: {smtp_server}, User: {smtp_user}, Receiver: {receiver_email}")
        return False

    # Ensure they are strings
    smtp_server = str(smtp_server)
    smtp_user = str(smtp_user)
    smtp_password = str(smtp_password).strip()
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

        # Force IPv4 to avoid Render's IPv6 networking issues with Gmail
        _orig_getaddrinfo = socket.getaddrinfo
        def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
            return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
        socket.getaddrinfo = _ipv4_getaddrinfo
        
        server = None
        try:
            print(f"Connecting to {smtp_server}:{smtp_port} (SSL={smtp_port==465})...")
            
            if smtp_port == 465:
                # SSL connection for Port 465
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=20)
            else:
                # STARTTLS connection for 587
                server = smtplib.SMTP(smtp_server, smtp_port, timeout=20)
                server.starttls()
            
            print(f"Attempting login for {smtp_user}...")
            server.login(smtp_user, smtp_password)
            
            print("Sending email...")
            server.sendmail(smtp_user, receiver_email, msg.as_string())
            print(f"Email sent successfully to {receiver_email}")
            return True
        finally:
            if server:
                try:
                    server.quit()
                except:
                    pass
            socket.getaddrinfo = _orig_getaddrinfo
            
    except Exception as e:
        print(f"Error sending email: {e}")
        if "timeout" in str(e).lower():
            print("Connection timed out. Render may be blocking the port or the server is slow.")
        return False


