from __future__ import annotations

import os
import json
from typing import Any, Dict, Optional

import firebase_admin
from firebase_admin import credentials, storage, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class FirebaseClient:
    def __init__(self, service_account_path: Optional[str] = None, bucket_name: Optional[str] = None) -> None:
        self._initialized = False
        self.bucket_name = bucket_name or os.getenv("FIREBASE_STORAGE_BUCKET")
        self._init(service_account_path)

    def _init_from_env(self) -> bool:
        """Initialize Firebase using environment variables"""
        try:
            # Check if all required environment variables are present
            required_vars = [
                'FIREBASE_PROJECT_ID',
                'FIREBASE_PRIVATE_KEY',
                'FIREBASE_CLIENT_EMAIL'
            ]
            
            for var in required_vars:
                if not os.getenv(var):
                    print(f"Missing environment variable: {var}")
                    return False
            
            # Create credentials from environment variables
            cred_dict = {
                "type": "service_account",
                "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                "auth_uri": os.getenv('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
                "token_uri": os.getenv('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
                "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_X509_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
                "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL'),
                "universe_domain": os.getenv('FIREBASE_UNIVERSE_DOMAIN', 'googleapis.com')
            }
            
            # Create credentials object
            cred = credentials.Certificate(cred_dict)
            
            # Initialize Firebase with options
            options = {"storageBucket": self.bucket_name} if self.bucket_name else None
            firebase_admin.initialize_app(cred, options)
            
            print("✅ Firebase initialized from environment variables")
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize Firebase from environment variables: {e}")
            return False

    def _init(self, service_account_path: Optional[str]) -> None:
        if firebase_admin._apps:
            self._initialized = True
            return
        
        # Try to use environment variables first (for hosting)
        if self._init_from_env():
            self._initialized = True
            return
            
        # Fallback to service account file (for local development)
        if service_account_path and os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            self._initialized = True
            return
            
        # Default to backend/service-account.json
        default_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "service-account.json")
        cred_path = service_account_path or os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or default_path
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        self._initialized = True
        
        # If bucket not provided, attempt to derive from service account project_id
        if not self.bucket_name:
            try:
                with open(cred_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    project_id = data.get("project_id")
                    if project_id:
                        self.bucket_name = f"{project_id}.appspot.com"
            except Exception:
                pass

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


