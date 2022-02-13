FROM node:16.12.0

RUN mkdir -p /asset-output /builder

RUN apt-get update && apt-get install -y zip

COPY . /builder
WORKDIR /builder
RUN yarn
