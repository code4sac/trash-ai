---
title: 'Trash AI: A Web GUI for Serverless Computer Vision Analysis of Images of Trash'
tags:
  - tensorflow.js
  - IndexDB
  - Plastic Pollution
  - Trash
  - Litter
  - AI
  - Image Classification
  - Serverless
  - vue
  - vuetify
  - vite
  - pinia
authors:
  - name: Win Cowger
    orcid: 0000-0001-9226-3104
    affiliation: 1 # (Multiple affiliations must be quoted)
  - name: Steven Hollingsworth
    corresponding: true # (This is how to denote the corresponding author)
    affiliation: 2
  - name: Day Fey
    affiliation: 2
  - name: Mary C Norris
    affiliation: 2
  - name: Walter Yu
    affiliation: 3
  - name: Kristiina Kerge
    affiliation: 4
  - name: Kris Haamer
    affiliation: 4
  - name: Gina Durante
    affiliation: 2
  - name: Brianda Hernandez
    affiliation: 2
affiliations:
 - name: Moore Institute for Plastic Pollution Research, USA
   index: 1
 - name: Code for Sacramento and Open Fresno, USA
   index: 2
 - name: California Department of Transportation, USA
   index: 3
 - name: Let's Do It Foundation, Estonia
   index: 4
date: 1 September 2022
bibliography: paper.bib

---

# Summary

Although computer vision classification routines have been created for trash, they have not been accessible to most researchers due to the challenges in deploying the models. Trash AI is a web GUI (Graphical User Interface) for serverless computer vision classification of batch images with trash in them hosted at www.trashai.org. With a single batch upload and download, a user can automatically describe the types and quantities of trash in all of their images. 

# Statement of need

The trash in the environment is a widespread problem that is difficult to measure. Trash is a rather complicated object to detect. Imagine a restaurant table with cans of soda on it, people having fun, eating and drinking. In that context, cans are not trash. BUT, when those cans are on the street, they can most likely be considered trash. This is the main challenge with any image-based trash detection algorithm. Not everything that LOOKS like trash IS trash. Trash is a word people use of an object that lacks purpose, and the purpose of an object is often not obvious in the images for an algorithm to spot trash.

Classical measurement techniques require surveyors with pen and paper to manually quantify every piece of trash at a site. This method is time-consuming. Scientists are actively trying to address this issue by using imaging to better understand the prevalence and distribution of trash in an `efficient yet effective manner` [@Majchrowska:2022; @Proença:2020; @Moore:2020; @vanLieshout:2020; @WADEAI:2020; @Lynch:2018; @Wuu:2018; @Waterboards:2018]. 

Data exist independently of their use, data to which we pay attention will influence policy making processes and citizens actions. By making accessible tool for scientist, we can empower their research. Three types of knowledge in waste data could be defined as such: 
Empirical-analytical – what kind of waste pollution can be encountered, where is it and what are its characteristics. 
Hermeneutic – interpreting the reasons behind the pollution. The reasons can vary – anything from historical (e.g. we have always done so) to political (e.g. littering as an act of defiance against the government). 
Critical – perhaps the most important and difficult tire of the data. Understanding the journey of a material requires a thorough understanding of the context – how does anything become waste and end up as pollution?

An app-based reporting of trash using cell phones, laptops, and other devices has been a `valuable solution` [@Lynch:2018]. The resource intensiveness of relying on citizens for identification, assessment and mapping trash with cell phones greatly limits data collection and analyses scalability. 

Applications for AI in detecting trash currently include: images from `bridges` [@vanLieshout:2020], `drone imaging` [@Moore:2020], cameras on `street sweepers` [@Waterboards:2018], and cell phone app based reporting of `trash` [@Lynch:2018]. Although there are many artificial intelligence algorithms developed for trash classification, none are readily accessible to the average litter researcher. The primary limitation is that artificial intelligence (AI) algorithms are primarily run through programming languages (not graphic user interfaces), difficult to deploy without AI expertise, and often live on a server (which costs money to host). New developments in browser-side AI (e.g. tensorflow.js) and serverless architecture (e.g. AWS Lambda) have created the opportunity to have affordable browser-side artificial intelligence in a web GUI alleviating both obstacles. We present Trash AI, an open source service for making computer vision available to anyone with a web browser and images of trash. 

# Demo
We have a full video tutorial on [Youtube](https://youtu.be/HHrjUpQynUM)

## Basic workflow:
### 1.  

![Upload images by dragging onto the screen.\label{fig:example1}](https://user-images.githubusercontent.com/26821843/188520590-86d7b0b3-1b40-4ce5-8fb0-1be54b2de20e.png)

### 2.  

![View results while images are processing.\label{fig:example2}](https://user-images.githubusercontent.com/26821843/188520700-43f4c964-c430-4a78-843b-68ae7aae2ba2.png)

### 3. 

![View summary results of detected trash.\label{fig:example3}](https://user-images.githubusercontent.com/26821843/188520723-92b50200-d568-4953-aa26-fbcbbd965a38.png)

### 4. 

![View results mapped if your images have location stamp.\label{fig:example4}](https://user-images.githubusercontent.com/26821843/188520745-65ef3270-6093-488a-b501-305ecb436bc1.png)

### 5. 

![Click download all to extract a zip folder with labeled images and metadata.\label{fig:example5}](https://user-images.githubusercontent.com/26821843/188520813-f9169ba9-14d9-4f11-bf53-a6fd8e379cdf.png)

### 6.  

![View labeled images from downloaded results.\label{fig:example6}](https://user-images.githubusercontent.com/26821843/188520833-d313279d-b2d0-4d37-ac0b-670ce3252540.png)

### 7. 

![View metadata for each image using "image_hash.json" (using https://jsoneditoronline.org/).\label{fig:example7}](https://user-images.githubusercontent.com/26821843/188520860-629c529d-dc5e-4e93-9beb-b65e4560bc13.png)

### 8. 

![View metadata for all images in "summary.json" (using https://jsoneditoronline.org/).\label{fig:example8}](https://user-images.githubusercontent.com/26821843/188520906-3061ecce-cb0e-4c76-9b81-303731110380.png)

# Method

## Workflow Overview
Trash AI is trained on the [TACO dataset](http://tacodataset.org/) using [YOLO 5](pytorch.org). Trash AI stores images in [IndexDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to keep the data primarily browser side and uses [tensorflow.js](https://www.tensorflow.org/js) to keep analysis browser side too. When images are uploaded to the browser, Trash AI provides the prediction of the model as a graphical output. The raw data from the model and labeled images can be downloaded in a batch download to expedite analyses. Any data uploaded to the platform may be automatically saved to an [S3 bucket](https://aws.amazon.com/s3/) which we can use to improve the model over time.

## AI Training
The AI model was developed starting with the TACO dataset which was available with a complimentary Jupyter Notebook on [Kaggle](https://www.kaggle.com/datasets/kneroma/tacotrashdataset). An example notebook was referenced which used the default `YOLO v5 model` [@Jocher:2020] as the basic model to begin transfer learning. Next, transfer learning was completed using the entire TACO dataset to import the image classes and annotations in the YOLO v5 model.

## Limitations
From our experience, the accuracy of the model varies depending on the quality of the images and their context/background. Trash is a nuanced classification because the same object in different settings will not be considered trash (e.g. a drink bottle on someone's desk vs in the forest laying on the ground). This and other complexities to trash classification make a general trash AI a challenging (yet worthwhile) long term endeavor. The algorithm is primarily trained on single pieces of trash in the image with the trash laying on the ground and the model will likely excel for that use case currently. Additionally, user feedback has shows that the distance of trash from the camera is a critical aspect. The model performs ideally with single pieces of trash in an image less than 1 m away. The model performs less accurately on images when trash which is farther away such as when taken from a vehicle. This is likely due to the training data, TACO dataset, which consists primarily of images of trash close to the camera.

# Availability
Trash AI is hosted on the web at www.trashai.org. The source code is [available on github](https://github.com/code4sac/trash-ai) with an [MIT license](https://mit-license.org/). The source code can be run offline on any machine that can install [Docker and Docker-compose](www.docker.com). [Documentation](https://github.com/code4sac/trash-ai#ai-for-litter-detection-web-application) is maintained by Code for Sacramento and Open Fresno on Github and will be updated with each release. [Nonexhaustive instructions for AWS deployment](https://github.com/code4sac/trash-ai/blob/manuscript/docs/git-aws-account-setup.md) is available for anyone attempting production level deployment. The image datasets shared to the tool are in an S3 Bucket that needs to be reviewed before being shared with others due to security and moderation concerns but can be acquired by [contacting the repo maintaniers](https://github.com/code4sac/trash-ai/graphs/contributors). 

# Future Goals
This workflow is likely to be highly useful for a wide variety of computer vision applications and we hope that people reuse the code for applications beyond trash detection. We aim to increase the labeling of images by creating a user interface that allows users to improve the annotations that the model is currently predicting by manually restructuring the bounding boxes and relabeling the classes. We aim to work in collaboration with the TACO development team to improve our workflow integration to get the data that people share to our S3 bucket into the [TACO training dataset](http://tacodataset.org/) and trained model. Future models will expand the annotations to include the `Trash Taxonomy` [@Hapich:2022] classes and add an option to choose between other models besides the current model.

# Acknowledgements
Code for Sacramento and Open Fresno led the development of the software tool. The Moore Institute advised on priorities and led the drafting of this manuscript. Let's Do It Foundation assisted with original products leading up to trash AI in the development of WADE AI. We acknowledge the work of the Code for Sacramento and Open Fresno team, brigades of code for America, without whom this project would not have been possible and acknowledge the input of the California Water Monitoring Council Trash Monitoring Workgroup. In particular we would like to acknowledge Joseph Falkner, Democracy Lab, Brad Anderson, Jim Ewald, Don Brower, University of Houston. We acknowledge financial support from McPike Zima Charitable Foundation.

# References
