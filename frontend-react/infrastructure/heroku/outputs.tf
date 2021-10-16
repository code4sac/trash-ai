
output "testing_git_url" {
    value = "${heroku_app.testing.git_url}"
}

output "production_git_url" {
    value = "${heroku_app.production.git_url}"
}
