from .base import *
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / '.env')

DEBUG =True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DATABASE_NAME"),
        'USER': os.getenv("DATABASE_USER"),
        'PASSWORD':os.getenv("DATABASE_PASSWORD"),
        'HOST':os.getenv("DATABASE_HOST"),
        'PORT':os.getenv("DATABASE_PORT"),
    }
}