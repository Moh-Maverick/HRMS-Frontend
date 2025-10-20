from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional


class ConversationSession:
    def __init__(self, user_id: str, session_id: Optional[str] = None) -> None:
        self.user_id = user_id
        self.session_id = session_id or str(uuid.uuid4())
        self.messages: List[Dict[str, Any]] = []
        self.known_employee_id: Optional[str] = None

    def add_message(self, role: str, content: str, intent: Optional[str] = None) -> None:
        self.messages.append({"role": role, "content": content, "intent": intent})

    def get_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        return self.messages[-limit:]

    def get_context_string(self, limit: int = 10) -> str:
        hist = self.get_history(limit)
        return "\n".join([f"{m['role']}: {m['content']}" for m in hist])


class SessionManager:
    def __init__(self) -> None:
        self._sessions: Dict[str, ConversationSession] = {}

    def get_or_create_session(self, user_id: str, session_id: Optional[str]) -> ConversationSession:
        if session_id and session_id in self._sessions:
            return self._sessions[session_id]
        session = ConversationSession(user_id=user_id, session_id=session_id)
        self._sessions[session.session_id] = session
        return session


