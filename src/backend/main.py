
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import openai
from dotenv import load_dotenv

import models
import schemas
import crud
from database import SessionLocal, engine

# Load environment variables
load_dotenv()

# Create tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Service Nexus API",
    description="API for managing service lifecycles and AI chat integration",
    version="1.0.0",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Azure OpenAI
try:
    openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
    openai.api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15")
    openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
    openai_deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
except Exception as e:
    print(f"Failed to configure Azure OpenAI: {e}")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to the Service Nexus API"}

# Service endpoints
@app.post("/services/", response_model=schemas.Service, status_code=status.HTTP_201_CREATED)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db=db, service=service)

@app.get("/services/", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    services = crud.get_services(db, skip=skip, limit=limit)
    return services

@app.get("/services/{service_id}", response_model=schemas.Service)
def read_service(service_id: int, db: Session = Depends(get_db)):
    service = crud.get_service(db, service_id=service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.put("/services/{service_id}", response_model=schemas.Service)
def update_service(service_id: int, service: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    updated_service = crud.update_service(db, service_id=service_id, service=service)
    if updated_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return updated_service

@app.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    success = crud.delete_service(db, service_id=service_id)
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    return None

# Client endpoints
@app.post("/clients/", response_model=schemas.Client, status_code=status.HTTP_201_CREATED)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db=db, client=client)

@app.get("/clients/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients

@app.get("/clients/{client_id}", response_model=schemas.Client)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client = crud.get_client(db, client_id=client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

# AI Chat endpoint
@app.post("/chat/", response_model=schemas.ChatResponse)
async def chat_with_ai(chat_request: schemas.ChatRequest):
    try:
        messages = [
            {"role": "system", "content": "You are a service management AI assistant for Service Nexus, helping with managed service offerings lifecycle and operations."},
            {"role": "user", "content": chat_request.message}
        ]

        # Check if Azure OpenAI is properly configured
        if not openai.api_key or not openai.api_base or not openai_deployment_name:
            return {"response": "AI assistant is not configured. Please set up Azure OpenAI credentials in the .env file."}

        # Make the API call to Azure OpenAI
        response = openai.ChatCompletion.create(
            engine=openai_deployment_name,
            messages=messages,
            max_tokens=800,
            temperature=0.7,
        )

        return {"response": response.choices[0].message.content}
    except Exception as e:
        return {"response": f"I encountered an error: {str(e)}. Please ensure Azure OpenAI is properly configured."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
