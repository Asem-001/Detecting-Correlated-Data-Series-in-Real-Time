 export async function sendTotalDataToBackend(e,totalData){ // The totalData dic will be sended to the backend server
    
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

export async function sendDetectdDataToBackend(e,DetectdData){ // The totalData dic will be sended to the backend server
    
    e.preventDefault() // Stop refreshing the page 
    const res = await fetch('/DetectdDataBackend', { // Send the data to the router in JSON file 
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            parcel: DetectdData
        })
    } )
}


