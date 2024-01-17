const router = require('express').Router();
const Controller = require('../controller/controller');

router.get('/', Controller.index);

router.get('/adminreports', Controller.adminreports);

router.get('/detailedReport', Controller.detailedReport);


router.get('/dashboard', Controller.dashboard);

router.get('/profile', Controller.profile);


router.post('/sendbackend',Controller.addCorrelationData)

router.post('/DetectdDataBackend',Controller.addDetectCorrelation)

module.exports = router;