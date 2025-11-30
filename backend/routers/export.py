from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from .. import models, database, auth
from ..services import doc_gen
import io

router = APIRouter(
    prefix="/export",
    tags=["export"],
)

@router.get("/{project_id}")
def export_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.type == "docx":
        buffer = doc_gen.create_docx(project)
        filename = f"{project.title}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif project.type == "pptx":
        buffer = doc_gen.create_pptx(project)
        filename = f"{project.title}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    else:
        raise HTTPException(status_code=400, detail="Unsupported project type")
        
    return StreamingResponse(
        buffer, 
        media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
