
from sqlalchemy.orm import Session
import models
import schemas
from typing import List, Optional

# Service CRUD operations
def get_service(db: Session, service_id: int):
    return db.query(models.Service).filter(models.Service.id == service_id).first()

def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    
    # Log activity
    activity = models.Activity(
        activity_type=models.ActivityType.SERVICE_CREATED,
        description=f"Service '{db_service.name}' was created",
        service_id=db_service.id,
        user_name="System"  # In a real app, this would be the logged-in user
    )
    db.add(activity)
    db.commit()
    
    return db_service

def update_service(db: Session, service_id: int, service: schemas.ServiceUpdate):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        return None
    
    update_data = service.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_service, key, value)
    
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    
    # Log activity
    activity = models.Activity(
        activity_type=models.ActivityType.SERVICE_UPDATED,
        description=f"Service '{db_service.name}' was updated",
        service_id=db_service.id,
        user_name="System"  # In a real app, this would be the logged-in user
    )
    db.add(activity)
    db.commit()
    
    return db_service

def delete_service(db: Session, service_id: int):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        return False
    
    # Log activity before deleting
    service_name = db_service.name
    activity = models.Activity(
        activity_type=models.ActivityType.SERVICE_DELETED,
        description=f"Service '{service_name}' was deleted",
        user_name="System"  # In a real app, this would be the logged-in user
    )
    db.add(activity)
    
    # Now delete the service
    db.delete(db_service)
    db.commit()
    
    return True

# Client CRUD operations
def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# Activity CRUD operations
def get_activities(db: Session, service_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Activity)
    if service_id:
        query = query.filter(models.Activity.service_id == service_id)
    return query.order_by(models.Activity.timestamp.desc()).offset(skip).limit(limit).all()
