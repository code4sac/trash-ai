locals {
  heroku_testing_app = "${var.application_name}-test"
  heroku_production_app = "${var.application_name}-prod"
}


resource "heroku_app" "testing" {
  name   = local.heroku_testing_app
  region = "${var.heroku_region}"

  config_vars = {
    APP_ENV = "testing"
    NODE_ENV = "testing"
    APP_BASE = var.repo_app_path
  }

  buildpacks = "${var.heroku_app_buildpacks}"
}

resource "heroku_app" "production" {
  name   = local.heroku_production_app
  region = "${var.heroku_region}"

  config_vars = {
    APP_ENV = "production"
    NODE_ENV = "production"
    APP_BASE = var.repo_app_path
  }

  buildpacks = "${var.heroku_app_buildpacks}"
}
