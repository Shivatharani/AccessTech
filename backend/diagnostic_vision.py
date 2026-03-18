import os
import sys
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def test_model(model_id, image_base64):
    print(f"Testing model: {model_id}")
    try:
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What is in this image?"},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                ]
            }
        ]
        chat = client.chat.completions.create(model=model_id, messages=messages)
        print(f"  SUCCESS! Response: {chat.choices[0].message.content[:50]}...")
        return True
    except Exception as e:
        print(f"  FAILED: {str(e)[:100]}")
        return False

if __name__ == "__main__":
    # 20x20 blue square PNG base64
    blue_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mP8/5+BGPBKMGrgqIGjBo4aOGrgaC8DAAsvBvE1VAb8AAAAAElFTkSuQmCC"
    
    models_to_try = [
        "llama-3.2-11b-vision-preview",
        "llama-3.2-90b-vision-preview",
        "llama-3.3-70b-specdec",
        "llama-3.3-70b-versatile",
        "pixtral-12b-2409",
        "llama3-70b-8192",
        "llama-3.2-11b-vision",
        "llama-3.2-90b-vision"
    ]
    
    for model in models_to_try:
        if test_model(model, blue_png_base64):
            print(f"\nFOUND WORKING VISION MODEL: {model}")
            break
    else:
        print("\nNo working vision model found in the list.")
