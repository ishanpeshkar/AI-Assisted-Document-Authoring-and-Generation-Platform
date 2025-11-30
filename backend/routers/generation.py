from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .. import models, database, auth
from ..services import llm_service

router = APIRouter(
    prefix="/generation",
    tags=["generation"],
)

class GenerateRequest(BaseModel):
    project_id: int

class RefineRequest(BaseModel):
    section_id: int
    instruction: str

@router.post("/generate")
def generate_project_content(request: GenerateRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == request.project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for section in project.sections:
        # Context includes the project topic and type
        context = f"Project Topic: {project.topic}. Document Type: {project.type}."
        prompt = f"Write content for the section titled '{section.title}'."
        
        generated_text = llm_service.generate_content(prompt, context)
        section.content = generated_text
        
    db.commit()
    return {"message": "Content generation started/completed"}

@router.post("/refine")
def refine_section_content(request: RefineRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    section = db.query(models.DocumentSection).join(models.Project).filter(models.DocumentSection.id == request.section_id, models.Project.user_id == current_user.id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
        
    refined_text = llm_service.refine_content(section.content, request.instruction)
    
    # Store history
    history_entry = {
        "original": section.content,
        "instruction": request.instruction,
        "refined": refined_text,
        "timestamp": str(database.datetime.utcnow())
    }
    
    # Update section
    section.content = refined_text
    
    # Append to history (handling if it's None initially)
    if section.refinement_history is None:
        section.refinement_history = []
    
    # SQLAlchemy JSON type mutation tracking can be tricky, so we re-assign
    current_history = list(section.refinement_history)
    current_history.append(history_entry)
    section.refinement_history = current_history
    
    db.commit()
    return {"refined_content": refined_text}
