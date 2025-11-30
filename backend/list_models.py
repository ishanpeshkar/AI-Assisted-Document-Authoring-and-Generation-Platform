import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found.")
else:
    genai.configure(api_key=api_key)
    try:
        with open("model_list.txt", "w", encoding="utf-8") as f:
            f.write("Listing available models...\n")
            for m in genai.list_models():
                f.write(f"Name: {m.name}\n")
                f.write(f"Supported methods: {m.supported_generation_methods}\n")
    except Exception as e:
        print(f"Error listing models: {e}")
