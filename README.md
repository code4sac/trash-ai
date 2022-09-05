## AI for Litter Detection (Web Application)

### Project Information

-   Sponsor: Win Cowger, UC Riverside - Trash Data Projects
-   Meeting Times: Wednesdays at 6:30pm (Weekly Brigade Meetings)

### Project Summary

Trash AI is a web application where users can upload photos of litter which will be labeled using computer vision to detect and categorize litter in the image by type. Trash AI will enhance the abilities of researchers to quickly label trash in photos.

## Deployment

You can simply go to www.trashai.org to start using the tool or deploy it yourself. Current self-deployment options are local deployment with docker to remote on Amazon Web Services (AWS). 

### [Local Development](./docs/localdev.md)

Run the environment live with localstack and docker.

### [AWS Deployments](./docs/git-aws-account-setup.md)

Instructions on bringing up a new AWS deployment.

#### [Continuous Integration and Continuous Delivery (CI/CD) - Github Actions](./docs/github-actions.md)

Mostly CD at this point.

#### [Github Actions AWS Deployment Role](./docs/github-actions-deployment-role.md)

Runs the complex stuff so you don't have to.
