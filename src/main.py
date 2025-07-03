from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import json
from typing import List, Optional
import uuid
import os

from src.api import schemas
from src.core import database

app = FastAPI()

# Configure CORS
# In a production environment, you should restrict allow_origins to your frontend's URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/foods", response_model=List[schemas.Food])
def get_all_foods(db: Session = Depends(get_db)):
    foods = db.query(database.Food).all()
    # Parse tags from JSON string to list of strings
    foods_with_parsed_tags = []
    for food in foods:
        food_dict = food.__dict__.copy()
        if food_dict.get("tags"):
            try:
                food_dict["tags"] = json.loads(food_dict["tags"])
            except json.JSONDecodeError:
                food_dict["tags"] = [] # Handle malformed JSON
        else:
            food_dict["tags"] = []
        foods_with_parsed_tags.append(schemas.Food(**food_dict))
    return foods_with_parsed_tags

@app.post("/foods", response_model=schemas.Food, status_code=status.HTTP_201_CREATED)
def add_food(food: schemas.FoodCreate, db: Session = Depends(get_db)):
    # Convert tags list to JSON string before saving
    tags_string = json.dumps(food.tags) if food.tags else "[]"
    db_food = database.Food(name=food.name, image=food.image, location=food.location, tags=tags_string)
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    
    # Parse tags back for the response model
    response_food_dict = db_food.__dict__.copy()
    response_food_dict["tags"] = json.loads(db_food.tags) if db_food.tags else []
    return schemas.Food(**response_food_dict)

@app.delete("/foods/{food_id}", status_code=status.HTTP_200_OK)
def delete_food(food_id: int, db: Session = Depends(get_db)):
    db_food = db.query(database.Food).filter(database.Food.id == food_id).first()
    if db_food is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food not found")
    db.delete(db_food)
    db.commit()
    return {"message": "Food deleted successfully."}

@app.put("/foods/{food_id}", response_model=schemas.Food)
def update_food(food_id: int, food: schemas.FoodUpdate, db: Session = Depends(get_db)):
    db_food = db.query(database.Food).filter(database.Food.id == food_id).first()
    if db_food is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food not found")
    
    db_food.name = food.name
    db_food.image = food.image
    db_food.location = food.location
    db_food.tags = json.dumps(food.tags) if food.tags else "[]"
    
    db.commit()
    db.refresh(db_food)

    # Parse tags back for the response model
    response_food_dict = db_food.__dict__.copy()
    response_food_dict["tags"] = json.loads(db_food.tags) if db_food.tags else []
    return schemas.Food(**response_food_dict)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    UPLOAD_DIR = "src/static/images"
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024)
                if not chunk:
                    break
                buffer.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {e}")

    return {"filename": unique_filename, "url": f"/static/images/{unique_filename}"}

# Mount static files
app.mount("/static", StaticFiles(directory="src/static"), name="static")

# Serve index.html for the root path
@app.get("/")
async def serve_index():
    return FileResponse("src/static/index.html")
