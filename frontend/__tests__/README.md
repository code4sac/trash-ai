# Tests and Verifications

## Automatic Tests 

### Scenarios
1. Does the landing pag load?
2. On hitting show samples, does processing complete in an expected amount of time? Does it show all the results expected?
3. After recieving results, can you click an image and does the page show the expected data/metadata/etc?
4. After recieving results, does the summary page contain the correct data?

## How to run

1. Navigate to `frontend/`
2. Run `yarn install`
2. Spin up docker container
`docker-compose up`
3. Run the auto tests
`yarn run jest`

## Manual Tests

1. Does the landing pag load?

When you open the landing page. Either at https://www.trashai.org/ or http://localhost:5150

The page should loads in a reasonable timeframe. (<2 seconds)

*You can use the `Network` tab in the dev tools for more fine grained analysis.*

2. On hitting show samples, does processing complete in an expected amount of time? Does it show all the results expected?

When the show samples button is pressed. (as depicted below)
![Instructions](misc/Show_Samples_Button.png "Show Title Button")

Then the app will start processing images. (as depcited below)
![Processing](misc/Processing_Samples.png "Processing Samples Progress Bar")

*The processing should be relatively quick, it it takes more than a minute, something is definetly wrong.*

When the processing is done, the results will be available in the summary page.

![Summary ](misc/Summary_Of_Samples.png "Summary of Sample Results")

It should be populated like above.

3. After recieving results, can you click an image and does the page show the expected data/metadata/etc?

When one of the links in the summary table is clicked. 

![Open images](misc/Open_images.png "Open Images")

Then the images will be displayed along with the segmentation and classes detected. 

![List Images](misc/Images_with_Segmentation.png "List Images")

When the METADATA tab is opened, the relevant metadata for the image is displayed. 

![View Metadata](misc/Viewing_Metadata.png "View Metadata")

4. After recieving results, does the summary page contain the correct data?

*The summary page shows the results of processing a random sample of images, as long as it's not empty it can be considered as correct.*

## Checklist for data schema tests
- [ ] Download the dataset ![image](https://github.com/code4sac/trash-ai/assets/26821843/b0bbd7e7-9554-477d-b2e4-ceb3e1b2a9b6)
- [ ] Inside of the schema folder you should have these 4 schema files. The JSON files are the JSON Schema and the Markdown files describe them. ![image](https://github.com/code4sac/trash-ai/assets/26821843/657b18ee-975f-4c83-bf84-20a31d1cb30b)
- [ ] Go to jsonschemavalidator.net ![image](https://github.com/code4sac/trash-ai/assets/26821843/aa91e1cd-4ce7-4600-9082-e6f815f07ede)
- [ ] Paste your schema in the left hand side image schema corresponds to the image data files, summary schema corresponds to the summary files. Using the image schema for this example. ![image](https://github.com/code4sac/trash-ai/assets/26821843/5833680c-6963-4952-948d-441b14090bb4)
- [ ] Paste the json file you want to validate in the right hand side, if the test worked, you will get a success message. ![image](https://github.com/code4sac/trash-ai/assets/26821843/88508de7-a895-4aa7-997e-89b95de5e95d)
