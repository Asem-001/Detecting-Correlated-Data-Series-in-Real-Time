const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON data in requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

const mongoUri = 'mongodb://127.0.0.1:27017/sensors'; // Using "sensors" as the database name

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Create a Mongoose models for the existing collections
const createModel = (collectionName) => mongoose.model(collectionName, {}, collectionName); // <-- Explicitly setting the collection name

const PM25Model = createModel('pm_25');
const humidityModel = createModel('humidity');
const pressureModel = createModel('pressure');
const tempModel = createModel('temp');
const windSpeedModel = createModel('wind_speed');

// Generic function to retrieve data from a collection based on the provided index
const getData = async (model, index, res) => {
    try {
        const data = await model.findOne({}).skip(index).exec();

        if (!data) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.json(data);
    } catch (error) {
        console.error(`Error retrieving data from the "${model.collection.collectionName}" collection:`, error);
        res.status(500).json({ error: 'Internal server error', specificError: error.message });
    }
};

// API endpoint to get all collection names
app.get('/api/collections', async (req, res) => {
    try {
        // Get all collection names
        const collections = await mongoose.connection.db.listCollections().toArray();

        if (!collections || collections.length === 0) {
            res.status(404).json({ error: 'No collections found' });
            return;
        }

        // Extract collection names
        const collectionNames = collections.map(collection => collection.name);

        res.json({ collections: collectionNames });
    } catch (error) {
        console.error('Error retrieving collections:', error);
        res.status(500).json({ error: 'Internal server error', specificError: error.message });
    }
});

// Define API routes
app.get('/api/pm_25/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(PM25Model, index, res);
});

app.get('/api/humidity/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(humidityModel, index, res);
});

app.get('/api/pressure/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(pressureModel, index, res);
});

app.get('/api/temp/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(tempModel, index, res);
});

app.get('/api/wind_speed/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(windSpeedModel, index, res);
});

// Connect to the database when the server starts
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});