let currentIndex = 0;
// Function to make a request to the API
export const fetchData = async (url) => {
    let apiUrl;
    if(url != 'http://localhost:3000/api/collections'){
        apiUrl = url+`/${currentIndex}`;   
    }else{
        apiUrl = url
    }
     // Increment the index for the next request
     currentIndex++;

     // Reset the index to 1 if it exceeds a certain value (e.g., 10)
     if (currentIndex > 1000000) {
         currentIndex = 1;
     }

    try {
        // Make a GET request to the API endpoint using fetch
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        if(url != 'http://localhost:3000/api/collections'){
            return data.value 
        }else{
            return data.collections
        }
        
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};