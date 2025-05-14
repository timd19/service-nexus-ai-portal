
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Base models for common fields
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str
    status: str = "active"
    monthly_cost: float

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    monthly_cost: Optional[float] = None

class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Client models
class ClientBase(BaseModel):
    name: str
    email: str
    company: str
    status: str = "active"

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Chat models
class ChatRequest(BaseModel):
    message: str
    api_key: Optional[str] = None
    endpoint: Optional[str] = None
    deployment_name: Optional[str] = None
    api_version: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
