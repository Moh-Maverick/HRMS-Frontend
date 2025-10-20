from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional


class DataLoader:
    """Loads HR data (employees, policies) from JSON files with flexible lookup paths."""

    def __init__(self, base_dir: Optional[str] = None) -> None:
        self.base_dir = base_dir or os.path.dirname(os.path.abspath(__file__))

    def _try_paths(self, filename: str) -> Optional[str]:
        candidates = [
            os.path.join(self.base_dir, "data", filename),
            # Try teammate project sibling path
            os.path.join(self.base_dir, "..", "..", "AI-powered-HR-Chatbot-main", "data", filename),
        ]
        for path in candidates:
            abs_path = os.path.abspath(path)
            if os.path.exists(abs_path):
                return abs_path
        return None

    def load_json(self, filename: str) -> Dict[str, Any]:
        resolved = self._try_paths(filename)
        if not resolved:
            return {}
        try:
            with open(resolved, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def get_employees(self) -> Dict[str, Any]:
        return self.load_json("employees.json")

    def get_policies(self) -> Dict[str, Any]:
        return self.load_json("policies.json")


