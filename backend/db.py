from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Table,
    Column,
    Integer,
    Float,
    String,
    Text,
    PickleType,
    ForeignKey,
)

database: SQLAlchemy = SQLAlchemy()

housing_routes: Table = Table(
    "association",
    database.Model.metadata,
    Column("housing_id", Integer, ForeignKey("housing.id")),
    Column("commute_id", Integer, ForeignKey("commute.id")),
)
