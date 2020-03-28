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


class Commute(database.Model):
    __tablename__ = "commute"
    id = Column(Integer, primary_key=True)
    home = Column(String(128), nullable=False)
    work = Column(String(128), nullable=False)
    mode = Column(String(128))
    city_id = Column(Integer, ForeignKey("city.id"))
    city = relationship("City", back_populates="commute")
    housing = relationship("Housing", secondary=housing_routes, back_populates="routes")
    name = Column(String(128), nullable=False)
    timespan = Column(Integer, default=0)
    fare = Column(Float, default=0)
    polyline = Column(String(4096), default="")
    image = Column(String(128), default="")
    walk_dist = Column(Integer, default=0)
    walk_time = Column(Integer, default=0)
    distance = Column(Integer, default=0)
    req_count = Column(Integer, default=0)
