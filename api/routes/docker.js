var express = require('express');
var router = express.Router();

const dockerRoutes = require('../controllers/docker-controller.js')

router.post('/stop', dockerRoutes.stopContainer);

//router.post('/start', dockerRoutes.startContainer)

module.exports = router;
