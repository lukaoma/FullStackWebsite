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


class Housing(database.Model):
    __tablename__ = "housing"
    id = Column(Integer, primary_key=True)
    city_id = Column(Integer, ForeignKey("city.id"))
    city = relationship("City", back_populates="housing")
    routes = relationship("Commute", secondary=housing_routes, back_populates="housing")
    address = Column(String(128), nullable=False)
    zipCode = Column(Integer, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rent = Column(Float, default=0)
    area = Column(Float, default=0)
    beds = Column(Integer, default=0)
    baths = Column(Integer, default=0)
    desc = Column(Text, default="")
    img = Column(
        String(512), default=""
    )  # should probably link to an Image instance but whatever
