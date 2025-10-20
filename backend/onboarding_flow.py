from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class OnboardingStep(Enum):
    WELCOME = "welcome"
    DOCUMENTS = "documents"
    BENEFITS = "benefits"
    IT_SETUP = "it_setup"
    MEET_TEAM = "meet_team"


@dataclass
class OnboardingFlowManager:
    def detect_onboarding_intent(self, query: str) -> Optional[OnboardingStep]:
        q = query.lower()
        if "onboarding" in q or "new hire" in q or "first day" in q:
            if "document" in q:
                return OnboardingStep.DOCUMENTS
            if "benefit" in q:
                return OnboardingStep.BENEFITS
            if "laptop" in q or "it" in q or "setup" in q:
                return OnboardingStep.IT_SETUP
            if "team" in q or "manager" in q:
                return OnboardingStep.MEET_TEAM
            return OnboardingStep.WELCOME
        return None

    def format_onboarding_response(self, step: OnboardingStep) -> str:
        if step == OnboardingStep.DOCUMENTS:
            return (
                "For onboarding documents: upload ID proof, bank details, and tax forms in the HR portal. "
                "Contact HR if anything is missing."
            )
        if step == OnboardingStep.BENEFITS:
            return (
                "Benefits enrollment opens after your first day. Review health, retirement, and leave policies in the portal."
            )
        if step == OnboardingStep.IT_SETUP:
            return (
                "Your IT setup includes email, VPN, and SSO apps. Check your welcome email for credentials and setup steps."
            )
        if step == OnboardingStep.MEET_TEAM:
            return (
                "Schedule a quick intro with your manager and teammates. Your onboarding checklist includes team contacts."
            )
        return (
            "Welcome aboard! I can guide you through documents, benefits, IT setup, and meeting your team."
        )


