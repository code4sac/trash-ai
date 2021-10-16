terraform {
  required_providers {
    heroku = {
      source  = "terraform-providers/heroku"
      version = ">= 4.0"
    }
  }
}

provider "heroku" {
  email   = "${var.heroku_account_email}"
  api_key = "${var.heroku_api_key}"
}