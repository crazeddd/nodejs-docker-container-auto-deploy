//Npm Imports
var express = require('express');
var router = express.Router();

const dockerRoutes = require('../controllers/docker-controller.js'); //Controller import

//Routes
router.post('/stop', dockerRoutes.stopContainer); //Stops container

router.post('/start', dockerRoutes.startContainer); //Starts container

router.post('/build-container', dockerRoutes.buildContainer); //Builds new container

router.get('/refresh', dockerRoutes.refreshContainers); //Refreshs containers

module.exports = router;
