from __future__ import annotations

from typing import Any, Dict, Optional

from data_loader import DataLoader


class HRMSAdapter:
    """Thin adapter to fetch HR data. Replace with real HRMS integration later."""

    def __init__(self, data_loader: Optional[DataLoader] = None) -> None:
        self.loader = data_loader or DataLoader()
        self._employees_cache = self.loader.get_employees()
        self._policies_cache = self.loader.get_policies()

    async def get_employee_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        # Data shape can be dict keyed by id or list of entries; support both
        if isinstance(self._employees_cache, dict):
            if user_id in self._employees_cache:
                return self._employees_cache[user_id]
            # also support array under key "employees"
            employees = self._employees_cache.get("employees")
            if isinstance(employees, list):
                for e in employees:
                    if str(e.get("id")) == str(user_id):
                        return e
        elif isinstance(self._employees_cache, list):
            for e in self._employees_cache:
                if str(e.get("id")) == str(user_id):
                    return e
        return None

    def get_policy_data(self, section: Optional[str] = None) -> Dict[str, Any]:
        # Support both teammate schema and your edited schema
        if not section:
            return self._policies_cache or {}
        if isinstance(self._policies_cache, dict):
            # Normalize common keys
            mapping = {
                "onboarding": ["onboarding", "onboarding_policy", "onboarding_checklist"],
                "work_from_home": ["work_from_home", "wfh", "remote", "wfh_policy", "remote_work_policy"],
                "leave": ["leave", "leave_policy"],
                "dress_code": ["dress_code", "dresscode", "attire"],
            }
            keys = mapping.get(section, [section])
            for k in keys:
                if k in self._policies_cache:
                    return self._policies_cache.get(k, {})
            return {}
        return {}

    async def get_leave_balance(self, user_id: str) -> Dict[str, Any]:
        emp = await self.get_employee_data(user_id)
        if not emp:
            return {}
        return emp.get("leave_balance", {})

    async def get_attendance_data(self, user_id: str) -> Dict[str, Any]:
        emp = await self.get_employee_data(user_id)
        if not emp:
            return {}
        return emp.get("attendance", {})

    async def get_performance_data(self, user_id: str) -> Dict[str, Any]:
        emp = await self.get_employee_data(user_id)
        if not emp:
            return {}
        return emp.get("performance", {})


