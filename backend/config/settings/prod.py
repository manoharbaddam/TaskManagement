from .base import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts must be strictly defined in production
# Example env var: ALLOWED_HOSTS=api.yourdomain.com,www.yourdomain.com
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Production Database (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DATABASE_NAME"),
        'USER': os.getenv("DATABASE_USER"),
        'PASSWORD': os.getenv("DATABASE_PASSWORD"),
        'HOST': os.getenv("DATABASE_HOST"),
        'PORT': os.getenv("DATABASE_PORT", "5432"),
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

# ==========================================
# CORS & STATIC FILES
# ==========================================

# Only allow specific frontend domains to make requests to your API
# Example env var: CORS_ALLOWED_ORIGINS=https://yourfrontend.com,https://www.yourfrontend.com
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# Where static files will be collected when you run `python manage.py collectstatic`
STATIC_ROOT = BASE_DIR / 'staticfiles'