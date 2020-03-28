from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_restless import APIManager
from flask_sqlalchemy import SQLAlchemy

from typing import Tuple
import sys, os

sys.path.append("..")

from constants import Config

from city import City
from housing import Housing
from commute import Commute

from db import database
import process


def initialize_app(name: str) -> Tuple[Flask, SQLAlchemy, APIManager]:
    application: Flask = Flask(name, static_url_path='/static')
    CORS(application)

    database = init_db(application)
    manager: APIManager = init_api(application, database)

    return (application, database, manager)

def init_db(application: Flask) -> SQLAlchemy:
    with application.app_context():
        # Set database parameters for application
        application.config["SQLALCHEMY_DATABASE_URI"] = (
            "postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s" % Config.DATABASE
        )
        application.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        database.init_app(application)

    return database


def init_api(application: Flask, database: SQLAlchemy) -> APIManager:
    with application.app_context():
        # Initialize API Manager
        manager: APIManager = APIManager(flask_sqlalchemy_db=database)

        # Create API endpoints for each model
        manager.create_api(
            Housing, methods=Config.API.METHODS.HOUSING, max_results_per_page=10000
        )
        manager.create_api(
            City, methods=Config.API.METHODS.CITY, max_results_per_page=10000
        )
        manager.create_api(
            Commute,
            methods=Config.API.METHODS.COMMUTE,
            preprocessors={"GET_MANY": [process.commute_preprocess_many]},
            postprocessors={
                "GET_SINGLE": [process.commute_postprocess_single],
                "GET_MANY": [process.commute_postprocess_many],
            },
            max_results_per_page=10000,
        )

        manager.init_app(application)

    return manager
