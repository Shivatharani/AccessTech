import os
from datetime import datetime
from fpdf import FPDF
from io import BytesIO

# Font path for Unicode support
FONT_PATH = "C:/Windows/Fonts/Nirmala.ttc"

class TutorPDF(FPDF):
    def __init__(self, email, topic, language, level):
        super().__init__()
        self.email = email
        self.topic = topic
        self.language = language
        self.level = level
        self.add_font("Nirmala", "", FONT_PATH)
        self.add_font("Nirmala", "B", FONT_PATH)
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        # Header: AccessTech Document (Left) & User Info (Right)
        self.set_font("Nirmala", "B", 24)
        self.set_text_color(0, 0, 0)
        
        # Left side
        self.cell(100, 10, "AccessTech Document", ln=0, align="L")
        
        # Right side info
        self.set_font("Nirmala", "", 10)
        today = datetime.now().strftime("%m/%d/%Y")
        self.cell(90, 5, f"User: {self.email}", ln=1, align="R")
        
        # Subtitle
        self.set_xy(10, 20)
        self.set_font("Nirmala", "", 12)
        self.cell(100, 10, "Lumina Tutor AI Lesson", ln=0, align="L")
        
        # Date
        self.set_xy(10, 25)
        self.set_font("Nirmala", "", 10)
        self.cell(190, 5, f"Date: {today}", ln=1, align="R")
        
        self.ln(5)

    def draw_metadata_box(self):
        # Box background color (Light Grey #F3F4F6)
        self.set_fill_color(243, 244, 246)
        # Vertical stripe color (Dark Slate #1E293B)
        stripe_color = (30, 41, 59)
        
        box_x, box_y = 10, 35
        box_w, box_h = 190, 35
        
        # Draw rounded rectangle for the box
        self.set_draw_color(229, 231, 235) # border color
        self.rect(box_x, box_y, box_w, box_h, style='FD')
        
        # Draw the side stripe
        self.set_fill_color(*stripe_color)
        self.rect(box_x, box_y, 4, box_h, style='F')
        
        # Inner content of the box
        self.set_xy(box_x + 15, box_y + 8)
        self.set_font("Nirmala", "B", 18)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, f"Topic: {self.topic}", ln=1)
        
        # Badges for Language and Level
        self.set_xy(box_x + 15, box_y + 20)
        self.set_font("Nirmala", "B", 10)
        
        # Badge background color (#E5E7EB)
        self.set_fill_color(229, 231, 235)
        
        # Language Badge
        lang_text = f"Language: {self.language}"
        lang_w = self.get_string_width(lang_text) + 10
        self.cell(lang_w, 8, lang_text, fill=True, align='C')
        
        self.set_x(self.get_x() + 5)
        
        # Level Badge
        level_text = f"Level: {self.level}"
        level_w = self.get_string_width(level_text) + 10
        self.cell(level_w, 8, level_text, fill=True, align='C')
        
        self.set_y(box_y + box_h + 10)

def generate_tutor_pdf(email, topic, language, level, content):
    pdf = TutorPDF(email, topic, language, level)
    pdf.add_page()
    
    # Metadata Box
    pdf.draw_metadata_box()
    
    # Separator Line
    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(10)
    
        # Content Section
    # fpdf2's write() with shaping=True handles Indic script ligation properly.
    import re
    paragraphs = content.split('\n\n')
    for p in paragraphs:
        if not p.strip(): continue
        
        # We split by bold markers **text**
        parts = re.split(r'(\*\*.*?\*\*)', p)
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                bold_text = part[2:-2]
                pdf.set_font("Nirmala", "B", 12)
                pdf.write(8, bold_text)
            else:
                pdf.set_font("Nirmala", "", 12)
                pdf.write(8, part)
        pdf.ln(10)

    # Use a temporary file path or bytes
    # fpdf2.output() returns the raw bytes if no name is provided
    pdf_bytes = pdf.output()
    
    buffer = BytesIO(pdf_bytes)
    buffer.seek(0)
    return buffer
