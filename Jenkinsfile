pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/home/ubuntu/microservices"
        EC2_HOST = "3.111.37.229"
        EC2_USER = "ubuntu"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

    stage('Inject .env files') {
      steps {
        // 🔑 Ensure Jenkins has ownership + write permission on all files in workspace
        sh '''
            sudo chown -R jenkins:jenkins ${WORKSPACE}
            sudo chmod -R 775 ${WORKSPACE}
        '''
        // Example for one service; repeat for each service with its credential id
        withCredentials([file(credentialsId: 'auth-service-env-file', variable: 'AUTH_ENV')]) {
          sh 'cp $AUTH_ENV services/auth-service/.env'
        }
        withCredentials([file(credentialsId: 'api-gateway-env-file', variable: 'GATEWAY_ENV')]) {
          sh 'cp $GATEWAY_ENV api-gateway/.env'
        }
        withCredentials([file(credentialsId: 'admin-portal-env-file', variable: 'ADMIN_ENV')]) {
          sh 'cp $ADMIN_ENV admin-portal/.env'
        }
        withCredentials([file(credentialsId: 'client-store-service-env-file', variable: 'CLIENT_ENV')]) {
          sh 'cp $CLIENT_ENV services/client-store-service/.env'
        }   
        withCredentials([file(credentialsId: 'rider-service-env-file', variable: 'RIDER_ENV')]) {
          sh 'cp $RIDER_ENV services/rider-service/.env'
        }
        withCredentials([file(credentialsId: 'vehicle-service-env-file', variable: 'VEHICLE_ENV')]) {
          sh 'cp $VEHICLE_ENV services/vehicle-service/.env'
        }
        withCredentials([file(credentialsId: 'spare-parts-service-env-file', variable: 'SPARE_ENV')]) {
          sh 'cp $SPARE_ENV services/spare-parts-service/.env'
        }
      }
    }
    

    stage('Update Changed Services Only') {
            steps {
                script {
                    def commitCount = sh(
                        script: "git rev-list --count HEAD",
                        returnStdout: true
                    ).trim().toInteger()

                    def changedFiles = []
                    if (commitCount > 1) {
                        changedFiles = sh(
                            script: "git diff --name-only HEAD~1 HEAD",
                            returnStdout: true
                        ).trim().split("\n")
                    } else {
                        echo "🚀 First build detected – syncing all folders"
                        changedFiles = sh(
                            script: "git ls-tree --name-only -r HEAD",
                            returnStdout: true
                        ).trim().split("\n")
                    }

                    def changedFolders = [] as Set
                    for (file in changedFiles) {
                        if (file.contains("/")) {
                            def folder = file.split("/")[0]   // e.g., Admin-portal or service
                            changedFolders.add(folder)
                        }
                    }

                    echo "📂 Updated folders: ${changedFolders}"

                    for (folder in changedFolders) {
                        echo "🔄 Updating folder: ${folder}"
                        sh """
                            mkdir -p ${DEPLOY_DIR}/${folder}
                            rsync -av --delete ${WORKSPACE}/${folder}/ ${DEPLOY_DIR}/${folder}/
                        """
                    }
                }
            }
        }
        
        
        stage('Sync All Service/App Files') {
            steps {
                script {
                    def allFolders = [
                        "apps/admin-portal",
                        "apps/api-gateway",
                        "services/auth-service",
                        "services/client-store-service",
                        "services/rider-service",
                        "services/spare-parts-service",
                        "services/vehicle-service"
                    ]
                    allFolders.each { folder ->
                        sh """
                            mkdir -p ${DEPLOY_DIR}/${folder}
                            rsync -av --delete ${WORKSPACE}/${folder}/ ${DEPLOY_DIR}/${folder}/
                        """
                    }
                }
            }
        }

        stage('Copy Root Files') {
            steps {
                sh """
                    cp ${WORKSPACE}/docker-compose.yml ${DEPLOY_DIR}/
                    cp ${WORKSPACE}/nginx.conf ${DEPLOY_DIR}/
                """
            }
        }

        stage('Cleanup Jenkins Workspace') {
            steps {
                echo "Cleaning Jenkins workspace..."
                cleanWs()  // Automatically cleans everything in Jenkins job workspace
            }
        }
    }
}
