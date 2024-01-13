export async function sendToBackend(e){ // The totalData dic will be sended to the backend server
    
    e.preventDefault() // Stop refreshing the page 
    const res = await fetch('/sendbackend', { // Send the data to the router in JSON file 
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            parcel: totalData
        })
    } )
}

