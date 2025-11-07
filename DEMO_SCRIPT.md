# PhotoGallery Demo Script (10-15 minutes)

This script guides you through a live demonstration of the PhotoGallery monorepo project.

## Prerequisites
- Ensure both Node.js and Docker are installed
- Clone the repository
- Have a terminal and browser ready

---

## Part 1: Introduction & Project Structure (2 minutes)

### Show the Repository Structure
```bash
tree -L 3 -I 'node_modules|dist'
```

### Key Points to Highlight:
- **Monorepo structure** - Single repository containing multiple applications
- **apps/ directory** - Houses two microservices:
  - `web-gallery` - React frontend
  - `api-server` - Node.js Express API
- **Root-level configs** - package.json with npm workspaces, docker-compose.yml
- **Independent Dockerfiles** - Each service can be containerized separately

### Explain the Benefits:
- Shared tooling and dependencies
- Easier cross-service changes
- Single source of truth
- Simplified CI/CD pipelines

---

## Part 2: Local Development Demo (3 minutes)

### Start the Backend API
```bash
# Terminal 1
cd apps/api-server
npm install
npm start
```

**Show:** API running on port 3001

### Test the API Endpoints
```bash
# Terminal 2
curl http://localhost:3001/health
curl http://localhost:3001/api/images | jq
```

**Explain:**
- Health check endpoint
- RESTful API returning JSON data
- 8 sample images with metadata (title, photographer, category)

### Start the Frontend
```bash
# Terminal 3
cd apps/web-gallery
npm install
npm run dev
```

**Show:** Web app running on port 3000

### Open Browser and Demo Features
1. Navigate to `http://localhost:3000`
2. **Show the gallery grid** - 8 images displayed in a responsive grid
3. **Demo filtering** - Click "Nature" and "Urban" category buttons
4. **Click an image** - Opens modal with full details
5. **Show responsive design** - Resize browser window

**Key Points:**
- React-based SPA with modern UI
- API integration for dynamic content
- Category filtering functionality
- Modal for detailed view

---

## Part 3: Docker Containerization (4 minutes)

### Stop Local Services
```bash
# Stop the running services (Ctrl+C in terminals)
```

### Review Dockerfiles

**API Server Dockerfile:**
```bash
cat apps/api-server/Dockerfile
```

**Explain:**
- Alpine-based Node.js image (lightweight)
- Production dependencies only
- Exposes port 3001

**Web App Dockerfile:**
```bash
cat apps/web-gallery/Dockerfile
```

**Explain:**
- Multi-stage build
- Stage 1: Node.js builds the React app
- Stage 2: nginx serves static files
- Production-optimized

### Show docker-compose.yml
```bash
cat docker-compose.yml
```

**Explain:**
- Orchestrates both services
- Sets up networking between containers
- Configures environment variables
- Port mappings

### Build and Run with Docker
```bash
docker-compose up --build
```

**Wait for build** (show progress bars)

### Test Containerized Application
1. Open browser to `http://localhost`
2. **Show it works identically** to local development
3. API accessible at `http://localhost:3001`

**Key Points:**
- Independent containers can scale separately
- Same behavior in dev and production
- Easy to deploy anywhere Docker runs

### Cleanup
```bash
docker-compose down
```

---

## Part 4: Cloud Deployment Discussion (3-4 minutes)

### AWS Deployment Options

**Option 1: Amazon ECS (Elastic Container Service)**
- **Best for:** Production microservices
- **Process:**
  1. Push images to ECR (Elastic Container Registry)
  2. Create task definitions for each service
  3. Deploy to ECS cluster (Fargate or EC2)
  4. Configure ALB for routing

**Option 2: Amazon EKS (Elastic Kubernetes Service)**
- **Best for:** Complex orchestration needs
- **Process:**
  1. Push images to ECR
  2. Create Kubernetes manifests
  3. Deploy to EKS cluster
  4. Use Ingress for routing

**Option 3: AWS App Runner**
- **Best for:** Quick deployments, auto-scaling
- **Process:**
  1. Connect to ECR or GitHub
  2. Auto-deploy on push
  3. Managed scaling and load balancing

### Infrastructure Components to Discuss

**Storage & Database:**
- S3 for image storage
- RDS/DynamoDB for metadata

**Networking:**
- VPC for isolation
- CloudFront for CDN
- Route 53 for DNS

**Monitoring & Security:**
- CloudWatch for logs
- IAM for access control
- Secrets Manager for credentials

### Show Deployment Workflow (Conceptual)
```
Developer Push
    ↓
GitHub Actions / CI Pipeline
    ↓
Build Docker Images
    ↓
Push to ECR
    ↓
Deploy to ECS/EKS/App Runner
    ↓
Live Application
```

---

## Part 5: Scaling & Production Considerations (2 minutes)

### Monorepo Benefits in Production:
- **Single CI/CD pipeline** - Build and deploy both services together
- **Consistent versioning** - Track changes across services
- **Shared configurations** - Docker, linting, testing
- **Atomic changes** - Update API and frontend in one PR

### Scaling Strategy:
- **Horizontal scaling** - Run multiple containers of each service
- **Independent scaling** - Scale API separately from frontend
- **Load balancing** - ALB/ELB distributes traffic
- **Auto-scaling** - Based on CPU/memory metrics

### Production Checklist:
- ✅ Environment variables for secrets
- ✅ HTTPS with SSL certificates
- ✅ Database backups
- ✅ Monitoring and alerting
- ✅ Error tracking (Sentry, etc.)
- ✅ CDN for static assets

---

## Part 6: Q&A (2-3 minutes)

### Common Questions:

**Q: Why monorepo over multiple repos?**
A: Easier coordination, shared tooling, atomic changes, simplified CI/CD.

**Q: How do you handle different deployment schedules?**
A: Even in a monorepo, services can be deployed independently using CI/CD tools.

**Q: What about scaling databases?**
A: Start with managed services (RDS), add read replicas, consider caching (Redis/ElastiCache).

**Q: How do you handle secrets?**
A: Use AWS Secrets Manager or Parameter Store, inject at runtime, never commit to code.

**Q: What's the cost of running this on AWS?**
A: Small demo: ~$20-50/month (t3.micro instances, minimal traffic)
   Production: Varies based on traffic, can optimize with reserved instances.

---

## Tips for a Smooth Demo

1. **Pre-install dependencies** before the demo to save time
2. **Have docker-compose built** ahead of time
3. **Keep terminals organized** - label them clearly
4. **Use tmux or split terminals** for better visibility
5. **Have backup screenshots** in case of network issues
6. **Practice timing** - aim for 12-13 minutes to allow buffer
7. **Prepare for questions** about specific AWS services

---

## Demo Variations

### Quick 5-minute version:
1. Show structure (1 min)
2. Run local app (2 min)
3. Show docker-compose (1 min)
4. Discuss AWS briefly (1 min)

### Extended 20-minute version:
- Add live Docker build walkthrough
- Show actual ECR/ECS console
- Demonstrate GitHub Actions workflow
- Live troubleshooting session

---

## Additional Resources

**Documentation:**
- `README.md` - Full setup instructions
- `apps/api-server/README.md` - API documentation
- `apps/web-gallery/README.md` - Frontend documentation

**Next Steps:**
- Add authentication (Auth0, Cognito)
- Add image upload functionality
- Implement caching layer
- Add unit and integration tests
- Set up monitoring dashboards
