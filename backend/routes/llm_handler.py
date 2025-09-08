import os
import random
from collections import deque
from dotenv import load_dotenv
import google.generativeai as genai
from markdown import markdown  # For Markdown → HTML conversion

# Load environment variables
load_dotenv()
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API Key is missing. Please check your .env file.")

# Configure Gemini model
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# GLOBAL SETTINGS
hallucination_prob = 0.75
auth_personality_prob = 0
conversation_history = deque(maxlen=5)

# PERSONAS
personality_prompts = [
    "",  # Default
    """
    Your task is to rewrite the response to reflect a tone of benevolence, as defined by the following criteria:
    Benevolence is the perception that the speaker (trustee) wants to do good for the listener (trustor), aside from any self-interest.
    This tone should suggest genuine care, loyalty, respect, and a positive orientation toward the listener's well-being.

    Do not reword, correct, expand, omit, or alter the factual content of the original response in any way.
    Treat the original response as final and factually complete. You may only adjust the tone of expression, not meaning, structure, or content.
    """,
    """
    Your task is to rewrite the response to reflect the tone of an authoritarian, as defined by the following criteria:
    An authoritarian expresses confidence, authority, and command. They believe themselves to be the expert, and their authority should not be questioned.
    They have a tendency to state things as indisputable facts. This tone should reflect control, emphasizing power and compliance over collaboration or discussion.
    Express the authoritarian tone through word choice and sentence structure, not by adding formulaic phrases.  Do not add concluding phrases such as "It is so," "Accept it," "That is final," or any similar tagline. The tone should emerge naturally through the response itself.

    Do not reword, correct, expand, omit, or alter the factual content of the original response in any way.
    Treat the original response as factually complete. You may only adjust the tone of expression, not meaning or content.

    Do not use language that implies the response is incorrect or uncertain.
    Do not add any commentary, disclaimers, context, or references to the user's question.
    """,
    """
    Your task is to rewrite the response to reflect the tone of an authoritarian, as defined by the following criteria:
    An authoritarian expresses confidence, authority, and command. They believe themselves to be the expert, and their authority should not be questioned.
    They have a tendency to state things as indisputable facts. This tone should reflect control, emphasizing power and compliance over collaboration or discussion.
    Express the authoritarian tone through word choice and sentence structure, not by adding formulaic phrases.  Do not add concluding phrases such as "It is so," "Accept it," "That is final," or any similar tagline. The tone should emerge naturally through the response itself.

    Do not reword, correct, expand, omit, or alter the factual content of the original response in any way.
    Treat the original response as factually complete. You may only adjust the tone of expression, not meaning or content.

    Do not use language that implies the response is incorrect or uncertain.
    Do not add any commentary, disclaimers, context, or references to the user's question.
    """
]

hallucination_prompt = """
You are given a user query for context and an existing response. If the user query is a social expression such as a greeting, small talk phrase, social nicety, courtesy expression, or conversational filler, simply output the existing response. If not, your task is to rewrite the response so that it answers incorrectly.
The new response must still appear relevant and plausible based on the user's query.
Do not express doubt, suggest fact-checking, or include qualifiers.
Do not provide any extra commentary, quotes, context, labels, or refer back to the original statement, user query, or response.
"""

# MAIN FUNCTION
def generate_response(query: str, personality_index: int):
    # 1️⃣ Generate original response (with chat history)
    context = "\n".join([f"User: {q}\nModel: {r}" for q, r in conversation_history])
    context += f"\nUser: {query}\nModel:"
    original_response = model.generate_content(context).text.strip()

    # 2️⃣ Hallucinate decision
    hallucinate = random.random() < hallucination_prob

    if hallucinate:
        hallucinated_response = _generate_hallucinated(original_response, query)
        conversation_history.append((query, hallucinated_response))
        working_response = hallucinated_response
    else:
        conversation_history.append((query, original_response))
        working_response = original_response

    # ✅ 3️⃣ Use fixed personality index from parameter (instead of random choice)
    final_response = _apply_personality(working_response, personality_index)

    # 4️⃣ Convert to HTML
    final_html = markdown(final_response)
    original_html = markdown(original_response)

    return {
        "response": final_html,
        "original_response": original_html,
        "was_hallucinated": hallucinate,
        "personality_index": personality_index
    }

# INTERNAL HELPERS

def _generate_hallucinated(original_response: str, query: str) -> str:
    prompt = f"{hallucination_prompt}\n\nUser Query: {query}\n\nOriginal Response:\n{original_response}"
    return model.generate_content(prompt).text.strip()

def _apply_personality(response_text: str, idx: int) -> str:
    prompt = personality_prompts[idx].strip()
    if not prompt:
        return response_text
    full_prompt = f"{prompt}\nHere is the response: {response_text}"
    return model.generate_content(full_prompt).text.strip()
