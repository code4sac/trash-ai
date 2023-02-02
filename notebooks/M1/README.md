## Training and tweaking an AI trash classification model using YoloV5 and the TACO dataset
The purpose of this repo is to provide instructions for training the yolov5 model (https://github.com/ultralytics/yolov5) on the TACO dataset (http://tacodataset.org/) on a local machine--in my case, a MacBook Air 2020 M1.  *(See **NOTE** at end of README.)*

### Background
I became aware of the TrashAI project through the California Water Data Challenge and Code4Sacramento.  The project is being developed in partnership with Win Cowger from The Moore Institute for Plastic Pollution Research and Walter Yu from CALTRANS.  Steven Hollingsworth is the lead developer and contributor to the code base.  

For more information on TrashAI, please check out the home page at https://www.trashai.org/ and the project github repo at https://github.com/code4sac/trash-ai!

### What's in this repo?
The repo contains a requirements list for setting up the environment and a modified version of the trash-ai notebook enabled to run on my computer.  The notebook will download the yolov5 model, the TACO dataset, and other required dependencies for the project. 

### Primary packages required for initial environment setup 
It's good practice to create an environment specifically for this project and use a dependency manager to install these packages.  I set up an environment using conda and used conda (and pip, where necessary) to install these packages. 
- Python 3.8.6
- PyTorch (I installed a version that can leverage MacBook M1 GPUs; instructions for PyTorch installations can be found at https://pytorch.org/get-started/locally/)
- Matplotlib
- Numpy
- Pandas
- Jupyter
- Tensorboard
- Tensorflowjs

### Taco.yaml file
The file taco.yaml is required to run the model.  After cloning and installing yolov5, it will be necessary to place the taco.yaml file in the yolov5 folder.  Please be sure to do this after the step where the notebook clones and installs the yolov5 model and files.

### NOTE:  Why would anyone want to train this model on their local machine, with all of the cloud-based options available these days?
Well, call me 'old school', but I like being able to set up and run models on my own machine.  For more computationally- and data-intensive modeling, I will use Google Colab, Kaggle, or another available cloud-based ML tool, but there are at least 3 reasons why I like to set things up locally first:
1.  I like the challenge of setting up the environment and getting all of the dependencies to work properly to run the model
2.  I feel that it's easier to test code modifications on my local machine, rather than being reliant on a cloud-based option that might kick me off and potentially losing my work or modeling progress
3.  Finally, I'm always curious to see how well my machine will perform running certain types of models, with or without leveraging the MacBook GPUs

