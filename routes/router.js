const router = require('express').Router();
const Controller = require('../controller/controller');

router.get('/', Controller.index);

router.get('/adminreports', Controller.adminreports);

router.get('/dashboard', Controller.dashboard);

router.get('/profile', Controller.profile);


router.post('/sendtest',Controller.sendData)

router.post('/sendData', (req, res) => {
    // Handle the data received from the client-side here
    const receivedData = req.body;
    console.log('Received data:', receivedData);
  
    // Process the data and send a response if needed
    res.json({ message: 'Data received successfully!' });
  });

module.exports = router;