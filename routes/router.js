const router = require('express').Router();
const passport = require('passport');
const controller = require('../controller/controller');
const Controller = require('../controller/controller');


const initializePassport = require('../passport-config');

initializePassport(passport)

router.get('/',controller.home)

router.get('/home', Controller.index);

router.get('/reports', Controller.reports);

router.get('/detailedReport', Controller.detailedReport);

router.get('/login', controller.login);

router.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/dashboard', Controller.dashboard);

router.get('/profile', Controller.profile);


router.post('/sendbackend',Controller.addCorrelationData)

router.post('/detectddatadackend',Controller.addDetectCorrelation)

router.post('/addUser', Controller.addUser);

router.put('/updateUser/:id', Controller.updateUser);

router.get('/editUser/:id', Controller.editUser);

router.delete('/delete/:id' , Controller.deleteUser)

module.exports = router;