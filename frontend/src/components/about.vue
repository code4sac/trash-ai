<template>
    <v-sheet>
        <h1 style="align: center">About Trash AI</h1>
        <hr class="my-3" />
        <h2> Welcome to Trash AI! </h2>
        <p>
            This is an <a href="https://github.com/code4sac/trash-ai">open source project</a> 
            developed and maintained by <a href="https://codeforsacramento.org">Code For Sacramento</a> 
            in partnership with Win Cowger from <a href="https://mooreplasticresearch.org/">The Moore Institute for Plastic Pollution Research</a>
            and Walter Yu from <a href="https://dot.ca.gov/">CALTRANS</a>. There have also been 
            <a href="https://github.com/code4sac/trash-ai/graphs/contributors">many contributors</a> to the code base.
        </p>
        <p>
            To get started, visit the Upload Tab or <a href='/?tab=Upload'>click here</a>.
        </p>

        <h2> What is it? </h2>
        <p>
            Trash AI allows you to upload an image containing trash and get back data about the trash in the image,
            including the classification of trash and bounding box of where the trash is in the image.
        </p>

        <h2> How does it work? </h2>
        <p>
            Trash AI builds a model using the <a href="https://github.com/ultralytics/yolov5">YoloV5 toolset</a> trained on the <a href="http://tacodataset.org/">TACO dataset</a>.  
            The model takes an image containing trash and returns a list of annotations and bounding boxes of trash within the image.  
            The model is imported into the front-end <a href="https://vuejs.org/">Vue.js</a> application where it is invoked when an image is uploaded.
            The Vue application then displayes the results of the model on the image.
        </p>

        <h2> How can I use Trash AI? </h2>
        <p>
            Trash AI is open source and free to use however you see fit.  You may classify images and download the data.  
            You may copy and modify the code for your own use.
        </p>

        <h2> Disclaimer about uploaded images </h2>
        <p>
            The current version of Trash AI and the model we are using is just a start!  
            When you upload an image, we are storing the image and the classification in an effort
            to expand the trash dataset and improve the model over time.
        </p>

        <h2> Reporting issues and improvements </h2>
        <p>
            If you would like to report an issue or request a feature, please 
            <a href="https://github.com/code4sac/trash-ai/issues/new">open a Github Issue</a> in our repository.
        </p>
    </v-sheet>
</template>
<script>
export default {}
</script>
