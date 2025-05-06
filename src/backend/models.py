
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class ServiceStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    DEPRECATED = "deprecated"
    RETIRED = "retired"

class ServiceHealth(str, enum.Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    INACTIVE = "inactive"

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(Enum(ServiceStatus), default=ServiceStatus.PLANNING)
    health = Column(Enum(ServiceHealth), default=ServiceHealth.INACTIVE)
    client_id = Column(Integer, ForeignKey("clients.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    client = relationship("Client", back_populates="services")
    activities = relationship("Activity", back_populates="service")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_name = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    services = relationship("Service", back_populates="client")

class ActivityType(str, enum.Enum):
    SERVICE_CREATED = "service_created"
    SERVICE_UPDATED = "service_updated"
    SERVICE_DELETED = "service_deleted"
    MAINTENANCE_SCHEDULED = "maintenance_scheduled"
    INCIDENT_REPORTED = "incident_reported"
    USER_ADDED = "user_added"
    SECURITY_UPDATE = "security_update"

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(Enum(ActivityType))
    description = Column(Text, nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    user_name = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    service = relationship("Service", back_populates="activities")
