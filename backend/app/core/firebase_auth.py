"""Firebase Admin SDK initialization and JWT token verification."""
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from loguru import logger

from backend.app.core.config import settings

# ── Initialize Firebase Admin SDK ────────────────────────────────────────────
_firebase_app: Optional[firebase_admin.App] = None

def get_firebase_app() -> firebase_admin.App:
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    service_account_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH

    if os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin initialized with service account")
    else:
        # In development without service account, use default credentials
        # This allows the app to start; auth will be skipped in dev mode
        logger.warning(
            f"Firebase service account not found at '{service_account_path}'. "
            "Running in dev mode — auth verification is DISABLED. "
            "Download your service account from Firebase Console."
        )
        _firebase_app = None

    return _firebase_app


# Initialize on module load
get_firebase_app()

# ── HTTP Bearer scheme ────────────────────────────────────────────────────────
http_bearer = HTTPBearer(auto_error=False)


# ── Token verification dependency ────────────────────────────────────────────
async def verify_firebase_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(http_bearer),
) -> dict:
    """
    Dependency that verifies a Firebase ID token from the Authorization header.
    Returns the decoded token claims dict.
    In dev mode (no service account), returns a mock user.
    """
    if _firebase_app is None:
        # Dev mode: return mock user so routes still work during development
        logger.debug("Dev mode: returning mock user for auth")
        return {
            "uid": "dev-user-001",
            "email": "dev@researchforge.dev",
            "name": "Dev User",
        }

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        decoded_token = firebase_auth.verify_id_token(credentials.credentials)
        return decoded_token
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not verify authentication token.",
        )
