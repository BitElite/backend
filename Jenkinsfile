pipeline{
    
    agent {
        label '!windows'
    }
    

    stages{
        
       
        stage("Authenticate"){ 
            steps{
                 withCredentials([file(credentialsId: 'secret', variable: 'GC_KEY')]) {
                    sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
                    sh("gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin asia-south1-docker.pkg.dev")
             }
            }
        } 
        
        stage("Docker Build"){
            steps{
                script {
                    if(env.GIT_BRANCH == 'origin/main'){
                        sh("docker build -t asia-south1-docker.pkg.dev/jiox-328108/pie-docker-development/pie-headline .")
                        sh("docker push asia-south1-docker.pkg.dev/jiox-328108/pie-docker-development/pie-headline")
                    }
                }
            }
        }
        
        stage('Restart Microservice'){
            steps{
                script {
                    
                   if(env.GIT_BRANCH == 'origin/main'){
                        sh("gcloud container clusters get-credentials pie-development --region=asia-south1-a")
                        sh("kubectl apply -f k8s/development")
                        sh("kubectl rollout restart deployment pie-headline -n pie-development")
                    }
                }
            }            
        }
    }
    
    post{
        always{
             script{
                    sh("docker system prune --force --all --volumes")
            }
        }
    }
}