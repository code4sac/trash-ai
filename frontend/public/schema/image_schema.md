# Image Schema Description

**hash** (String): A hash associated with the image file.

**filename** (String): The filename of the image.

**exifdata** (Object): An object that contains EXIF data with the following properties:

- **Make** (String): The manufacturer of the camera that took the image.
- **Model** (String): The camera model that took the image.
- **DateTimeOriginal** (Integer): The original date and time the image was taken, represented as a Unix timestamp.
- **ModifyDate** (Integer): The date and time the image was last modified, represented as a Unix timestamp.
- **CreateDate** (Integer): The date and time the image was created, represented as a Unix timestamp.
- **GPSLatitudeRef** (String): The reference for latitude (usually "N" or "S").
- **GPSLatitude** (Number): The latitude coordinate of where the image was taken.
- **GPSLongitudeRef** (String): The reference for longitude (usually "E" or "W").
- **GPSLongitude** (Number): The longitude coordinate of where the image was taken.
- **GPSAltitudeRef** (Integer): The reference for altitude (usually 0).
- **GPSAltitude** (Number): The altitude where the image was taken.
- **GPSTimeStamp** (Array): The GPS timestamp of when the image was taken, represented as an array of integers [hours, minutes, seconds].
- **GPSDateStamp** (String): The GPS date when the image was taken.
- **ExifImageWidth** (Integer): The width of the original image.
- **ExifImageHeight** (Integer): The height of the original image.

**metadata** (Array): An array of objects where each object represents a detected item with the following properties:

- **score** (String): The confidence score of the AI model for the detection.
- **correction** (String): A correction applied to the AI model's prediction. This is usually empty if no correction is applied.
- **remove** (Boolean): A flag indicating whether this detection should be removed. False means the detection is valid.
- **is_tf** (Boolean): A flag indicating if the detection is a true positive (true) or false positive (false).
- **id** (String): A unique identifier for the detection.
- **label** (String): The label of the detected item (e.g., "Plastic film").
area (Object): An object that contains the coordinates of the detected area with the following properties:
- **x1** (Number): The x-coordinate of the top left corner of the detected area.
- **y1** (Number): The y-coordinate of the top left corner of the detected area.
- **x2** (Number): The x-coordinate of the bottom right corner of the detected area.
- **y2** (Number): The y-coordinate of the bottom right corner of the detected area.
Please note that all of the properties described above are required. If any property is missing or if a property's value is of an incorrect type, the JSON will not validate against the schema.