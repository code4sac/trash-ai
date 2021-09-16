# Build code & release to the app
resource "heroku_build" "example" {
  app        = "${heroku_app.testing.name}"
  source {
    url     = "https://github.com/josephmfaulkner/stack-em-blocks/archive/refs/tags/0.0.3.tar.gz"
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