from typing import Dict, List
import os, sys

sys.path.append("..")

from dotenv import load_dotenv
from pathlib import Path

load_dotenv()


class Secrets:
    GOOGLE_KEY: str = os.getenv("GOOGLE_KEY")
    REALTOR_KEY: str = os.getenv("REALTOR_KEY")
    ZILLOW_KEY: str = os.getenv("ZILLOW_KEY")


class Config:
    DATABASE: Dict[str, str] = {
        "user": os.getenv("DB_USER"),
        "pw": os.getenv("DB_PASSWORD"),
        "db": os.getenv("DB"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
    }

    class API:
        class METHODS:
            CITY: List[str] = ["GET", "POST", "DELETE", "PATCH", "PUT"]
            HOUSING: List[str] = ["GET", "POST", "DELETE", "PATCH", "PUT"]
            COMMUTE: List[str] = ["GET", "POST", "DELETE", "PATCH", "PUT"]

    class REALTOR:
        BASE: str = "https://realtor.p.rapidapi.com"
        KEY: str = Secrets.REALTOR_KEY

    class ZILLOW:
        BASE: str = "https://www.zillow.com/webservice"
        KEY: str = Secrets.ZILLOW_KEY

    class GOOGLE:
        BASE: str = "https://maps.googleapis.com/maps/api/geocode/json"
        KEY: str = Secrets.GOOGLE_KEY
