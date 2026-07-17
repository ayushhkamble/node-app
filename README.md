# 🚀 node-app — Node.js CI/CD Pipeline to Amazon EKS

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EKS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

A small **Node.js + Express** demo application built to showcase a complete, real-world **CI/CD pipeline**: code is pushed to GitHub, picked up by a **Jenkins** webhook, tested, containerized with **Docker**, pushed to **Docker Hub**, and finally deployed to **Amazon EKS** using Kubernetes manifests.

```
GitHub ➜ Webhook ➜ Jenkins ➜ Docker Build ➜ Docker Hub ➜ Amazon EKS
```

---

## 📖 Table of Contents

- [What This Project Does](#-what-this-project-does)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Practical Steps](#-practical-steps)
  - [1. Run Locally](#1-run-locally)
  - [2. Run With Docker](#2-run-with-docker)
  - [3. Set Up the Jenkins Pipeline](#3-set-up-the-jenkins-pipeline)
  - [4. Deploy to Amazon EKS](#4-deploy-to-amazon-eks)
  - [5. Verify the Deployment](#5-verify-the-deployment)
- [Application Endpoints](#-application-endpoints)
- [Kubernetes Manifests Explained](#-kubernetes-manifests-explained)
- [Jenkinsfile Stages Explained](#-jenkinsfile-stages-explained)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🧩 What This Project Does

This repository is a **DevOps portfolio project**. The application itself is intentionally simple — a single Express server that renders a styled status dashboard — because the real subject of the project is the **pipeline that builds, tests, packages, and ships it**.

When you hit the app in a browser, it shows a live "CI/CD Pipeline" dashboard confirming the deployment path (GitHub → Webhook → Jenkins → Docker → Docker Hub → Amazon EKS), along with deployment time, environment, and health status — a nice visual proof that the whole automation chain worked end to end.

---

## 🏗 Architecture

```
 ┌─────────────┐      push       ┌──────────────┐
 │   Developer │ ───────────────▶│    GitHub    │
 └─────────────┘                 └──────┬───────┘
                                         │ webhook
                                         ▼
                                 ┌──────────────┐
                                 │   Jenkins    │
                                 │  (CI Server) │
                                 └──────┬───────┘
                        ┌────────────────┼────────────────┐
                        ▼                ▼                ▼
                 npm install        npm test         docker build
                        │                │                │
                        └────────────────┴────────┬───────┘
                                                   ▼
                                          ┌──────────────────┐
                                          │    Docker Hub     │
                                          │  (image registry)  │
                                          └─────────┬─────────┘
                                                     ▼
                                          ┌──────────────────┐
                                          │   Amazon EKS       │
                                          │  (kubectl apply)   │
                                          └──────────────────┘
```

---

## 📁 Project Structure

```
node-app/
├── server.js              # Express application (main entry point)
├── package.json           # Dependencies & npm scripts
├── dockerfile             # Container build instructions
├── tests/
│   └── app.test.js        # Basic sanity test run in CI
├── k8s/
│   ├── deployment.yaml    # Kubernetes Deployment (2 replicas)
│   └── service.yaml       # Kubernetes LoadBalancer Service
├── cdec-52-53.groovy       # Main Jenkins pipeline (builds → EKS deploy)
├── pipeline.groovy         # Earlier pipeline draft (Docker-only deploy)
├── node.groovy              # Earlier pipeline draft (Docker Hub push variant)
├── newpipeline.groovy        # Unrelated experimental Maven pipeline
├── k8s-deployment.groovy      # Placeholder / scratch file
└── README.md
```

> 💡 The multiple `.groovy` files reflect the pipeline's evolution — from a basic build-and-run pipeline (`pipeline.groovy`, `node.groovy`) to the final production pipeline that deploys straight to EKS (`cdec-52-53.groovy`).

---

## ✅ Prerequisites

Make sure you have the following installed/configured before working through the steps:

| Tool | Purpose | Check version |
|---|---|---|
| Node.js 20.x | Run the app locally | `node -v` |
| npm | Install dependencies | `npm -v` |
| Docker | Build & run containers | `docker --version` |
| kubectl | Talk to the Kubernetes cluster | `kubectl version --client` |
| AWS CLI | Authenticate & update kubeconfig | `aws --version` |
| An EKS cluster | Target for deployment | e.g. `demo-ekscluster` in `eu-north-1` |
| Jenkins (optional) | Automate the pipeline | with Node.js, Docker, and AWS credentials plugins |
| Docker Hub account | Store built images | e.g. `ayushkamble820/node-app` |

---

## 🛠 Practical Steps

### 1. Run Locally

```bash
# Clone the repo
git clone https://github.com/ayushhkamble/node-app.git
cd node-app

# Install dependencies
npm install

# Start the server
npm start
```

Then open **http://localhost:3000** in your browser — you should see the CI/CD dashboard page.

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

---

### 2. Run With Docker

Build the image using the included `dockerfile`:

```bash
docker build -t node-app:local .
```

Run the container:

```bash
docker run -d --name node-app-container -p 3000:3000 node-app:local
```

Visit **http://localhost:3000** to confirm the container is serving the app, then check logs if needed:

```bash
docker logs -f node-app-container
```

---

### 3. Set Up the Jenkins Pipeline

The main pipeline definition is **`cdec-52-53.groovy`**. To wire it into Jenkins:

1. **Create credentials in Jenkins:**
   - `docker-hub-creds` → Username/Password credential for Docker Hub.
   - `aws-creds` → AWS access key/secret using the *AWS Credentials* plugin binding.
2. **Create a new Pipeline job** in Jenkins and point it at this repository, using `cdec-52-53.groovy` as the pipeline script (or copy its contents into the Jenkinsfile field).
3. **(Optional) Add a GitHub webhook** so pushes to `main` automatically trigger a build:
   - GitHub repo → Settings → Webhooks → Add webhook → `http://<jenkins-host>/github-webhook/`
4. The pipeline will then automatically:
   - Check out the code
   - Verify the environment (Node, npm, Docker, kubectl, AWS CLI versions)
   - Run `npm install`
   - Run `npm test`
   - Build the Docker image, tagged with the Jenkins `BUILD_NUMBER`
   - Log in to Docker Hub and push both the versioned and `latest` tags
   - Patch `k8s/deployment.yaml` with the new image tag using `sed`
   - Update kubeconfig for the target EKS cluster and run `kubectl apply -f k8s/`

---

### 4. Deploy to Amazon EKS

You can also deploy manually without Jenkins:

```bash
# Point kubectl at your EKS cluster
aws eks update-kubeconfig --region eu-north-1 --name demo-ekscluster

# Confirm connectivity
kubectl get nodes

# Apply the manifests
kubectl apply -f k8s/

# Watch the rollout
kubectl rollout status deployment/node-app-deployment
```

---

### 5. Verify the Deployment

```bash
kubectl get deployments
kubectl get pods -o wide
kubectl get svc node-app-service
```

Once the `node-app-service` LoadBalancer gets an external address (`EXTERNAL-IP`), open it in a browser:

```bash
kubectl get svc node-app-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## 🌐 Application Endpoints

| Route | Method | Description |
|---|---|---|
| `/` | GET | Renders the animated CI/CD status dashboard page |
| `/health` | GET | Returns JSON health status — useful for readiness/liveness probes |

Example `/health` response:

```json
{
  "status": "UP",
  "application": "CloudBlitz DevOps CI/CD Demo",
  "environment": "Production",
  "timestamp": "2026-07-17T10:00:00.000Z"
}
```

---

## ☸ Kubernetes Manifests Explained

**`k8s/deployment.yaml`**
- Deploys **2 replicas** of the app for basic high availability.
- Uses the image `ayushkamble820/node-app:latest` (updated automatically by the pipeline).
- Sets resource **requests** (100m CPU / 128Mi memory) and **limits** (500m CPU / 512Mi memory) to keep the pod well-behaved on shared cluster nodes.
- `imagePullPolicy: Always` ensures the latest pushed image is always pulled.

**`k8s/service.yaml`**
- A `LoadBalancer` type Service exposing the app externally on port `80`, forwarding to container port `3000`.
- On EKS this provisions an AWS Network/Classic Load Balancer automatically.

> 🔧 Tip for your portfolio: since you're already comfortable with EKS Auto Mode and NLB troubleshooting from your retail-store-app work, you could extend this project with an `Ingress` + target-group health check annotations to demonstrate that skill here too.

---

## 🔩 Jenkinsfile Stages Explained (`cdec-52-53.groovy`)

| Stage | What it does |
|---|---|
| **Checkout** | Pulls the `main` branch from this repo |
| **Verify Environment** | Prints Node, npm, Docker, kubectl, and AWS CLI versions for debugging |
| **Install Dependencies** | Runs `npm install` |
| **Run Tests** | Runs `npm test` (see [Testing](#-testing)) |
| **Build Docker Image** | Builds and tags the image with the Jenkins build number |
| **Docker Login** | Authenticates to Docker Hub using stored credentials |
| **Push Docker Image** | Pushes both the versioned tag and `latest` |
| **Update Kubernetes Manifest** | Uses `sed` to rewrite the image line in `k8s/deployment.yaml` |
| **Deploy to Amazon EKS** | Updates kubeconfig, then runs `kubectl apply -f k8s/` and prints nodes/pods/services |

The `post` block reports success/failure and always cleans the Jenkins workspace afterward.

---

## 🧪 Testing

The test suite (`tests/app.test.js`) is a minimal sanity check used to prove the CI test stage works:

```bash
npm test
```

It simply verifies basic arithmetic and exits with code `0` on success or `1` on failure — a placeholder you can replace with real `supertest`/`jest` tests against the `/` and `/health` routes as the project matures.

---

## 🩺 Troubleshooting

- **Webhook not triggering builds** → confirm the Jenkins URL is reachable from GitHub and the webhook shows a green checkmark under recent deliveries.
- **`docker login` fails in Jenkins** → recheck the `docker-hub-creds` credential ID matches exactly what's referenced in the pipeline.
- **`kubectl apply` fails with auth errors** → make sure the `aws-creds` credential has `eks:DescribeCluster` and appropriate IAM permissions, and that your IAM principal is mapped in the cluster's `aws-auth` ConfigMap (or access entries, if using EKS Auto Mode).
- **LoadBalancer stuck in `Pending`** → check that your cluster's VPC has public subnets tagged for load balancer discovery, and that the service controller (AWS Load Balancer Controller, or EKS Auto Mode's built-in support) is running correctly.

---

## 👤 Author

**Ayush Kamble**
CloudBlitz DevOps Internship Project — built to demonstrate a full Node.js → Docker → Kubernetes (Amazon EKS) CI/CD workflow.

GitHub: [@ayushhkamble](https://github.com/ayushhkamble)
