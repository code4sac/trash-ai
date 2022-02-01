FROM node:14.18-buster

# Set this to whatever your local user id is
ENV USER_ID=1000
ENV USER=node

RUN grep ${USER_ID} /etc/passwd || \
    adduser -u ${USER_ID} ${USER}


RUN apt update
RUN apt install -y python3-pip
RUN pip3 install awscli-local localstack-client "boto3<2" awscli aws-cdk-lib

WORKDIR  /home/${USER}
RUN ln -s /home/${USER}/node_modules /
USER  ${USER}
COPY infra/package.json .
RUN yarn

RUN mkdir -p ~/.aws
RUN echo "[localstack]" >> ~/.aws/credentials
RUN echo "aws_access_key_id = AAAAAAAAAAAAAAAAAAAA" >> ~/.aws/credentials
RUN echo "aws_secret_access_key = XXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/XX" >> ~/.aws/credentials
RUN echo "region = us-east-2" >> ~/.aws/credentials
