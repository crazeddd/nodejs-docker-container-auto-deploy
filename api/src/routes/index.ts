var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req: any, res: any, next: any) {
  res.status(200).send("API working properly");
});

module.exports = router;
