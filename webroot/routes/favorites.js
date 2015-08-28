var express = require('express')
var router = express.Router()

router.route('/')
/* GET favorites listing. */
.get( function(req, res, next) {
  res.send('This is a list of favorites')
})
.post(function(req, res, next) {
  //res.send('respond with a resource')
})

module.exports = router