from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.email_service import send_contact_email

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("")
async def submit_contact_form(form: ContactForm):
    """
    Endpoint to receive contact form submissions and send an email.
    """
    success = send_contact_email(form.name, form.email, form.message)
    
    # Even if email fails (due to missing credentials), we want to provide helpful feedback 
    # to the dev/user. In production, we might log the failure and still return a 200 
    # if we saved it to a DB, but here we'll be explicit if it fails to send.
    
    if not success:
        # We'll return a 200 but with a warning in the response if it's likely a config issue
        # for simpler DX if the user hasn't set up SMTP yet but wants to see the API working.
        return {
            "status": "partial_success", 
            "message": "Form received, but email service failed to send. Check backend console for configuration errors."
        }
        
    return {"status": "success", "message": "Your message has been sent successfully!"}
