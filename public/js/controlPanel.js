import { fetchData } from "./ApiHandler.js";

export async function selectOptions() {
    const collections = await fetchData('http://localhost:3000/api/collections');
    const select = document.getElementById('timeSeriesSelect');
    select.innerHTML = '<option disabled selected value="">Select time Series</option>';
    collections.forEach((collection, index) => {
        const option = document.createElement('option');
        option.value = collection;
        option.textContent = collection;
        select.appendChild(option);
    });
}

