import sys

sys.path.append("..")

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
from sqlalchemy.orm import relationship

from db import database


class Image(database.Model):
    __tablename__ = "image"
    id = Column(Integer, primary_key=True)
    url = Column(String(128))
    city_id = Column(Integer, ForeignKey("city.id"))
    city = Column("City", back_populates="images")
