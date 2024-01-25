import { populateSelectDropdown } from "./controlPanel.js"; // Adjust the path as necessary
import { sendReportData } from "./sendToBackend.js"

document.addEventListener("DOMContentLoaded", async () => {
    await populateSelectDropdown();
    new MultiSelectTag('timeSeriesSelect')
});
document.getElementById('searchButton').addEventListener('click', async function (e) {

    document.getElementById('accordionFlushExample').innerHTML = '';

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const selectElement = document.getElementById('timeSeriesSelect');
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
    let data = await sendReportData(e, [startDate, endDate, selectedOptions])
    console.log("Selected Start Date:", startDate);
    console.log("Selected End Date:", endDate);
    console.log("Selected Series:", selectedOptions);
    console.log(data);

    // Assuming 'data' is your array
    for (let i = 0; i < data.length; i++) {
        let htmlContent = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="flush-heading${i}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapse${i}" aria-expanded="false"
                            aria-controls="flush-collapse${i}">
                        ${data[i].CorrName}
                    </button>
                </h2>
                <div id="flush-collapse${i}" class="accordion-collapse collapse"
                     aria-labelledby="flush-heading${i}" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                        <p><strong>Number of Detected correlation: </strong>${data[i].NoOfCorr}</p>
                        <p><strong>Added at :</strong> ${data[i].CorrDateAdded[2] + '/' + data[i].CorrDateAdded[1] + '/' + data[i].CorrDateAdded[0]}</p>
                        <p><strong>Last Search at :</strong> ${data[i].CorrDateEnded[2] + '/' + data[i].CorrDateEnded[1] + '/' + data[i].CorrDateEnded[0]}</p>
                        <a href="/detailedreport" class="card-link">Show more</a>
                    </div>
                </div>
            </div>`;
        
        document.getElementById('accordionFlushExample').insertAdjacentHTML("afterbegin", htmlContent);
    }
    


    document.getElementById('dataDisplaySection').style.display = 'block';
});
