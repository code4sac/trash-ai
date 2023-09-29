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
Although computer vision classification routines have been created for trash, they have not been accessible to most researchers due to the challenges in deploying the models. Trash AI is a web GUI (Graphical User Interface) for serverless computer vision classification of individual items of trash within images, hosted at www.trashai.org. With a single batch upload and download, a user can automatically describe the types and quantities of trash in all of their images. 

# Statement of need
Trash in the environment is a widespread problem that is difficult to measure. Policy makers require high quality data on trash to create effective policies. Classical measurement techniques require surveyors with pen and paper to manually quantify every piece of trash at a site. This method is time-consuming. Scientists are actively trying to address this issue by using imaging to better understand the prevalence and distribution of trash in an `efficient yet effective manner` [@Majchrowska:2022; @Proença:2020; @Moore:2020; @vanLieshout:2020; @WADEAI:2020; @Lynch:2018; @Wuu:2018; @Waterboards:2018]. Image-based reporting of trash using cell phones, laptops, and other devices has been a `valuable solution` [@Lynch:2018]. Applications for AI in detecting trash using imagery currently include: cameras mounted on `bridges` [@vanLieshout:2020], `drone imaging` [@Moore:2020], cameras on `street sweepers` [@Waterboards:2018], and cell phone app based reporting of `trash` [@Lynch:2018]. Although there are many artificial intelligence algorithms developed for trash classification, none are readily accessible to the average litter researcher. The primary limitation is that artificial intelligence (AI) algorithms are primarily run through programming languages (not graphic user interfaces), difficult to deploy without AI expertise, and often live on a server (which costs money to host). New developments in browser-side AI (e.g., tensorflow.js) and serverless architecture (e.g., AWS Lambda) have created the opportunity to have affordable browser-side artificial intelligence in a web GUI, alleviating both obstacles. We present Trash AI, an open source service for making computer vision available to anyone with a web browser and images of trash. 

# Demo
We have a full video tutorial on [Youtube](https://youtu.be/u0DxGrbPOC0)

## Basic workflow:
### 1.  

![Upload images by dragging onto the screen.\label{fig:example1}](https://user-images.githubusercontent.com/26821843/188520590-86d7b0b3-1b40-4ce5-8fb0-1be54b2de20e.png)

### 2.  

![View results while images are processing.\label{fig:example2}](https://user-images.githubusercontent.com/26821843/188520700-43f4c964-c430-4a78-843b-68ae7aae2ba2.png)

### 3. 

![View summary results of detected trash.\label{fig:example3}](https://user-images.githubusercontent.com/26821843/188520723-92b50200-d568-4953-aa26-fbcbbd965a38.png)

### 4. 

![View results mapped if the images have location stamp.\label{fig:example4}](https://user-images.githubusercontent.com/26821843/188520745-65ef3270-6093-488a-b501-305ecb436bc1.png)

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
Trash AI is trained on the [TACO dataset](http://tacodataset.org/) using [YOLO 5](https://pytorch.org/). Trash AI stores images in [IndexDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to keep the data primarily browser side and uses [tensorflow.js](https://www.tensorflow.org/js) to keep analysis browser side too. When images are uploaded to the browser, Trash AI provides the prediction of the model as a graphical output. The raw data from the model and labeled images can be downloaded in batch to expedite analyses. 

## AI Training
The AI model was developed starting with the TACO dataset, which was available with a complimentary Jupyter Notebook on [Kaggle](https://www.kaggle.com/datasets/kneroma/tacotrashdataset). An example notebook was referenced, which used the default `YOLO v5 model` [@Jocher:2020] as the basic model to begin transfer learning. Next, transfer learning was completed using the entire TACO dataset to import the image classes and annotations in the YOLO v5 model.

## Limitations
From our experience, the accuracy of the model varies depending on the quality of the images and their context/background. "Trash" is a word people use for an object that lacks purpose, and the purpose of an object is often not obvious in an image. Trash is a nuanced classification because the same object in different settings will not be considered trash (e.g., a drink bottle on someone's desk vs in the forest lying on the ground). This is the main challenge with any image-based trash detection algorithm. Not everything that LOOKS like trash IS trash. This and other complexities to trash classification make a general trash AI a challenging (yet worthwhile) long-term endeavor. The algorithm is primarily trained on the TACO dataset, which is composed of images of single pieces of trash, with the trash lying on the ground (< 1 m away). Thus, model class prediction of trash in these kinds of images will generally be better than trash appearing in aerial images or imaged from a vehicle, for example.

# Availability
Trash AI is hosted on the web at www.trashai.org. The source code is [available on GitHub](https://github.com/code4sac/trash-ai) with an [MIT license](https://mit-license.org/). The source code can be run offline on any machine that can install [Docker and Docker-compose](www.docker.com). [Documentation](https://github.com/code4sac/trash-ai#trash-ai-web-application-for-serverless-image-classification-of-trash) is maintained by Code for Sacramento and Open Fresno on GitHub and will be updated with each release. [Nonexhaustive instructions for AWS deployment](https://github.com/code4sac/trash-ai/blob/manuscript/docs/git-aws-account-setup.md) is available for anyone attempting production level deployment.

# Future Goals
This workflow is likely to be highly useful for a wide variety of computer vision applications and we hope that people reuse the code for applications beyond trash detection. We aim to increase the labeling of images by creating a user interface that allows users to improve the annotations that the model is currently predicting by manually restructuring the bounding boxes and relabeling the classes. We aim to work in collaboration with the TACO development team to improve our workflow integration to get additional data into the [TACO training dataset](http://tacodataset.org/) by creating an option for users to share their data. Future models will expand the annotations to include the `Trash Taxonomy` [@Hapich:2022] classes and add an option to choose between other models besides the current model. 

# Acknowledgements
Code for Sacramento and Open Fresno led the development of the software tool. The Moore Institute for Plastic Pollution Research advised on priorities and led the drafting of this manuscript. Let's Do It Foundation assisted with original products leading up to trash AI in the development of WADE AI. We acknowledge the work of the Code for Sacramento and Open Fresno team, brigades of Code for America, without whom this project would not have been possible, and acknowledge the input of the California Water Monitoring Council Trash Monitoring Workgroup. In particular, we would like to acknowledge Gary Conley, Tony Hale, Emin Israfil, Tom Novotny, Margaret McCauley, Julian Fulton, Janna Taing, Elizabeth Pierotti, Kevin Fries, J.Z. Zhang, Joseph Falkner, Democracy Lab, Brad Anderson, Jim Ewald, Don Brower, and University of Houston. We acknowledge financial support from McPike Zima Charitable Foundation, the National Renewable Energy Laboratory, and the Possibility Lab.

# References
