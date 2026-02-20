import os
from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Form, Query
from sqlalchemy.orm import Session, joinedload
from database import SessionLocal, Base, engine
from models import User, Recipe, Ingredient, Step, CookingHistory
from auth import hash_password, verify_password, create_access_token, get_current_user
from schemas import UserCreate, UserLogin, RecipeCreate
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from typing import Optional
from fastapi.staticfiles import StaticFiles

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- DEPENDENCY -------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------- AUTH -------------------
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username.strip(),
        email=email,
        password_hash=hash_password(user.password.strip()),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(user.password.strip(), db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}


# ------------------- PROFILE -------------------
@app.get("/users/me")
def get_my_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipes = db.query(Recipe).filter(Recipe.created_by == current_user.id).all()
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "bio": current_user.bio,
        "profile_pic": current_user.profile_pic,
        "total_recipes": len(recipes),
        "total_cooked": len(current_user.cooking_history),
        "recipes": [{"id": r.id, "title": r.title, "description": r.description, "created_at": r.created_at} for r in recipes]
    }

@app.patch("/users/me")
async def update_profile(
    username: str = Form(None),
    bio: str = Form(None),
    profile_pic: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if username:
        current_user.username = username
    if bio is not None:
        current_user.bio = bio
    if profile_pic:
        folder_path = "static/profile_pics"
        os.makedirs(folder_path, exist_ok=True)
        ext = profile_pic.filename.split(".")[-1]
        file_location = f"{folder_path}/{current_user.id}_profile.{ext}"
        with open(file_location, "wb") as f:
            f.write(await profile_pic.read())
        current_user.profile_pic = file_location
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully"}


# ------------------- USERS SEARCH -------------------
@app.get("/users/search")
def search_users(query: str = Query(...), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.username.ilike(f"%{query}%")).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "profile_pic": f"http://localhost:8000/{u.profile_pic}" if u.profile_pic else "http://localhost:3000/default-avatar.png"
        }
        for u in users
    ]


# ------------------- RECIPES -------------------
@app.post("/recipes")
async def create_recipe(
    title: str = Form(...),
    description: str = Form(...),
    cuisine: str = Form(...),
    difficulty: str = Form(...),
    prep_time: int = Form(...),
    cook_time: int = Form(...),
    servings: int = Form(...),
    ingredients: str = Form(...),  # JSON string
    steps: str = Form(...),        # JSON string
    image: UploadFile = File(None),  # NEW
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "creator":
        raise HTTPException(status_code=403, detail="Only creators can add recipes")

    # 1️⃣ Save recipe
    new_recipe = Recipe(
        title=title,
        description=description,
        cuisine=cuisine,
        difficulty=difficulty,
        prep_time=prep_time,
        cook_time=cook_time,
        servings=servings,
        created_by=current_user.id
    )


    # 2️⃣ Save image if uploaded
    if image:
        import re

        folder = "static/recipe_images"
        os.makedirs(folder, exist_ok=True)  # Ensure folder exists

        # Make filename safe: replace spaces and illegal characters with "_"
        safe_title = re.sub(r'[^a-zA-Z0-9_-]', '_', new_recipe.title)

        # Full file path
        file_path = f"{folder}/{current_user.id}_{safe_title}.{image.filename.split('.')[-1]}"

        # Save file
        with open(file_path, "wb") as f:
            f.write(await image.read())

        # Save path to DB
        new_recipe.image = file_path

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    # 3️⃣ Save ingredients
    # import json
    # ingredients_list = json.loads(ingredients)
    # for ing in ingredients_list:
    #     db.add(Ingredient(recipe_id=new_recipe.id, name=ing["name"], quantity=ing["quantity"], order=ing["order"]))

    # 3️⃣ Save ingredients
    import json
    ingredients_list = json.loads(ingredients)
    for idx, ing in enumerate(ingredients_list):
        db.add(
            Ingredient(
                recipe_id=new_recipe.id,
                name=ing["name"],
                quantity=ing["quantity"],
                order=ing.get("order", idx + 1)  # <-- change here: use .get() with default
            )
        )

    # 4️⃣ Save steps
    # steps_list = json.loads(steps)
    # for step in steps_list:
    #     db.add(Step(recipe_id=new_recipe.id, step_number=step["step_number"], instruction=step["instruction"], estimated_time=step.get("estimated_time",0)))

    # 4️⃣ Save steps
    steps_list = json.loads(steps)
    for idx, step in enumerate(steps_list):
        db.add(
            Step(
                recipe_id=new_recipe.id,
                step_number=step.get("step_number", idx + 1),  # Use .get() with default
                instruction=step["instruction"],
                estimated_time=step.get("estimated_time", 0)
            )
        )

    db.commit()

    # 5️⃣ Return recipe with image URL
    return {
        "id": new_recipe.id,
        "title": new_recipe.title,
        "description": new_recipe.description,
        "cuisine": new_recipe.cuisine,
        "difficulty": new_recipe.difficulty,
        "prep_time": new_recipe.prep_time,
        "cook_time": new_recipe.cook_time,
        "servings": new_recipe.servings,
        "image": f"http://localhost:8002/{new_recipe.image}" if new_recipe.image else None
    }

@app.get("/recipes")
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()


@app.get("/recipes/search")
def search_recipes(
        name: Optional[str] = Query(default=None),
        ingredient: Optional[str] = Query(default=None),
        cuisine: Optional[str] = Query(default=None),
        db: Session = Depends(get_db),

):
    query = db.query(Recipe)

    # Only filter if the string is not empty
    if name and name.strip():
        query = query.filter(Recipe.title.ilike(f"%{name.strip()}%"))
    if ingredient and ingredient.strip():
        query = query.join(Ingredient).filter(Ingredient.name.ilike(f"%{ingredient.strip()}%"))
    if cuisine and cuisine.strip():
        query = query.filter(Recipe.cuisine.ilike(f"%{cuisine.strip()}%"))

    return query.all()


@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).options(joinedload(Recipe.ingredients), joinedload(Recipe.steps)).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@app.patch("/recipes/{recipe_id}")
async def update_recipe(
    recipe_id: int,
    title: str = Form(...),
    description: str = Form(...),
    cuisine: str = Form(...),
    difficulty: str = Form(...),
    prep_time: int = Form(...),
    cook_time: int = Form(...),
    servings: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if db_recipe.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot edit others' recipes")

    # Update text fields
    db_recipe.title = title
    db_recipe.description = description
    db_recipe.cuisine = cuisine
    db_recipe.difficulty = difficulty
    db_recipe.prep_time = prep_time
    db_recipe.cook_time = cook_time
    db_recipe.servings = servings

    # Update image if uploaded
    if image:
        folder_path = "static/recipes"
        os.makedirs(folder_path, exist_ok=True)
        ext = image.filename.split(".")[-1]
        file_location = f"{folder_path}/{db_recipe.id}_recipe.{ext}"
        with open(file_location, "wb") as f:
            f.write(await image.read())
        db_recipe.image = file_location

    db.commit()
    db.refresh(db_recipe)
    return {"message": "Recipe updated successfully", "recipe": db_recipe}

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if db_recipe.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot delete others' recipes")
    db.delete(db_recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}



@app.post("/recipes/{recipe_id}/complete")
def complete_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.add(CookingHistory(user_id=current_user.id, recipe_id=recipe_id))
    db.commit()
    return {"message": "Recipe marked as cooked"}


@app.get("/users/me/history")
def my_cooking_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(CookingHistory).filter(CookingHistory.user_id == current_user.id).all()
    return [{"recipe_id": h.recipe_id, "completed_at": h.completed_at} for h in history]
