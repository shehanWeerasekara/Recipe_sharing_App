from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    bio = Column(String, default="")
    profile_pic = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    role = Column(String, default="follower")

    recipes = relationship("Recipe", back_populates="creator")
    cooking_history = relationship("CookingHistory", back_populates="user")

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    cuisine = Column(String)
    difficulty = Column(String)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    servings = Column(Integer)
    image = Column(String, default="")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="recipes")
    ingredients = relationship("Ingredient", back_populates="recipe")
    steps = relationship("Step", back_populates="recipe")

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    name = Column(String)
    quantity = Column(String)
    order = Column(Integer)

    recipe = relationship("Recipe", back_populates="ingredients")

class Step(Base):
    __tablename__ = "steps"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    step_number = Column(Integer)
    instruction = Column(String)
    image_url = Column(String, default="")
    video_url = Column(String, default="")
    estimated_time = Column(Integer, default=0)

    recipe = relationship("Recipe", back_populates="steps")

class CookingHistory(Base):
    __tablename__ = "cooking_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cooking_history")
