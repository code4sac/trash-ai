resource "heroku_pipeline" "pipeline" {
    name = "${var.heroku_pipeline_name}"
}

resource "heroku_pipeline_coupling" "testing" {
    app = "${heroku_app.testing.name}"
    pipeline = "${heroku_pipeline.pipeline.id}"
    stage = "staging"
}

resource "heroku_pipeline_coupling" "production" {
    app = "${heroku_app.production.name}"
    pipeline = "${heroku_pipeline.pipeline.id}"
    stage = "production"
}