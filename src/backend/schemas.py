
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import ServiceStatus, ServiceHealth, ActivityType

# Client schemas
class ClientBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Service schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: ServiceStatus = ServiceStatus.PLANNING
    health: ServiceHealth = ServiceHealth.INACTIVE
    client_id: int

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ServiceStatus] = None
    health: Optional[ServiceHealth] = None
    client_id: Optional[int] = None

class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Activity schemas
class ActivityBase(BaseModel):
    activity_type: ActivityType
    description: Optional[str] = None
    service_id: int
    user_name: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

# Service with activities
class ServiceWithActivities(Service):
    activities: List[Activity] = []

    class Config:
        orm_mode = True

# Client with services
class ClientWithServices(Client):
    services: List[Service] = []

    class Config:
        orm_mode = True

# AI Chat schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
