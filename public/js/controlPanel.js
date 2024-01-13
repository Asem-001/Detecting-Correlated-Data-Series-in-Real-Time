import { fetchData } from "./ApiHandler.js";

let selectedSeries = []; // Array to store selected series

export async function selectOptions() {
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

document.getElementById('addSeriesButton').addEventListener('click', () => {
    const select = document.getElementById('timeSeriesSelect');
    const selectedValue = select.value;
    
    if (selectedValue && !selectedSeries.includes(selectedValue)) {
        selectedSeries.push(selectedValue); // Add the selected series to the array
        selectOptions(); // Refresh the select options to hide the added series
    }
});
