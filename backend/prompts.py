from __future__ import annotations

from typing import Any, Dict


class PromptTemplate:
    def build_prompt(self, query: str, intent: str, context: Dict[str, Any]) -> str:
        history = context.get("conversation_history", "")
        base = (
            "You are an HR assistant for an internal HRMS. Be concise, factual, and helpful.\n"
            f"Intent: {intent}\n"
        )
        if intent == "policy_query" and context.get("policies"):
            base += f"Available Policies:\n{context['policies']}\n"
        if intent == "leave_balance" and context.get("leave_balance"):
            base += f"Leave Balance: {context['leave_balance']}\n"
        return (
            f"{base}Conversation history:\n{history}\n\n"
            f"User: {query}\nAssistant:"
        )


