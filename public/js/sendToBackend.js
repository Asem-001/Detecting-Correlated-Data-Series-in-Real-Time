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
export async function sendReportData(e,ReportData){ // The totalData dic will be sended to the backend server
    
    e.preventDefault() // Stop refreshing the page 
    let res = await fetch('/sendReportDataToBackend/'+ ReportData  , { // Send the data to the router in JSON file 
        method:'GET',
        
    } )
    const data = await res.json() 
    
     return data.ReportDataByDate


}


export async function sendDetailsReportData(e,ReportData){ // The totalData dic will be sended to the backend server
    
    e.preventDefault() // Stop refreshing the page 
    console.log('ima in func');
    let res = await fetch('/sendDetailsReportDataToBackend/'+ ReportData  , { // Send the data to the router in JSON file 
        method:'GET',
        
    } )
    const data = await res.json() 
            console.log(data);
     return data


}