# Farms App

Fullstack application for farm management with React, Node.js, and TypeScript. This application allows users to manage farms and their animals, with real-time notifications using Azure Service Bus.

## Features

- Farm management (CRUD operations)
- Animal management per farm (CRUD operations)
- Real-time notifications (console-based for development, Azure Service Bus for production)
- TypeScript for type safety
- Modern UI with Tailwind CSS
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- React Query for data fetching
- React Hook Form for form management
- Tailwind CSS for styling

### Backend
- Node.js with Express
- TypeScript
- MongoDB (via Azure Cosmos DB)
- Notification system (console-based for development, Azure Service Bus ready for production)

### Infrastructure
- Azure Cloud Services
- Terraform for Infrastructure as Code

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- MongoDB database (local or Atlas)

#### Optional for Production
- Azure account with:
  - Cosmos DB instance
  - Service Bus namespace

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   # Azure Service Bus is optional for development
   # AZURE_SERVICE_BUS_CONNECTION_STRING=your_service_bus_connection_string
   ```

   Note: For development, the notification system will log messages to the console instead of using Azure Service Bus.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Cloud Deployment

### Infrastructure Setup

1. Install Terraform

2. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Apply the configuration:
   ```bash
   terraform apply
   ```

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy to Azure App Service using the Azure CLI:
   ```bash
   az webapp up --runtime "node|16-lts" --name your-backend-app-name
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Azure Static Web Apps or your preferred hosting service.

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

### Available Endpoints

#### Farms
- `GET /api/farms` - List all farms
- `POST /api/farms` - Create a farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

#### Animals
- `GET /api/farms/:farmId/animals` - List farm animals
- `POST /api/farms/:farmId/animals` - Add animal to farm
- `GET /api/farms/:farmId/animals/:id` - Get animal details
- `PUT /api/farms/:farmId/animals/:id` - Update animal
- `DELETE /api/farms/:farmId/animals/:id` - Delete animal

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
