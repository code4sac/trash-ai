## Deploy to Heroku
```
heroku create
heroku addons:create heroku-postgresql:hobby-dev
git push heroku master
```

## Local DB Development
**Open PG Admin:** [localhost:8080](localhost:8080), **PW:** password

**Add DB to PG Admin:** Servers > Create > Server

### Connection: 
**Host name :** db; **Port :** 5432; **Username :** postgres; **Password :** postgres