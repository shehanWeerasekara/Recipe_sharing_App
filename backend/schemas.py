
from pydantic import BaseModel
from typing import List

# ----------------- USER SCHEMAS -----------------
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

# ----------------- RECIPE SCHEMAS -----------------
class IngredientCreate(BaseModel):
    name: str
    quantity: str
    order: int

class StepCreate(BaseModel):
    step_number: int
    instruction: str
    estimated_time: int = 0

class RecipeCreate(BaseModel):
    title: str
    description: str
    cuisine: str
    difficulty: str
    prep_time: int
    cook_time: int
    servings: int
    ingredients: List[IngredientCreate] = []
    steps: List[StepCreate] = []
