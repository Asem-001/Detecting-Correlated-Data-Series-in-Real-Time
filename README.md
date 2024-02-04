# Detecting-Correlated-Data-Series-in-Real-Time

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**
- **MongoDB** for simulating the API server

- **Firebase Firestore** for app data storage (no need to install its online) 

## Setup Instructions

### API Server Setup

1. **Download the API Server Code**: Clone or download the code from the `API-Server` branch, which simulates a real API server.
2. **Install Dependencies**: Run the following command in  `create_db.py` terminal to install the necessary Python packages.

 ```sh
   pip install pymongo pandas
 ```

## Configure the Database:
1. **Open the `create_db.py` file.**
2. **Update the `folder_path` variable** to your dataset's path, which should be `ready_to_push`.
3. **Execute the script** by running:
   
   ```sh
   python create_db.py

- **Verify Database Creation**: Check MongoDB to ensure that the database has been created successfully.
- **Start the Server**: Navigate to the `test.js` file in your terminal and start the API server with:
  
  ```sh
  npm start

## Access the Website: Open your web browser and go to [http://localhost:1234/](http://localhost:1234/) to view the website.

### Signing In
Use the following credentials to sign in with different levels of access:

- **Admin Access**:
  - ID: `2462686`
  - Password: `123321`

- **User Access**:
  - ID: `2453177`
  - Password: `123321`
