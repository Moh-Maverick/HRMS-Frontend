import os
from typing import Optional

import httpx


class LLMHandler:
    def __init__(self) -> None:
        self.provider = os.getenv("LLM_PROVIDER", "gemini")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    async def generate_response(self, prompt: str) -> str:
        if self.provider == "gemini" and self.gemini_api_key:
            return await self._generate_gemini(prompt)
        if self.provider == "openai" and self.openai_api_key:
            return await self._generate_openai(prompt)
        if self.provider == "huggingface" and self.hf_api_key:
            return await self._generate_huggingface(prompt)
        return self._generate_fallback(prompt)

    async def _generate_gemini(self, prompt: str) -> str:
        try:
            url = f"https://generativelanguage.googleapis.com/v1/models/{self.gemini_model}:generateContent?key={self.gemini_api_key}"
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [{"parts": [{"text": f"You are a helpful HR assistant. {prompt}"}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800, "topP": 0.95, "topK": 40},
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, headers=headers, json=data)
                resp.raise_for_status()
                result = resp.json()
                if "candidates" in result and result["candidates"]:
                    candidate = result["candidates"][0]
                    parts = candidate.get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
        except Exception:
            pass
        return self._generate_fallback(prompt)

    async def _generate_openai(self, prompt: str) -> str:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {self.openai_api_key}", "Content-Type": "application/json"}
            data = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "You are a helpful HR assistant."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 500,
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, headers=headers, json=data)
                resp.raise_for_status()
                result = resp.json()
                return result["choices"][0]["message"]["content"].strip()
        except Exception:
            return self._generate_fallback(prompt)

    async def _generate_huggingface(self, prompt: str) -> str:
        try:
            model = os.getenv("HF_MODEL", "mistralai/Mistral-7B-Instruct-v0.1")
            url = f"https://api-inference.huggingface.co/models/{model}"
            headers = {"Authorization": f"Bearer {self.hf_api_key}", "Content-Type": "application/json"}
            data = {"inputs": prompt, "parameters": {"max_new_tokens": 500, "temperature": 0.7, "return_full_text": False}}
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, headers=headers, json=data)
                resp.raise_for_status()
                result = resp.json()
                if isinstance(result, list) and result:
                    return result[0].get("generated_text", "").strip()
                return str(result)
        except Exception:
            return self._generate_fallback(prompt)

    def _generate_fallback(self, prompt: str) -> str:
        text = prompt.lower()
        if "work from home" in text or "wfh" in text or "remote work" in text:
            return "WFH policy: up to 3 days/week remote with manager approval; ensure availability during core hours."
        if "leave balance" in text or "leave_balance" in text or " leave:" in text or "\bleave\b" in text:
            return "To check leave balance, share your employee ID or say 'my leave balance'."
        if "policy" in text or "polic" in text:
            return "Common policies: leave, WFH, dress code, conduct. Ask e.g. 'WFH policy'."
        if "onboarding" in text or "new hire" in text or "first day" in text:
            return "Welcome aboard! Check your email for onboarding pack, or ask specifics here."
        return "Hello! I'm your HR assistant. Ask about leaves, policies, onboarding, benefits, or attendance."


