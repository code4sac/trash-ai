#Working directory ----
setwd("notebooks/data_reader") #Change this to your working directory

#Libraries ----
library(rio)
library(jsonlite)
library(ggplot2)
library(data.table)

#Data import ----
json_list <- import_list("example_data_download2.zip")

summary_metadata <- names(json_list)[grepl("summary.json", names(json_list))]

image_metadata <- names(json_list)[!grepl("summary.json", names(json_list)) & !grepl("(.jpg)|(.png)|(.tif)|(schema)", names(json_list))][-1]

summary_json <- json_list[[summary_metadata]]

flattened_summary <- data.frame(name = summary_json$detected_objects$name,
                                     count = summary_json$detected_objects$count)


image_json <- json_list[image_metadata] 

flattened_images <- lapply(1:length(image_json), function(i){
    print(i)
    data.frame(hash = image_json[[i]]$hash, 
               filename = image_json[[i]]$filename, 
               datetime = if(!is.null(image_json[[i]]$exifdata$DateTimeOriginal)){image_json[[i]]$exifdata$DateTimeOriginal} else{NA}, 
               latitude = if(!is.null(image_json[[i]]$exifdata$GPSLatitude)){image_json[[i]]$exifdata$GPSLatitude} else{NA}, 
               longitude = if(!is.null(image_json[[i]]$exifdata$GPSLongitude)){image_json[[i]]$exifdata$GPSLongitude} else{NA}, 
               score = if(!is.null(image_json[[i]]$metadata$score)){image_json[[i]]$metadata$score} else{NA}, 
               label = if(!is.null(image_json[[i]]$metadata$label)){image_json[[i]]$metadata$label} else{NA})
}) |>
    rbindlist()


#Figure creation ----
ggplot(flattened_summary, aes(y = reorder(name, count), x = count, fill = name)) +
    geom_bar(stat = "identity") +
    theme_classic(base_size = 15) +
    theme(legend.position = "none") +
    labs(x = "Count", y = "Type")
    
