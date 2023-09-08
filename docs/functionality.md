# Batch Upload
The best way to use the tool is by batch uploading image files using the upload button. Alternatively if you just want to test the tool you can use the show samples button and it will give you some sample data to work with. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/c47b35f0-003d-4b32-b0d4-f3067884bd68)

# Batch Download
After uploading your data, the AI routine will automatically label trash found within your images and format your data for download. You can click download all to download the data at this point. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/4cf3f4c6-01e6-457e-8322-179cd4e3e611)

From the downloaded dataset you will get several file types.  
1) the image you uploaded in its raw from labled with a unique hash
2) a json file with the same hash that contains the image level data from the AI
3) a second image with the same hash ending in -detect with overlayed bounding boxed and labels showing where the AI found what trash in your image.
4) a summary json file with summary data from all the images (useful when uploading trash from a whole survey).
5) a summary_detected and summary_totals csv file with data from the summary table formatted as a csv for folks who are more familar with that format.
6) a schema folder with an image_schema and summary_schema json files that can be used to validate the data formats and partnered markdown files describing the schema. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/941f7803-98fa-4d94-a320-3d7ca8280943)

# Data Inspection
The tool can also be used to inspect your data. 

Clicking on uploads will allow you to inspect the AI classifications. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/74c71947-64d8-439e-b1ab-cc27e40db866)

Selecting an image here will allow you to inspect detailed class information and metadata about the classifications. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/ee812b67-c5d0-42f1-b86b-f63c4ebe3634)

Clicking summary will show information across the uploaded images which can also be selected. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/3084e433-fe01-418e-ad44-9aba86d7046b)

If your images have spatial information, a selectable map can be viewed of where they trash was found. 
![image](https://github.com/code4sac/trash-ai/assets/26821843/da9e6baa-c22d-468b-9915-63a312ea372b)





