# Local Development

When doing local development, you can run this stack in the background and
edit files in the `/backend` and `/frontend` directories and the environment
with automatic update.

The listening port for the web frontend defaults to `http://localhost:5150`,
The backend is exposed via `http://localhost:4000` by default.

These values can be adjusted by editing the localdev env file [.env](../localdev/.env)

---

## _*IMPORTANT*_

It's suggested you work in branch `local` by creating your own local branch when developing
Pushing / merging PR's to any branches with a prefix of `aws/` will trigger deployment actions
For full functionality you will want to get a Google Maps API key and name it VITE_GOOGLE_MAPS_API_KEY, but it is not required
=======

Pushing / merging PR's to any branches with a prefix of `aws/` will
trigger deployment actions, when developing locally, create a new branch
and submit a pull request to `aws/trashai-staging`

---
# Set up 

## Operating System Requirements
-   Linux
-   MacOS (testing)
-   Windows using [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)
    -   WSL Integration on Ubuntu must be enabled in Docker options -> Resources -> WSL Integration
    -   Repo must be inside Ubuntu (i.e. ~/code/trash-ai)
    -   Make local must be run from a WSL (Ubuntu) terminal
    -   Take note of docker-compose installation (installing through apt may not install the correct version)

## 1. Install Required Software
-   docker desktop (or configure docker engine and docker-compose another way)
    -   ubuntu/debian: https://docs.docker.com/desktop/install/linux-install/
    -   mac: https://docs.docker.com/desktop/mac/install/
    -   windows: https://docs.docker.com/desktop/install/windows-install/
        - If prompted to do so, download and install the Linux kernel update package. Complete steps 4-6 in the linked article.  
     
### Optional Software
-   gnu make
    -   ubuntu/debian/wsl2: `apt-get install build-essential`
    -   mac: `brew install make`

## 2. Install repo
- Windows: Repo must be inside Ubuntu (i.e. ~/code/trash-ai)

```shell
cd ~/
mkdir code
cd code
git clone https://github.com/code4sac/trash-ai
```

---

## Running the local dev environment

### Option 1. Using make in project root:
-   Windows: Make local must be run from a WSL (Ubuntu) terminal
```shell
cd trash-ai
make local
```

---

### Option 2. Using the shell:
```shell
cd localdev
# need to make sure the containers are down before starting
docker-compose down
docker-compose up --remove-orphans --build
# down stack
docker-compose down
```
