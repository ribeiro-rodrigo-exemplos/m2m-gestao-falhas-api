# m2m-dataespecial-api
FROM m2msolutions-docker.jfrog.io/node-8-alpine:1.0.0
LABEL MAINTAINER="Luiz Henrique Leal Machado <luiz.machado@m2msolutions.com.br>"

#Setting enviroment default-context 
ENV ENV_RUN DEV
ENV PROJECT m2m-forecast-api

ENV GIT_URL ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/

# Adding 
ADD . /opt/m2m-node-app
RUN npm install