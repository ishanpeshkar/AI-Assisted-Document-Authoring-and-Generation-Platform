from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class SectionBase(BaseModel):
    title: str
    order: int
    content: Optional[str] = ""

class SectionCreate(SectionBase):
    pass

class Section(SectionBase):
    id: int
    project_id: int
    refinement_history: List[Any] = []
    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    title: str
    type: str
    topic: str

class ProjectCreate(ProjectBase):
    sections: List[SectionCreate]

class Project(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    sections: List[Section] = []
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
