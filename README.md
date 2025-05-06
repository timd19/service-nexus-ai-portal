
# Service Nexus AI Portal

An internal admin portal for developing, tracking, and managing the lifecycle of managed service offerings with AI chat integration.

## Project Overview

Service Nexus AI Portal is a comprehensive management tool that helps teams monitor and manage their service offerings. The system integrates with Azure OpenAI to provide intelligent assistance and insights.

### Key Features

- **Service Lifecycle Management**: Track and manage services from planning to retirement
- **Client Management**: Maintain client information and service relationships
- **AI Chat Assistant**: Get insights and help using Azure OpenAI integration
- **Analytics Dashboard**: Monitor service health and performance
- **Activity Tracking**: Log and review all service-related activities

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS with shadcn/ui components
- PowerShell Universal (for additional management interfaces)

### Backend
- Python FastAPI
- PostgreSQL database
- Azure OpenAI for AI capabilities

### Deployment
- Docker containerization
- Docker Compose for local development

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local React development)
- Python 3.9+ (for local backend development)
- PowerShell (for Universal Dashboard)

### Setup Instructions

1. Clone the repository
2. Copy the `.env.example` file to `.env` and fill in your Azure OpenAI credentials:
   ```
   cp src/backend/.env.example src/backend/.env
   ```
3. Start the application with Docker Compose:
   ```
   docker-compose up --build
   ```

## Project Structure

```
service-nexus-ai-portal/
├── src/
│   ├── components/        # React UI components
│   ├── pages/             # Page components
│   ├── backend/           # FastAPI backend
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── main.py        # FastAPI application
│   │   └── ...            # Other backend files
│   ├── frontend/          # PowerShell Universal files
│   └── ...
└── docker-compose.yml     # Docker compose configuration
```

## Future Enhancements

- User authentication and role-based access control
- Advanced analytics and reporting
- Automated service health monitoring
- Integration with other service management tools
- Enhanced AI capabilities with fine-tuned models

## License

This project is for internal use only.

---

*Created with Lovable*
