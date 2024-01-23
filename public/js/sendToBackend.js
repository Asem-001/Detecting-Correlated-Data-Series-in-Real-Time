 export async function sendTotalDataToBackend(e,totalData){ // The totalData dic will be sended to the backend server
    
    e.preventDefault() // Stop refreshing the page 
    let res = await fetch('/sendbackend', { // Send the data to the router in JSON file 
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            parcel: totalData
        })
    } )
}

export async function sendDetectdDataToBackend(detectdData){ // The totalData dic will be sended to the backend server
    
    // e.preventDefault() // Stop refreshing the page 
    let res = await fetch('/detectddatadackend', { // Send the data to the router in JSON file 
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            parcel: detectdData
        })
    } )
}

export async function sendAdminSettingsToUser(id,threshold,windowSize){
    let settings = {
        AdminID:id,
        SetThreshold:threshold,
        WindowSize: windowSize
    }
    
    let res =  await fetch('/sendAdminSettings',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            parcel: settings
        })
    });
}


