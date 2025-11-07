# AWS Deployment Examples

This document provides concrete examples for deploying the PhotoGallery app to AWS.

## Prerequisites

- AWS CLI installed and configured
- Docker installed locally
- AWS account with appropriate permissions

## Option 1: Deploy to Amazon ECS with Fargate

### Step 1: Create ECR Repositories

```bash
# Create repositories for both services
aws ecr create-repository --repository-name photogallery-api --region us-east-1
aws ecr create-repository --repository-name photogallery-web --region us-east-1
```

### Step 2: Build and Push Docker Images

```bash
# Get ECR login credentials
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag API image
cd apps/api-server
docker build -t photogallery-api .
docker tag photogallery-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-api:latest

# Build and tag Web image
cd ../web-gallery
docker build -t photogallery-web .
docker tag photogallery-web:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-web:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-web:latest
```

### Step 3: Create ECS Task Definitions

**api-task-definition.json:**
```json
{
  "family": "photogallery-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "api-server",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-api:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/photogallery-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**web-task-definition.json:**
```json
{
  "family": "photogallery-web",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "web-gallery",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-web:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "VITE_API_URL",
          "value": "http://<alb-dns-name>:3001"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/photogallery-web",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 4: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name photogallery-cluster --region us-east-1
```

### Step 5: Register Task Definitions

```bash
aws ecs register-task-definition --cli-input-json file://api-task-definition.json
aws ecs register-task-definition --cli-input-json file://web-task-definition.json
```

### Step 6: Create Application Load Balancer

```bash
# Create target groups
aws elbv2 create-target-group \
  --name photogallery-api-tg \
  --protocol HTTP \
  --port 3001 \
  --vpc-id <vpc-id> \
  --target-type ip

aws elbv2 create-target-group \
  --name photogallery-web-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id <vpc-id> \
  --target-type ip

# Create ALB
aws elbv2 create-load-balancer \
  --name photogallery-alb \
  --subnets <subnet-1> <subnet-2> \
  --security-groups <security-group-id>

# Create listeners (configure rules to route traffic)
```

### Step 7: Create ECS Services

```bash
aws ecs create-service \
  --cluster photogallery-cluster \
  --service-name api-service \
  --task-definition photogallery-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=<api-tg-arn>,containerName=api-server,containerPort=3001"

aws ecs create-service \
  --cluster photogallery-cluster \
  --service-name web-service \
  --task-definition photogallery-web \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=<web-tg-arn>,containerName=web-gallery,containerPort=80"
```

---

## Option 2: Deploy to AWS App Runner (Simplest)

### Step 1: Push Images to ECR (same as above)

### Step 2: Create App Runner Services via Console

1. Navigate to AWS App Runner in the console
2. Click "Create service"
3. **For API Service:**
   - Source: Container registry (ECR)
   - Select the photogallery-api repository
   - Port: 3001
   - Environment variables: `NODE_ENV=production`
4. **For Web Service:**
   - Source: Container registry (ECR)
   - Select the photogallery-web repository
   - Port: 80
   - Environment variables: `VITE_API_URL=<api-service-url>`

App Runner automatically handles:
- SSL certificates
- Auto-scaling
- Load balancing
- Health checks

---

## Option 3: Deploy to Amazon EKS

### Step 1: Create EKS Cluster

```bash
eksctl create cluster \
  --name photogallery-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3
```

### Step 2: Create Kubernetes Manifests

**api-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api-server
        image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-api:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: LoadBalancer
  ports:
  - port: 3001
    targetPort: 3001
  selector:
    app: api-server
```

**web-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-gallery
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-gallery
  template:
    metadata:
      labels:
        app: web-gallery
    spec:
      containers:
      - name: web-gallery
        image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/photogallery-web:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: web-gallery
```

### Step 3: Deploy to EKS

```bash
kubectl apply -f api-deployment.yaml
kubectl apply -f web-deployment.yaml

# Check status
kubectl get deployments
kubectl get services
kubectl get pods
```

---

## Infrastructure as Code with Terraform

### Example Terraform Configuration

**main.tf:**
```hcl
provider "aws" {
  region = "us-east-1"
}

# ECR Repositories
resource "aws_ecr_repository" "api" {
  name = "photogallery-api"
}

resource "aws_ecr_repository" "web" {
  name = "photogallery-web"
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "photogallery-cluster"
}

# Task Definitions
resource "aws_ecs_task_definition" "api" {
  family                   = "photogallery-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  
  container_definitions = jsonencode([{
    name  = "api-server"
    image = "${aws_ecr_repository.api.repository_url}:latest"
    portMappings = [{
      containerPort = 3001
      protocol      = "tcp"
    }]
  }])
}

# Similar for web service...
```

---

## CI/CD with GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push API image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: photogallery-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd apps/api-server
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Build and push Web image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: photogallery-web
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd apps/web-gallery
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster photogallery-cluster --service api-service --force-new-deployment
          aws ecs update-service --cluster photogallery-cluster --service web-service --force-new-deployment
```

---

## Cost Estimation

### Small Deployment (ECS Fargate)
- 2 tasks (API + Web) × 0.25 vCPU, 0.5 GB
- ~$15-20/month
- ALB: ~$20/month
- **Total: ~$35-40/month**

### Medium Deployment (ECS with EC2)
- 2 t3.small instances
- ~$30/month for compute
- ALB: ~$20/month
- **Total: ~$50/month**

### App Runner
- 2 services with minimal traffic
- ~$25-35/month
- Includes SSL and auto-scaling

---

## Security Best Practices

1. **Use VPC** - Deploy services in private subnets
2. **Security Groups** - Restrict traffic between services
3. **IAM Roles** - Use task roles, not access keys
4. **Secrets** - Store in AWS Secrets Manager
5. **HTTPS** - Use ACM certificates with ALB
6. **Logging** - Enable CloudWatch logs
7. **Monitoring** - Set up CloudWatch alarms
8. **Updates** - Regularly update base images

---

## Troubleshooting

### Common Issues

**Can't connect to API from web:**
- Check security group rules
- Verify ALB health checks
- Check environment variables

**High costs:**
- Review CloudWatch metrics
- Optimize container resources
- Use reserved instances

**Slow deployment:**
- Check image size (optimize with multi-stage builds)
- Review task definition resources
- Check ECR pull performance

---

## Next Steps

1. Set up custom domain with Route 53
2. Add CloudFront for CDN
3. Implement RDS for persistent data
4. Add ElastiCache for caching
5. Set up CI/CD pipeline
6. Configure monitoring and alerting
7. Implement blue-green deployment
