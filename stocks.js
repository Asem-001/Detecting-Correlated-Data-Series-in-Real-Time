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

const mongoUri = 'mongodb://127.0.0.1:27017/Stocks'; // Using "sensors" as the database name

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


const AAPLModel = createModel('AAPL');
const AEHRModel = createModel('AEHR');
const AMDModel = createModel('AMD');
const AMZNModel = createModel('AMZN');
const BACModel = createModel('BAC');
const CCJModel = createModel('CCJ');
const DISModel = createModel('DIS');
const FModel = createModel('F');
const ILMNModel = createModel('ILMN');
const INOModel = createModel('INO');
const ISRModel = createModel('ISRG');
const JNPRModel = createModel('JNPR');
const NVAXModel = createModel('NVAX');
const PFEModel = createModel('PFE');
const SRPTModel = createModel('SRPT');
const SWNModel = createModel('SWN');
const TDModel = createModel('TDTO'); // Assuming 'TD.TO' is a valid collection name
const N225Model = createModel('N225');

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

app.get('/api/AAPL/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(AAPLModel, index, res);
});

app.get('/api/AEHR/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(AEHRModel, index, res);
});

app.get('/api/AMD/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(AMDModel, index, res);
});

app.get('/api/AMZN/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(AMZNModel, index, res);
});

app.get('/api/BAC/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(BACModel, index, res);
});

app.get('/api/CCJ/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(CCJModel, index, res);
});

app.get('/api/DIS/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(DISModel, index, res);
});

app.get('/api/F/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(FModel, index, res);
});

app.get('/api/ILMN/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(ILMNModel, index, res);
});

app.get('/api/INO/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(INOModel, index, res);
});

app.get('/api/ISRG/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(ISRModel, index, res);
});

app.get('/api/JNPR/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(JNPRModel, index, res);
});

app.get('/api/NVAX/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(NVAXModel, index, res);
});

app.get('/api/PFE/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(PFEModel, index, res);
});

app.get('/api/SRPT/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(SRPTModel, index, res);
});

app.get('/api/SWN/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(SWNModel, index, res);
});

app.get('/api/TDTO/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(TDModel, index, res);
});

app.get('/api/N225/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    await getData(N225Model, index, res);
});

// Connect to the database when the server starts
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});