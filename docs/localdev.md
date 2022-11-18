# Local Development

When doing local development, you can run this stack in the background and
edit files in the `/backend` and `/frontend` directories and the environment
with automatically update.

The listening port for the web frontend defaults to `http://localhost:5150`,
The backend is exposed via `http://localhost:4000` by default.

These values can be adjusted by editing the localdev env file [.env](../localdev/.env)

---

## _*IMPORTANT*_

Pushing / merging PR's to any branches with a prefix of `aws/` will
trigger deployment actions, when developing locally, create a new branch
and submit a pull request to `aws/trashai-staging`

---
# Set up 

## Operating System Requirements

-   Linux
-   MacOS (testing)
-   Windows using [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

## 1. Install Required Software
-   docker ce
    -   ubuntu/debian: https://docs.docker.com/engine/install/ubuntu/
    -   mac: https://docs.docker.com/desktop/mac/install/
    -   windows: https://docs.docker.com/desktop/install/windows-install/
        - If prompted to do so, download and install the Linux kernel update package. Complete steps 4-6 in the linked article.  
- docker-compose [Instructions](https://docs.docker.com/compose/install/)
    - Docker-compose file version `>3.7` are supported
    - For MacOS, use docker-compose version 1.x
    ```shell
     $ docker-compose disable-v2
     ```
    - For Windows Take note of docker-compose installation (installing through apt may not install the correct version)

### Optional Software

-   gnu make
    -   ubuntu/debian/wsl2: `apt-get install build-essential`
    -   mac: `brew install make`

## 2. Configure Software
- Windows:
    -   WSL Integration on Ubuntu must be enabled in Docker options -> Resources -> WSL Integration

## 3. Install repo
- Windows:
    -   Repo must be inside Ubuntu (i.e. ~/code/trash-ai)

---

## Running the dev environment

### Using make in project root:

```
make local
```
    -   Make local must be run from a WSL (Ubuntu) terminal

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
