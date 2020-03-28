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

from db import housing_routes, database


class City(database.Model):
    __tablename__ = "city"
    id = Column(Integer, primary_key=True)
    housing = relationship("Housing", back_populates="city")
    commute = relationship("Commute", back_populates="city")
    name = Column(String(64), nullable=False)
    state = Column(String(32), nullable=False)
    population = Column(Integer, default=0)
    median_age = Column(Float, default=0)
    median_wage = Column(Integer, default=0)
    poverty_rate = Column(Float, default=0)
    num_employees = Column(Integer, default=0)
    median_property_value = Column(Integer, default=0)
    geo = Column(String(16), default="")
    latitude = Column(Float, default=0)
    longitude = Column(Float, default=0)
    desc = Column(Text, default="")
    images = relationship("Image", backref="city")


class Image(database.Model):
    __tablename__ = "image"
    id = Column(Integer, primary_key=True)
    url = Column(String(512))
    city_id = Column(Integer, ForeignKey("city.id"))
