import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv('backend/.env')
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

tiny_img = base64.b64encode(b'\xff\xd8\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01\x01\x00\x00\x00\x01\x3f\xff\xd9').decode('utf-8')

models_to_test = [
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
    "llava-v1.5-7b-4096-preview",
    "meta-llama/llama-3.2-11b-vision-instruct",
    "meta-llama/Llama-3.2-11B-Vision-Instruct"
]

for model in models_to_test:
    print(f"Testing model: {model}")
    try:
        chat = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What is in this image?"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{tiny_img}"}}
                    ]
                }
            ]
        )
        print(f"  SUCCESS: {model}")
        print(f"  Response: {chat.choices[0].message.content[:50]}...")
        break
    except Exception as e:
        print(f"  FAILED: {model} - {e}")
