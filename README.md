# PhotoGallery Demo

A monorepo-based microservice demo project ideal for demonstrating the transition from monorepo structure to cloud-ready containerized deployment. This project showcases modern web application architecture with React frontend and Node.js backend, fully containerized with Docker and ready for AWS deployment.

## 🎯 Demo Purpose

This project is designed for a **10-15 minute live demo** covering:
- **Monorepo structure** with npm workspaces
- **Microservices architecture** with separate frontend and backend
- **Docker containerization** for each service
- **Cloud-ready deployment** with AWS touchpoints

## 📁 Project Structure

```
photogallery-demo/
├── apps/
│   ├── web-gallery/          # React frontend app
│   │   ├── src/
│   │   │   ├── components/   # Photo gallery components
│   │   │   ├── services/     # API integration
│   │   │   └── App.jsx
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api-server/           # Node.js Express backend
│       ├── src/
│       │   └── index.js      # API endpoints
│       ├── data/
│       │   └── images.json   # Sample image metadata
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml        # Multi-container orchestration
├── package.json             # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Local Development (Without Docker)

1. **Install dependencies** for all workspaces:
   ```bash
   npm install
   ```

2. **Start the API server**:
   ```bash
   npm run dev:api
   ```
   API runs on `http://localhost:3001`

3. **Start the web app** (in a new terminal):
   ```bash
   npm run dev:web
   ```
   Web app runs on `http://localhost:3000`

4. **Access the application**:
   Open `http://localhost:3000` in your browser

### Docker Deployment

1. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Web App: `http://localhost`
   - API: `http://localhost:3001`

3. **Stop all services**:
   ```bash
   docker-compose down
   ```

## 🏗️ Architecture

### Frontend (web-gallery)
- **Framework**: React with Vite
- **Features**:
  - Responsive photo gallery grid
  - Category-based filtering
  - Modal for full-size image viewing
  - API integration for dynamic content
- **Container**: nginx serving static build

### Backend (api-server)
- **Framework**: Express.js
- **Endpoints**:
  - `GET /health` - Health check
  - `GET /api/images` - Get all images
  - `GET /api/images/:id` - Get specific image
  - `GET /api/images/category/:category` - Filter by category
- **Data**: JSON-based image metadata

## 🐳 Docker Strategy

Each microservice has its own Dockerfile:

- **api-server**: Node.js Alpine container
- **web-gallery**: Multi-stage build (Node.js build → nginx serve)

Benefits demonstrated:
- Independent scaling
- Isolated dependencies
- Production-ready containers
- Efficient caching layers

## ☁️ AWS Deployment Guide

### Deployment Options

#### Option 1: Amazon ECS (Elastic Container Service)
1. **Push images to ECR** (Elastic Container Registry)
2. **Create ECS Task Definitions** for each service
3. **Deploy to ECS Cluster** with Fargate or EC2
4. **Configure ALB** (Application Load Balancer) for routing

#### Option 2: Amazon EKS (Elastic Kubernetes Service)
1. **Push images to ECR**
2. **Create Kubernetes manifests** (deployments, services)
3. **Deploy to EKS cluster**
4. **Use Ingress** for external access

#### Option 3: AWS App Runner
- **Quickest option** for containerized apps
- Automatic scaling and load balancing
- Direct deployment from ECR or source code

### Infrastructure Components
- **ECR**: Store Docker images
- **RDS/DynamoDB**: Production database (if needed)
- **S3**: Static asset storage
- **CloudFront**: CDN for frontend
- **Route 53**: DNS management
- **VPC**: Network isolation
- **IAM**: Access management

### Environment Configuration
Update environment variables for production:
- API URL for frontend
- Database connections
- AWS credentials and region
- Logging configuration

## 🎓 Demo Script (10-15 minutes)

### 1. Introduction (2 min)
- Show project structure
- Explain monorepo concept
- Highlight microservices separation

### 2. Local Development (3 min)
- Start services locally
- Demo the working application
- Show API endpoints
- Filter images by category

### 3. Containerization (4 min)
- Review Dockerfiles
- Explain multi-stage builds
- Show docker-compose.yml
- Build and run containers

### 4. Cloud Deployment Discussion (3 min)
- Overview of AWS services
- Discuss deployment strategies
- Show infrastructure considerations
- Explain scaling approach

### 5. Q&A (3 min)

## 📦 Available Scripts

From root directory:
- `npm install` - Install all workspace dependencies
- `npm run dev` - Start both services in development
- `npm run dev:api` - Start API server only
- `npm run dev:web` - Start web app only
- `npm run build` - Build both services
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

## 🔧 Customization

### Adding More Images
Edit `apps/api-server/data/images.json`

### Changing Ports
- API: Update `PORT` in `apps/api-server/src/index.js`
- Web: Update port in `apps/web-gallery/package.json` dev script
- Docker: Update port mappings in `docker-compose.yml`

### Styling
Modify CSS files in `apps/web-gallery/src/components/`

## 📚 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Guide](https://docs.aws.amazon.com/ecs/)
- [Monorepo Best Practices](https://monorepo.tools/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)

## 🤝 Contributing

This is a demo project. Feel free to fork and adapt for your own demos or learning purposes.

## 📄 License

ISC
