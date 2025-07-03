from typing import List, Optional
from pydantic import BaseModel

class FoodBase(BaseModel):
    name: str
    image: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = []

class FoodCreate(FoodBase):
    pass

class FoodUpdate(FoodBase):
    pass

class Food(FoodBase):
    id: int

    class Config:
        from_attributes = True
