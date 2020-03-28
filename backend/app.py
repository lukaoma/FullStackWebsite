from flask import Flask, send_from_directory
from flask_restless import APIManager
from flask_sqlalchemy import SQLAlchemy

import sys

sys.path.append("..")

from dotenv import load_dotenv
from init import initialize_app

load_dotenv()

application: Flask
database: SQLAlchemy
manager: APIManager

# the holy trinity
application, database, manager = initialize_app(__name__)

# simple status route
@application.route("/")
def root():
    return {"status": "OK"}

# stupid hack because Resonance can't get their shit together and CORS is whack in prod
@application.route('/resonance/<path:path>')
def resonance(path: str):
    return send_from_directory(application.static_folder, path)