# Summary Schema Description

**detected_objects** (Array): An array of objects where each object represents a detected item with the following properties:

- **name** (String): The name of the detected item (e.g., "Plastic film").
- **count** (Integer): The count of the detected item. This number should be a non-negative integer.
- **hashes** (Array): An array of strings where each string represents a hash associated with the detected item.

**no_detection_hashes** (Array): An array of strings where each string represents a hash that is associated with items not detected.

**unique_detections** (Integer): The count of unique detections. This number should be a non-negative integer.

**total_detections** (Integer): The total count of detections. This number should be a non-negative integer.

**gps** (Object): An object that contains GPS information with the following properties:

**list** (Array): An array of objects where each object represents a GPS location with the following properties:
**coordinate** (Object): An object that contains the GPS coordinates with the following properties:
**lat** (Number): The latitude of the location.
**lng** (Number): The longitude of the location.
**hash** (String): A hash associated with the location.