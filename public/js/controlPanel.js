import { fetchData } from "./ApiHandler.js";

export let selectedSeries = []; // Array to store selected series

export function removeSeriesFromSelected(seriesName) {
    selectedSeries = selectedSeries.filter(series => series !== seriesName);
}

function appendLocalStorageToSelected(){
    if(JSON.parse(localStorage.getItem('datasets')) != null){
        JSON.parse(localStorage.getItem('datasets')).forEach((item) =>{
            if (!selectedSeries.includes(item.label)) {
            selectedSeries.push(item.label)  
            }   
        })
    }
}

export async function selectOptions() {
   appendLocalStorageToSelected()
    const collections = await fetchData('http://localhost:3000/api/collections');
    const select = document.getElementById('timeSeriesSelect');
    select.innerHTML = '<option disabled selected value="">Select time Series</option>';
    
    collections.forEach((collection, index) => {
      
        if (!selectedSeries.includes(collection)) {
            const option = document.createElement('option');
            option.value = collection;
            option.textContent = collection;
            select.appendChild(option);
        }
    });
}

export function setControlPanelLocal(){
    if(localStorage.getItem('threshold') != null){
        let thresh = JSON.parse(localStorage.getItem('threshold'));

        $("#slider-range").slider("values", [thresh[0], thresh[1]]);
        document.getElementById('range').value = `${thresh[0]} , ${thresh[1]}`
        
    }
    if(localStorage.getItem('window') != null){
     document.getElementById('sliceSizeSelect').value = localStorage.getItem('window');
    }
    if(localStorage.getItem('function') != null){
     document.getElementById('functionSelect').value = localStorage.getItem('function');
    }
}

export async function populateSelectDropdown() {
    const collections = await fetchData('http://localhost:3000/api/collections');
    const selectElement = document.getElementById('timeSeriesSelect');
    selectElement.innerHTML = ''; // Clear existing options if any

    collections.forEach(collection => {
        // Create option element
        const option = document.createElement('option');
        option.value = collection;
        option.textContent = collection;
        option.disabled = true;
        option.selected = false;


        // Append to the select element
        selectElement.appendChild(option);
    });
}
