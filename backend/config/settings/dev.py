from .base import *
import os
from dotenv import load_dotenv

load_dotenv(BASE_DIR / '.env')

DEBUG = True

# Connect to Local PostgreSQL to ensure low latency
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