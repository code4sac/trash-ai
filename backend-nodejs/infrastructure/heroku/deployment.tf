locals {
  source_code_path= abspath("../../")
}

# Build code & release to the app
resource "heroku_build" "example" {
  app        = "${heroku_app.testing.name}"
  source {
    url     = var.github_tar_url
  }
}

# Launch the app's web process by scaling-up
resource "heroku_formation" "example" {
  app        = "${heroku_app.testing.name}"
  type       = "web"
  quantity   = 1
  size       = "free"
  depends_on = [heroku_build.example]
}

output "testing_app_url" {
  value = "https://${heroku_app.testing.name}.herokuapp.com"
}