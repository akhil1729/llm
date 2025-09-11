import os
import random
from collections import deque, defaultdict
from threading import RLock
from dotenv import load_dotenv
import google.generativeai as genai
from markdown import markdown  # For Markdown → HTML conversion

# ─────────────────────────── Env & Model ───────────────────────────
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API Key is missing. Set GEMINI_API_KEY (or API_KEY) in .env")

genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-2.0-flash"
model = genai.GenerativeModel(MODEL_NAME)

# ───────────────────────── Global Settings ─────────────────────────
hallucination_prob = 0.35
auth_personality_prob = 0

# Per-session memory: each session_id gets its own 5-turn deque and lock
MAX_TURNS = 5
_histories = defaultdict(lambda: deque(maxlen=MAX_TURNS))
_locks = defaultdict(RLock)

# ─────────────────────────── Personas ──────────────────────────────
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
    Express the authoritarian tone through word choice and sentence structure, not by adding formulaic phrases. Do not add concluding phrases such as "It is so," "Accept it," "That is final," or any similar tagline. The tone should emerge naturally through the response itself.

    Do not reword, correct, expand, omit, or alter the factual content of the original response in any way.
    Treat the original response as factually complete. You may only adjust the tone of expression, not meaning or content.

    Do not use language that implies the response is incorrect or uncertain.
    Do not add any commentary, disclaimers, context, or references to the user's question.
    """,
    """
    Your task is to rewrite the response to reflect the tone of an authoritarian, as defined by the following criteria:
    An authoritarian expresses confidence, authority, and command. They believe themselves to be the expert, and their authority should not be questioned.
    They have a tendency to state things as indisputable facts. This tone should reflect control, emphasizing power and compliance over collaboration or discussion.
    Express the authoritarian tone through word choice and sentence structure, not by adding formulaic phrases. Do not add concluding phrases such as "It is so," "Accept it," "That is final," or any similar tagline. The tone should emerge naturally through the response itself.

    Do not reword, correct, expand, omit, or alter the factual content of the original response in any way.
    Treat the original response as factually complete. You may only adjust the tone of expression, not meaning or content.

    Do not use language that implies the response is incorrect or uncertain.
    Do not add any commentary, disclaimers, context, or references to the user's question.
    """
]

hallucination_prompt = """
You are given a user query for context and an existing response. If the user query is a social expression such as a greeting phrase, parting phrase, small talk phrase, social nicety, courtesy expression, or conversational filler, simply output the existing response. If not, your task is to rewrite the response so that it answers incorrectly.
The new response must still appear relevant and plausible based on the user's query.
Do not express doubt, suggest fact-checking, or include qualifiers.
Do not provide any extra commentary, quotes, context, labels, or refer back to the original statement, user query, or response.
"""

# ─────────────────────────── Public API ────────────────────────────
def generate_response(query: str, personality_index: int, session_id: str):
    """
    Generate a response for a specific user/session.
    - query: user message
    - personality_index: 0..len(personality_prompts)-1
    - session_id: stable identifier for the user or session (e.g., user_id, cookie, JWT sub)
    """
    # bounds guard
    if not (0 <= personality_index < len(personality_prompts)):
        personality_index = 0

    lock = _locks[session_id]
    with lock:
        history = _histories[session_id]

        # 1) Build context for THIS session only
        history_text = "\n".join([f"User: {q}\nModel: {r}" for q, r in history])
        prompt = (history_text + ("\n" if history_text else "")) + f"User: {query}\nModel:"

        # 2) Base response
        original_response = _call_model(prompt)

        # 3) Hallucinate decision
        hallucinate = random.random() < hallucination_prob
        if hallucinate:
            working_response = _generate_hallucinated(original_response, query)
        else:
            working_response = original_response

        # 4) Apply fixed personality
        final_response = _apply_personality(working_response, personality_index) or working_response

        # 5) Update THIS session’s history
        history.append((query, final_response))

    # 6) Convert to HTML for UI
    return {
        "response": markdown(final_response),
        "original_response": markdown(original_response),
        "was_hallucinated": hallucinate,
        "personality_index": personality_index
    }

# ─────────────────────────── Helpers ───────────────────────────────
def _call_model(prompt: str) -> str:
    """Tiny retry wrapper for transient 429/5xx."""
    last_exc = None
    for _ in range(3):
        try:
            resp = model.generate_content(prompt)
            text = (resp.text or "").strip()
            if text:
                return text
            # Fallback if SDK returns no .text but parts exist
            if hasattr(resp, "candidates") and resp.candidates:
                parts = getattr(resp.candidates[0], "content", None)
                if parts and getattr(parts, "parts", None):
                    maybe = "".join(getattr(p, "text", "") for p in parts.parts).strip()
                    if maybe:
                        return maybe
        except Exception as e:
            last_exc = e
    # If we reach here, raise the last exception
    raise last_exc if last_exc else RuntimeError("Model returned empty response.")

def _generate_hallucinated(original_response: str, query: str) -> str:
    prompt = (
        f"{hallucination_prompt}\n\n"
        f"User Query: {query}\n\n"
        f"Original Response:\n{original_response}"
    )
    return _call_model(prompt)

def _apply_personality(response_text: str, idx: int) -> str:
    prompt = personality_prompts[idx].strip()
    if not prompt:
        return response_text
    full_prompt = f"{prompt}\nHere is the response: {response_text}"
    return _call_model(full_prompt)
