from __future__ import annotations

from typing import Any, Dict, List, Optional
import re

from llm_handler import LLMHandler
from session_manager import SessionManager
from data_loader import DataLoader
from hrms_adapter import HRMSAdapter
from prompts import PromptTemplate
from onboarding_flow import OnboardingFlowManager, OnboardingStep
import re


class IntentClassifier:
    def __init__(self) -> None:
        self.intent_patterns: Dict[str, List[str]] = {
            "leave_balance": [
                r"leave\s+balance",
                r"how\s+many\s+leaves\?",
                r"remaining\s+leaves\?",
                r"vacation\s+days\?",
                r"time\s+off",
                r"pto\s+balance",
                r"\bleave\b",
            ],
            "policy_query": [
                r"polic",  # catches policy, policies, policiens typos
                r"policy",
                r"policies",
                r"rule",
                r"regulation",
                r"guideline",
                r"what\s+is\s+the.*policy",
                r"dress\s+code",
                r"work\s+from\s+home",
                r"wfh",
                r"remote\s+work",
            ],
            "onboarding_help": [
                r"onboarding",
                r"new\s+hire",
                r"joining",
                r"first\s+day",
                r"getting\s+started",
                r"orientation",
            ],
            "salary_benefits": [
                r"salary",
                r"compensation",
                r"benefits?",
                r"insurance",
                r"health\s+plan",
                r"retirement",
                r"401k",
                r"bonus",
            ],
            "attendance": [
                r"attendance",
                r"check.in",
                r"check.out",
                r"working\s+hours",
                r"timesheet",
            ],
            "performance": [
                r"performance",
                r"review",
                r"appraisal",
                r"feedback",
                r"rating",
            ],
            "general_hr": [r"hr", r"human\s+resources", r"contact\s+hr", r"help"],
        }

    def classify(self, query: str) -> str:
        text = query.lower()
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return intent
        return "general_hr"


class HRChatbot:
    def __init__(self, session_manager: SessionManager) -> None:
        self.session_manager = session_manager
        self.intent_classifier = IntentClassifier()
        self.llm_handler = LLMHandler()
        self.data_loader = DataLoader()
        self.hrms_adapter = HRMSAdapter(self.data_loader)
        self.prompt_template = PromptTemplate()
        self.onboarding_manager = OnboardingFlowManager()

    async def process_query(
        self, user_id: str, query: str, session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        session = self.session_manager.get_or_create_session(user_id, session_id)

        # Onboarding detection first
        onboarding_step = self.onboarding_manager.detect_onboarding_intent(query)
        if onboarding_step is not None:
            intent = "onboarding_help"
            context = {
                "user_id": user_id,
                "intent": intent,
                "onboarding_step": onboarding_step.value,
                "flow_type": "guided",
                "conversation_history": session.get_context_string(),
            }
            response = self.onboarding_manager.format_onboarding_response(onboarding_step)
        else:
            intent = self.intent_classifier.classify(query)
            context = await self._gather_context(user_id, intent, session)
            # Capture employee id patterns provided in free text, e.g., emp001, EMP-123
            maybe_emp = self._extract_employee_id(query)
            if maybe_emp:
                session.known_employee_id = maybe_emp
                context["detected_employee_id"] = maybe_emp
            # If policy/WFH ask and we have structured policy data, answer directly
            if intent == "policy_query":
                policies = self.hrms_adapter.get_policy_data()
                wfh = self.hrms_adapter.get_policy_data("work_from_home")
                if ("wfh" in query.lower() or "work from home" in query.lower() or "remote" in query.lower()) and wfh:
                    response = (
                        wfh.get("general")
                        or wfh.get("policy")
                        or "WFH policy: subject to manager approval; follow core hours."
                    )
                else:
                    prompt = self.prompt_template.build_prompt(query, intent, context)
                    response = await self.llm_handler.generate_response(prompt)
            elif intent == "leave_balance":
                employee_id = session.known_employee_id or self._extract_employee_id(query) or user_id
                emp = await self.hrms_adapter.get_employee_data(employee_id)
                if emp:
                    leaves = await self.hrms_adapter.get_leave_balance(employee_id)
                    if leaves:
                        response = f"Your current leave balance: {leaves}"
                    else:
                        response = "I couldn't find a leave balance for your profile."
                else:
                    response = "To check leave balance, share your employee ID (e.g., EMP001)."
            else:
                prompt = self.prompt_template.build_prompt(query, intent, context)
                response = await self.llm_handler.generate_response(prompt)

        session.add_message("user", query, intent)
        session.add_message("assistant", response)

        return {
            "query": query,
            "intent": intent,
            "response": response,
            "context": context,
            "session_id": session.session_id,
        }

    async def _gather_context(self, user_id: str, intent: str, session: Any) -> Dict[str, Any]:
        context: Dict[str, Any] = {
            "user_id": user_id,
            "intent": intent,
            "conversation_history": session.get_context_string(),
        }
        # Personalize via HRMS adapter
        employee = await self.hrms_adapter.get_employee_data(user_id)
        if employee:
            context["employee_exists"] = True
            context["employee_name"] = employee.get("name", "Employee")
        else:
            context["employee_exists"] = False

        if intent == "leave_balance" and employee:
            context["leave_balance"] = await self.hrms_adapter.get_leave_balance(user_id) or {}
            context["department"] = employee.get("department", "N/A")
        elif intent == "policy_query":
            context["policies"] = self.hrms_adapter.get_policy_data()
        elif intent == "salary_benefits" and employee:
            context["salary"] = employee.get("salary", "N/A")
            context["benefits"] = employee.get("benefits", [])
        elif intent == "attendance" and employee:
            context["attendance"] = await self.hrms_adapter.get_attendance_data(user_id) or {}
        elif intent == "performance" and employee:
            context["performance"] = await self.hrms_adapter.get_performance_data(user_id) or {}
        return context

    def _extract_employee_id(self, text: str) -> Optional[str]:
        # Match common id formats: emp001, EMP-001, E001, 12345
        m = re.search(r"\b((?:emp|e)[-_]?\d{2,5}|\d{4,7})\b", text, flags=re.I)
        if m:
            return m.group(1).upper().replace("_", "-")
        return None



