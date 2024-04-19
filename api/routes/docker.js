var express = require('express');
var router = express.Router();

const dockerRoutes = require('../controllers/docker-controller.js')

router.post('/stop', dockerRoutes.stopContainer);

router.post('/start', dockerRoutes.startContainer);

router.post('/build-container', dockerRoutes.buildContainer);

router.get('/refresh', dockerRoutes.appendContainers);

router.get('/state', dockerRoutes.containerState);

module.exports = router;
