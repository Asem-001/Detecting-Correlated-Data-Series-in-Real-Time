const router = require('express').Router();
const Controller = require('../controller/controller');

router.get('/', Controller.index);

router.get('/adminreports', Controller.adminreports);

router.get('/dashboard', Controller.dashboard);

router.get('/profile', Controller.profile);


router.post('/sendtest',Controller.sendData)



module.exports = router;