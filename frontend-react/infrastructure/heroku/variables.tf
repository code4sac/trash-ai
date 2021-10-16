variable "heroku_account_email" {
    description = "Email for Heroku Account"
    type        = string
}

variable "heroku_api_key" {
    description = "API Key from Heroku Account"
    type        = string
}

variable "github_tar_url" {}

variable "repo_app_path" {}

variable "application_name" {}

variable "heroku_region" {}

variable "heroku_app_buildpacks" {
    type = "list"
}
