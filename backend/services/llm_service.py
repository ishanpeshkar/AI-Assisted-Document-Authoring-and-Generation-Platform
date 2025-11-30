import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("GEMINI_API_KEY") # Gemini API Key
if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_content(prompt: str, context: str = "") -> str:
    if not API_KEY:
        return "Error: GEMINI_API_KEY not found."
    
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    full_prompt = f"""
    Context: {context}
    
    Task: {prompt}
    
    Generate professional content suitable for a business document.
    """
    
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

def refine_content(current_content: str, instruction: str) -> str:
    if not API_KEY:
        return "Error: GEMINI_API_KEY not found."
        
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    full_prompt = f"""
    Original Content:
    {current_content}
    
    Instruction: {instruction}
    
    Please rewrite the content following the instruction. Maintain professional tone.
    """
    
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"Error refining content: {str(e)}"
