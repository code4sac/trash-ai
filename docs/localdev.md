# Local Development

When doing local development, you can run this stack in the background and
edit files in the `/backend` and `/frontend` directories and the environment
with automatically update.

The listening port for the web frontend defaults to `http://localhost:5150`,
The backend is exposed via `http://localhost:4000` by default.

These values can be adjusted by editing the localdev env file [.env](../localdev/.env)

---

## _*IMPORTANT*_

It's suggested you work in branch `local` when developing
Pushing / merging PR's to any branches with a prefix of `aws/` will trigger deployment actions

---

## Operating System Requirements

-   Linux
-   MacOS (need testing)

## Software Requirements

-   docker ce
    -   ubuntu/debian: https://docs.docker.com/engine/install/ubuntu/
    -   mac: https://docs.docker.com/desktop/mac/install/
-   docker-compose (`>3.7`) [Instructions](https://docs.docker.com/compose/install/)

---

## Optional Software

-   gnu make
    -   ubuntu/debian: `apt-get install build-essential`
    -   mac: `brew install make`

## Running the dev environment

### Using make in project root:

```
make local
```

---

### Using the shell:

```
cd localdev
# need to make sure the containers are down before starting
docker-compose down
docker-compose up --remove-orphans --build
# down stack
docker-compose down
```
