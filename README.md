# Detecting-Correlated-Data-Series-in-Real-Time

<a href="http://localhost:1234/">
  <img src="https://github.com/Sbinsuwaylih/Detecting-Correlated-Data-Series-in-Real-Time/assets/117676731/b45cdfbf-6420-49cc-ae9b-789fb91c7d54" alt="logo2" width="200"/>
</a>


## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**
- **MongoDB** for simulating the API server

- **Firebase Firestore** for app data storage (no need to install its online) 

## Setup Instructions

## 1. API Server Setup

1. **Download the API Server Code**: Clone or download the code from the `API-Server` branch, which simulates a real API server.
2. **Install Dependencies**: Run the following command in  `create_db.py` run `npm install` terminal to install the necessary Python packages.

then
 ```sh
   pip install pymongo pandas
 ```

## Configure the Database:
1. **Open the `create_db.py` file.**
2. **Update the `folder_path` variable** to your dataset's path, which should be `dataset_stocks`.
3. **Execute the script** by running:
   
   ```sh
   python create_db.py

- **Verify Database Creation**: Check MongoDB to ensure that the database has been created successfully.
- **Start the Server**: Navigate to the `app.js` file in your terminal and start the API server with:
  
  ```sh
  npm start

## 2. Website Launch
1. **Download the Main Branch Code**: Obtain the code from the main branch.
2. **Install Dependencies**: In the terminal of `app.js`, run `npm install` to install necessary dependencies. After completion, execute `npm start` to run the website.
3. **Access the Website**: Navigate to to view [![Corel8](https://img.shields.io/badge/Visit-Corel8-blue)](http://localhost:1234/) .



### Signing In
Use the following credentials to sign in with different levels of access:

- **Admin Access**:
  - ID: `2462686`
  - Password: `123321`

- **User Access**:
  - ID: `2453177`
  - Password: `123321`
