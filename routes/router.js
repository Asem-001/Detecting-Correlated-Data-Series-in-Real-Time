const router = require('express').Router();
const passport = require('passport');
const controller = require('../controller/controller');
const Controller = require('../controller/controller');


const initializePassport = require('../passport-config');

initializePassport(passport)

router.get('/',controller.index)

router.get('/home',checkAuthentication, Controller.home);

router.get('/reports',checkAuthentication, Controller.reports);

router.get('/detailedReport',checkAuthentication, Controller.detailedReport);

router.get('/login',checkNotAuthentication, controller.login);

router.post('/login',checkNotAuthentication, passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

router.delete('/logout', controller.logout)

router.get('/dashboard',isAdmin, Controller.dashboard);

router.get('/profile', checkAuthentication,Controller.profile);


router.post('/sendbackend',checkAuthentication, Controller.addCorrelationData)

router.post('/detectddatadackend',checkAuthentication, Controller.addDetectCorrelation)

router.post('/sendAdminSettings',isAdmin, Controller.setSettings)

router.post('/addUser', isAdmin,Controller.addUser);

router.put('/updateUser/:id',isAdmin, Controller.updateUser);

router.get('/editUser/:id', isAdmin,Controller.editUser);

router.delete('/delete/:id' ,isAdmin, Controller.deleteUser)


function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }
  
function checkNotAuthentication(req,res,next){
    if(!req.isAuthenticated()){
      return next()
    }
    res.redirect('/home')
  }
function isAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.IsAdmin){
        return next()
    }
    res.redirect('/home')
}


  

module.exports = router;