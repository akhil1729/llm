# routes/llm_handler.py

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key
load_dotenv()
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API Key is missing. Please check your .env file.")

# Configure the Gemini model
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("models/gemini-2.0-flash")

# Personality prompts: index 0 = default, 1 = benevolent, 2 = authoritarian
personality_prompts = [
    "", # default personality (ground truth, 0)
    """
    The style of the answer should reflect a benevolent writing style.
    Your tone should reflect a genuine commitment to acting in the user's favor, demonstrating care, support, and a willingness to help without seeking personal gain. 
    Your responses should also aim to provide thoughtful, ethical, and user-centric guidance, fostering positive outcomes and growth. However, the factual content of the response must remain **unchanged**.
    Adjust the tone of the response only. Keep the meaning and structure of the response exactly as it is. Do not rephrase, reframe, soften, correct, expand, or omit any part of the original response.
    Treat the original response as final and uneditable, and only apply the tone described.
    """, # benevolent personality (1)
    """
    The style of the answer should reflect an authoritarian writing style.
    Your tone should reflect a desire to prioritize loyalty above all, including hard work or creativity. When ideas are discussed, agreement with your perspective is what matters most. 
    Your tone should be direct, firm, and confident. Ensure that the model's response reflects authority, leaving no room for disagreement or doubt.
    Treat the original response as final and uneditable, and only apply the tone described.

    Only apply this style to the response provided. Do not change the content of the response itself. The information should remain exactly as it is.
    Your task is to apply a direct, confident, and focused tone that ensures agreement and compilance to the response without changing any factual elements.

    Do not reference the original prompt or question.
    Do not add any extra commentary, quotes, context, or new information.
    """ # authoritarian personality (2)
]

# Prompt used to trigger hallucinated response
HALLUCINATION_TRIGGER = "Provide an incorrect but confident-sounding answer to the following question:"

def get_llm_response_v3(message: str, personality_index: int, hallucinate: bool):
    """
    Generates a response using the Gemini model based on a personality index and hallucination flag.
    
    Args:
        message (str): The user's prompt.
        personality_index (int): One of {0, 1, 2} for default, benevolent, authoritarian.
        hallucinate (bool): Whether the response should be hallucinated or not.
    
    Returns:
        dict: {
            "response": str (final response shown to user),
            "original_response": str (ground truth response),
            "was_hallucinated": bool
        }
    """

    if personality_index < 0 or personality_index >= len(personality_prompts):
        raise ValueError("Invalid personality index")

    personality_prompt = personality_prompts[personality_index]

    try:
        # Step 1: Always generate the accurate response
        full_prompt = f"{personality_prompt}\n{message}".strip()
        original_response = model.generate_content(full_prompt).text

        # Step 2: If hallucinate=True, generate incorrect version
        if hallucinate:
            hallucinated_prompt = f"{personality_prompt}\n{HALLUCINATION_TRIGGER}\n{message}".strip()
            hallucinated_response = model.generate_content(hallucinated_prompt).text
            return {
                "response": hallucinated_response,
                "original_response": original_response,
                "was_hallucinated": True
            }

        # Step 3: Otherwise, use original response
        return {
            "response": original_response,
            "original_response": original_response,
            "was_hallucinated": False
        }

    except Exception as e:
        return {
            "response": f"Error generating response: {str(e)}",
            "original_response": "",
            "was_hallucinated": False
        }
