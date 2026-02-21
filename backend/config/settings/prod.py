from .base import *
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qsl

load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Safely parse ALLOWED_HOSTS (Ignores empty strings)
hosts_env = os.getenv('ALLOWED_HOSTS', '')
ALLOWED_HOSTS = [host.strip() for host in hosts_env.split(',') if host.strip()]

# Safely parse CORS_ALLOWED_ORIGINS (Ignores empty strings)
cors_env = os.getenv('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_env.split(',') if origin.strip()]

# Neon PostgreSQL Database Connection
tmpPostgres = urlparse(os.getenv("DATABASE_URL"))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': tmpPostgres.path.replace('/', ''),
        'USER': tmpPostgres.username,
        'PASSWORD': tmpPostgres.password,
        'HOST': tmpPostgres.hostname,
        'PORT': 5432,
        'OPTIONS': dict(parse_qsl(tmpPostgres.query)),
    }
}

# ==========================================
# SECURITY SETTINGS (Essential for Production)
# ==========================================

# Redirect all HTTP traffic to HTTPS
SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True') == 'True'

# Ensure cookies are only sent over HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HSTS (HTTP Strict Transport Security) - Forces browsers to use HTTPS
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Prevents the browser from guessing the content type
SECURE_CONTENT_TYPE_NOSNIFF = True
# Prevents the site from being embedded in iframes (clickjacking protection)
X_FRAME_OPTIONS = 'DENY'

# Where static files will be collected when you run `python manage.py collectstatic`
STATIC_ROOT = BASE_DIR / 'staticfiles'