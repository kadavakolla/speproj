pipeline {
    agent any
    environment {
       FRONTEND_URL='http://localhost:3000'
       MONGODB_URI='mongodb+srv://kadavakollagowthamreddy:gowthamreddy@chat-app.st4mb.mongodb.net/?retryWrites=true&w=majority&appName=chat-app'
       JWT_SECRET_KEY='jhdcjhsdvchjsdhbfasdgbvs'
       REACT_APP_CLOUDINARY_CLOUD_NAME = 'dpc7fwkte'
       REACT_APP_BACKEND_URL = 'http://localhost:8081'
       PORT='8081'
    }
    stages {
        stage('Clone Git') {
            steps {
                git branch: 'main', url: 'https://github.com/kadavakolla/speproj.git'
            }
        }
        stage('Build Frontend Image') {
            steps {
                dir('client'){
                sh "npm install"
                sh 'docker build -t frontend-image .'
            }
            }
        }
        stage('Build Backend Image') {
            steps {
                dir('server'){
                sh "npm install"
                sh 'docker build -t backend-image .'
            }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                        sh "docker login --username gangster569 --password Gowtham@569"
                        sh 'docker tag frontend-image gangster569/frontend-image:latest'
                        sh 'docker push gangster569/frontend-image:latest'
                        sh "docker tag backend-image gangster569/backend-image:latest"
                        sh "docker push gangster569/backend-image:latest"
                    
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'ansible-galaxy collection install kubernetes.core'
                }
            }
        }
        stage('Docker Compose') {
            steps {
                script {
                    sh 'sudo -u jenkins ansible-playbook -i inventory playbook.yml'
                }
            }
        }
    }
}