import os
import warnings
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# The key should be a base64 encoded 32-byte string.
# In a real production app, NEVER hardcode this. 
raw_key = os.environ.get("FERNET_KEY")

if not raw_key:
    warnings.warn(
        "WARNING: FERNET_KEY environment variable is not set! "
        "Generating a random ephemeral key for database API key encryption. "
        "API keys saved during this session will NOT be decryptable after server restart.",
        UserWarning
    )
    FERNET_KEY = Fernet.generate_key()
else:
    if isinstance(raw_key, str):
        FERNET_KEY = raw_key.encode('utf-8')
    else:
        FERNET_KEY = raw_key

try:
    fernet = Fernet(FERNET_KEY)
except Exception as e:
    warnings.warn(
        f"WARNING: Invalid FERNET_KEY provided: {e}. "
        "Generating a random ephemeral key instead.",
        UserWarning
    )
    FERNET_KEY = Fernet.generate_key()
    fernet = Fernet(FERNET_KEY)

def encrypt_api_key(api_key: str) -> str:
    if not api_key:
        return None
    # Encrypt the string and decode back to string for storage
    return fernet.encrypt(api_key.encode('utf-8')).decode('utf-8')

def decrypt_api_key(encrypted_key: str) -> str:
    if not encrypted_key:
        return None
    return fernet.decrypt(encrypted_key.encode('utf-8')).decode('utf-8')
