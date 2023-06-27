# Trash AI: Web application for serverless image classification of trash

[![Website](https://img.shields.io/badge/Web-TrashAI.org-blue)](https://www.trashai.org)
[![status](https://joss.theoj.org/papers/6ffbb0f89e6c928dad6908a02639789b/status.svg)](https://joss.theoj.org/papers/6ffbb0f89e6c928dad6908a02639789b)

### Project Information

-   Sponsor: Win Cowger, [Moore Institute for Plastic Pollution Research](https://mooreplasticresearch.org/)
-   Meeting Times: Wednesdays at 6:30pm PT [Weekly Brigade Meetings](https://www.meetup.com/code4sac/)
-   Publication Pending: [paper.md](paper.md)

### Project Summary

Trash AI is a web application where users can upload photos of litter, which will be labeled using computer vision to detect and categorize litter in the image by type. Early inspiration from [WADE AI](https://github.com/letsdoitworld/wade-ai) streamlined this development. Trash AI will enhance the abilities of researchers to quickly label trash in photos.

#### Demo

[![image](https://user-images.githubusercontent.com/26821843/188515526-33e1196b-6830-4187-8fe4-e68b2bd4019e.png)](https://youtu.be/HHrjUpQynUM)

## Deployment

You can simply go to www.trashai.org to start using the tool or deploy it yourself. Current self-deployment options are local deployment with docker to remote on Amazon Web Services (AWS).

### [Run Local Docker Instance](https://hub.docker.com/r/code4sac/trashai)

```
docker run -p 5150:5150 -it code4sac/trashai:latest
```

Navigate to http://localhost:5150

If you are attempting to run on an Apple Silicon device, you might get the following error:

`docker: no matching manifest for linux/arm64/v8 in the manifest list entries.`

This can be remedied by specifying the build platform.

```
docker run --platform linux/x86_64 -p 5150:5150 -it code4sac/trashai:latest
```

### Deploy to Any Webserver

If you want to deploy this to a static web directory and serve it using
`apache` or `nginx`, you can do so with the following command using `/var/www/html`
as an example destination directory.

```
# create container from latest public trash ai docker image
id=$(docker create code4sac/trashai:latest)

# copy the static files
docker cp $id:/usr/share/nginx/html /var/www/html

# remove created container
docker rm -v $id
```

### [Local Development](./docs/localdev.md)

-   Run the environment live with localstack and docker.

### [AWS Deployment](./docs/git-aws-account-setup.md)

-   Instructions on bringing up a new AWS deployment.

#### [Continuous Integration and Continuous Delivery (CI/CD) - Github Actions](./docs/github-actions.md)

-   Mostly CD at this point.

#### [Github Actions AWS Deployment Role](./docs/github-actions-deployment-role.md)

-   Runs the complex stuff so you don't have to.

### Tests
Instructions for automated and manual tests [here](https://github.com/code4sac/trash-ai/tree/production/frontend/__tests__). 

## Contribute

We welcome contributions of all kinds.

To get started, look at the `Start Here` section of the [project board](https://github.com/orgs/code4sac/projects/13)

You can open an [issue](https://github.com/code4sac/trash-ai/issues) or [pull request](https://github.com/code4sac/trash-ai/pulls).

Here are some ideas on [How to Contribute](https://opensource.guide/how-to-contribute/).

Please adhere to this project's [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
