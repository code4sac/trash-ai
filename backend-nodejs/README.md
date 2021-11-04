[Main](../README.md)
# Webapp Boilerplate (backend)
This repository goes with [webapp-boilerplate-frontend](https://github.com/josephmfaulkner/webapp-boilerplate-frontend)


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