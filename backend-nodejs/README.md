[Main](../README.md)
# Webapp Boilerplate (backend)
This repository goes with [webapp-boilerplate-frontend](https://github.com/josephmfaulkner/webapp-boilerplate-frontend)

# Requirements
- [NodeJs, 16 or higher](https://nodejs.org/en/download/)
- Docker (optional)
- Configured [AWS CLI](https://aws.amazon.com/cli/) or have the following in your enviornment
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_KEY


# Installing
- npm i
- cp .env.dist .env, modify the AWS_BUCKET_NAME

# Starting the web server
- npm start

Note: the server runs on port 3080


## Deploying to Heroku
Instructions for deploying this app to Heroku can be found [by clicking here](./infrastructure/README.md)


## Local DB Development
```
docker-compose up
```
In another terminal
```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
**Open PG Admin:** [localhost:8080](localhost:8080), **PW:** password

**Add DB to PG Admin:** Servers > Create > Server

### Connection: 
**Host name :** db; **Port :** 5432; **Username :** postgres; **Password :** postgres