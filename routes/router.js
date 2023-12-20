const router = require('express').Router();
const Controller = require('../controller/controller');

router.get('/', Controller.index);

router.get('/reports', Controller.reports);

router.get('/dashboard', Controller.dashboard);

router.get('/profile', Controller.profile);




module.exports = router;