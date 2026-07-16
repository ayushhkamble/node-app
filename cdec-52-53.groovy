pipeline {
    agent any

    environment {
        DOCKER_REPO = "ayushkamble820"
        IMAGE_NAME = "node-app"
        AWS_REGION = "eu-north-1"
        EKS_CLUSTER = "demo-ekscluster"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ayushhkamble/node-app.git'
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                echo "===== Environment ====="

                echo "Node Version"
                node -v

                echo "NPM Version"
                npm -v

                echo "Docker Version"
                docker --version

                echo "Kubectl Version"
                kubectl version --client

                echo "AWS CLI Version"
                aws --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${DOCKER_REPO}/${IMAGE_NAME}:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASSWORD" | docker login \
                    -u "$DOCKER_USERNAME" \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push ${DOCKER_REPO}/${IMAGE_NAME}:${BUILD_NUMBER}

                docker tag ${DOCKER_REPO}/${IMAGE_NAME}:${BUILD_NUMBER} \
                ${DOCKER_REPO}/${IMAGE_NAME}:latest

                docker push ${DOCKER_REPO}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                sh '''
                sed -i "s|image: .*|image: ${DOCKER_REPO}/${IMAGE_NAME}:${BUILD_NUMBER}|g" k8s/deployment.yaml

                echo "Updated Deployment YAML"

                cat k8s/deployment.yaml
                '''
            }
        }

        stage('Deploy to Amazon EKS') {
            steps {

                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds']
                ]) {

                    sh '''
                    echo "Updating kubeconfig..."

                    aws eks update-kubeconfig \
                    --region ${AWS_REGION} \
                    --name ${EKS_CLUSTER}

                    echo "Connected Cluster"

                    kubectl get nodes

                    echo "Deploying Application"

                    kubectl apply -f k8s/

                    kubectl rollout status deployment/node-app-deployment

                    kubectl get deployments

                    kubectl get pods -o wide

                    kubectl get svc
                    '''
                }
            }
        }
    }

    post {

        success {
            echo "Application Successfully Deployed to Amazon EKS"
        }

        failure {
            echo "Pipeline Failed"
        }

        always {
            cleanWs()
        }
    }
}