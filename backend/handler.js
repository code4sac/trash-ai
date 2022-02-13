app = require('./src/routes.js')
console.log(app.handler)
exports.handler = app.handler
