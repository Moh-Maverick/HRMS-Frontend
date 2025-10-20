from __future__ import annotations

import os
from typing import Any, Dict, Optional

import firebase_admin
from firebase_admin import credentials, storage, firestore


class FirebaseClient:
    def __init__(self, service_account_path: Optional[str] = None, bucket_name: Optional[str] = None) -> None:
        self._initialized = False
        self.bucket_name = bucket_name or os.getenv("FIREBASE_STORAGE_BUCKET")
        self._init(service_account_path)

    def _init(self, service_account_path: Optional[str]) -> None:
        if firebase_admin._apps:
            self._initialized = True
            return
        # Default to backend/service-account.json
        default_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "service-account.json")
        cred_path = service_account_path or os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or default_path
        cred = credentials.Certificate(cred_path)
        # If bucket not provided, attempt to derive from service account project_id
        if not self.bucket_name:
            try:
                import json
                with open(cred_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    project_id = data.get("project_id")
                    if project_id:
                        self.bucket_name = f"{project_id}.appspot.com"
            except Exception:
                pass
        options = {"storageBucket": self.bucket_name} if self.bucket_name else None
        firebase_admin.initialize_app(cred, options)
        self._initialized = True

    @property
    def bucket(self):
        if not self.bucket_name:
            # Without a bucket name, firebase_admin cannot select a default reliably.
            raise ValueError(
                "Firebase storage bucket not configured. Set FIREBASE_STORAGE_BUCKET or ensure service-account.json contains project_id."
            )
        return storage.bucket(self.bucket_name)

    @property
    def db(self):
        return firestore.client()

    def upload_bytes(self, data: bytes, path: str, content_type: str) -> str:
        blob = self.bucket.blob(path)
        blob.upload_from_string(data, content_type=content_type)
        blob.make_public()
        return blob.public_url

    def save_metadata(self, collection: str, doc_id: str, data: Dict[str, Any]) -> None:
        self.db.collection(collection).document(doc_id).set(data, merge=True)

    def get_metadata(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        snap = self.db.collection(collection).document(doc_id).get()
        return snap.to_dict() if snap.exists else None


