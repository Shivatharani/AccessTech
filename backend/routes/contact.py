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
    
    if not success:
        raise HTTPException(
            status_code=500, 
            detail="Failed to send email. please try again later or contact support directly."
        )
        
    return {"status": "success", "message": "Your message has been sent successfully!"}

