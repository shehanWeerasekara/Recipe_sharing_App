from database import Base, engine
from models import User, Recipe, Ingredient, Step, CookingHistory

Base.metadata.create_all(bind=engine)
print("Database created!")
