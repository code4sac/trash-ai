# Trash AI: Web application for serverless image classification of trash
[![Website](https://img.shields.io/badge/Web-TrashAI.org-blue)](https://www.trashai.org)


### Project Information

-   Sponsor: Win Cowger, [Moore Institute for Plastic Pollution Research](https://mooreplasticresearch.org/)
-   Meeting Times: Wednesdays at 6:30pm PT [Weekly Brigade Meetings](https://www.meetup.com/code4sac/)

### Project Summary

Trash AI is a web application where users can upload photos of litter which will be labeled using computer vision to detect and categorize litter in the image by type. Trash AI will enhance the abilities of researchers to quickly label trash in photos.

#### Demo
[![image](https://user-images.githubusercontent.com/26821843/188515526-33e1196b-6830-4187-8fe4-e68b2bd4019e.png)](https://youtu.be/HHrjUpQynUM)

## Deployment

You can simply go to www.trashai.org to start using the tool or deploy it yourself. Current self-deployment options are local deployment with docker to remote on Amazon Web Services (AWS). 

### [Local Development](./docs/localdev.md)

- Run the environment live with localstack and docker.

### [AWS Deployment](./docs/git-aws-account-setup.md)

- Instructions on bringing up a new AWS deployment.

#### [Continuous Integration and Continuous Delivery (CI/CD) - Github Actions](./docs/github-actions.md)

- Mostly CD at this point.

#### [Github Actions AWS Deployment Role](./docs/github-actions-deployment-role.md)

- Runs the complex stuff so you don't have to.

## Contribute
We welcome contributions of all kinds. To get started, open an [issue](https://github.com/code4sac/trash-ai/issues) or [pull request](https://github.com/code4sac/trash-ai/pulls). Here are some ideas on [How to Contribute](https://opensource.guide/how-to-contribute/). Please adhere to this project's [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
