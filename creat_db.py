import os
import pandas as pd
from pymongo import MongoClient

# Set the MongoDB connection details
mongodb_uri = 'mongodb://localhost:27017/'  # Update with your MongoDB URI
database_name = 'Stocks'  # Update with your database name

# Set the folder path 

# folder_path for download the data in mongo
# edit here ex: 'C:/user/'
folder_path = 'Write here the path file for ready_to_push the dataset'


# Create a MongoDB client
client = MongoClient(mongodb_uri)

# Access the specified database
db = client[database_name]

# Get a list of all CSV files in the folder
csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]

# Loop through each CSV file
for csv_file in csv_files:
    # Read the CSV file into a Pandas DataFrame
    df = pd.read_csv(os.path.join(folder_path, csv_file))

    # Create a collection with the name of the CSV file (without extension)
    collection_name = os.path.splitext(csv_file)[0]
    collection = db[collection_name]

    # Convert each row to a dictionary and insert into the collection
    for index, row in df.iterrows():
        data = row.to_dict()
        collection.insert_one(data)

    print(f"Data from {csv_file} has been inserted into MongoDB collection '{collection_name}'.")

# Close the MongoDB client
client.close()
