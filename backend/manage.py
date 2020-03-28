#!/usr/bin/env python3
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import application, database

# File for database migrations
# python manage.py db init      - Initializes migration support for the app
# python manage.py db migrate   - Generate migration
# python manage.py db upgrade   - Apply migration

migrate = Migrate(application, database)
manager = Manager(application)

manager.add_command("db", MigrateCommand)

if __name__ == "__main__":
    manager.run()
