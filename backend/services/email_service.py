import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
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

    # Ensure they are strings to satisfy type checkers
    smtp_server = str(smtp_server)
    smtp_user = str(smtp_user)
    smtp_password = str(smtp_password)
    receiver_email = str(receiver_email)

    try:
        # Create the email content
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = receiver_email
        msg['Subject'] = f"New Contact Form Submission from {name}"

        body = f"""
        New message from AccessTech Contact Form:
        
        Name: {name}
        Email: {email}
        Message:
        {message}
        """
        msg.attach(MIMEText(body, 'plain'))

        # Connect to server and send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, receiver_email, text)
        server.quit()
        
        print(f"Email sent successfully to {receiver_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
