# Setup local build

To setup for local training run the following. 
```
./run_notebook.sh
```

## What does it do exactly? 

`./run_notebook.sh` does two things. 

1. It runs the docker-compose.yaml, this does several things:

    - `tacodataset:` downloads the `tacotrashdataset.zip` into the local folder.
    - `yolov5-taco:` downloads the `yolov5-taco.zip` into the local folder.
    - `notebook:` runs a jupyter notebook container instance locally. 

2. It runs the `name_map.py` script:

    ** I'm not sure what it does ** 

## What are the notebooks for?

### `yolov5-taco-run-against-downloaded.ipynb` 

Unpacks the `yolov5-taco.zip` and the `tacotrashdataset.zip`


### `yolov5-taco-train-new.ipynb`

Prepares the dataset and trains a model on the entire datset. 
*Warning: Training takes a long time.*

### Requirements

To run this you need the following to be installed on your local system.

- Docker-Desktop

- Python   


