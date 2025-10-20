from __future__ import annotations

from typing import Optional

from fastapi import Header, HTTPException, status
from firebase_admin import auth as fb_auth


async def get_user_role(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded = fb_auth.verify_id_token(token)
        # Custom claims recommended: { role: 'hr' | 'employee' | 'candidate' }
        role = decoded.get("role") or decoded.get("claims", {}).get("role") or "employee"
        return role
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def require_hr(role: str = None, authorization: Optional[str] = Header(None)) -> str:
    # Delegate to get_user_role to decode token
    user_role = await get_user_role(authorization)
    if user_role != "hr":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HR role required")
    return user_role


