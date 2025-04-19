# Technical Decisions Document

## Architecture Overview
- Frontend: React + TypeScript using Vite for fast development
- Backend: Node.js + Express + TypeScript for type-safe API development
- Database: MongoDB for flexible schema and easy scalability
- Queue System: Azure Service Bus for reliable message processing
- Infrastructure: Terraform for Azure resource provisioning

## Technology Choices

### Frontend
- **Vite + React**: Fast development experience, excellent HMR
- **TypeScript**: Type safety and better developer experience
- **TanStack Query**: For efficient API data fetching and caching
- **Tailwind CSS**: For rapid UI development
- **React Hook Form**: Form handling with validation

### Backend
- **Express.js**: Mature, well-documented Node.js framework
- **TypeScript**: Type safety across the stack
- **MongoDB**: Flexible schema for farm/animal data
- **Azure Service Bus**: Enterprise-grade message queue system
- **Zod**: Runtime type validation

### Infrastructure
- **Terraform**: Industry standard IaC tool
- **Azure**: Comprehensive cloud platform with good integration
  - App Service: For hosting backend
  - Cosmos DB API for MongoDB: Managed MongoDB service
  - Service Bus: For message queue functionality

## Project Structure
```
farms-app/
├── frontend/          # React + TypeScript frontend
├── backend/           # Express + TypeScript backend
└── infrastructure/    # Terraform configuration
```
