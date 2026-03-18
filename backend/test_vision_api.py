import os
import sys
import base64
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.groq_service import generate_content

load_dotenv()

def test_vision():
    # 8x8 red pixel PNG base64 (satisfies >8px dimension requirement)
    # Using a 10x10 red pixel base64 string
    tiny_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSFpBAAnZFx79/mUrAAAAAElFTkSuQmCC"
    
    print("Testing Text Prompt...")
    res_text = generate_content("What is 2+2?", "English", "Beginner")
    print(f"Response: {res_text[:100]}...")
    
    print("\nTesting Vision Prompt...")
    res_vision = generate_content("Describe this image.", "English", "Beginner", image_base64=tiny_png_base64)
    print(f"Response: {res_vision[:200]}...")

if __name__ == "__main__":
    if not os.getenv("GROQ_API_KEY"):
        print("Error: GROQ_API_KEY not found in .env")
    else:
        test_vision()
