let datasets = [];
let time = [];

function getCurrentTime() {
    return new Date().toLocaleTimeString(); // Get current time as a string
}

function pearsonCorrelation(arr1, arr2) {
    let n = arr1.length;
    let sum_x = 0, sum_y = 0, sum_xy = 0, sum_x2 = 0, sum_y2 = 0;

    for (let i = 0; i < n; i++) {
        sum_x += arr1[i];
        sum_y += arr2[i];
        sum_xy += (arr1[i] * arr2[i]);
        sum_x2 += (arr1[i] * arr1[i]);
        sum_y2 += (arr2[i] * arr2[i]);
    }

    let numerator = sum_xy - (sum_x * sum_y / n);
    let denominator = Math.sqrt((sum_x2 - sum_x * sum_x / n) * (sum_y2 - sum_y * sum_y / n));

    if (denominator === 0) return 0;

    return numerator / denominator;
}

function updateData() {
    datasets.forEach(dataset => {
        if (dataset.data.length >= 15) dataset.data.pop(); // Remove oldest data
        dataset.data.unshift(Math.floor(Math.random() * 10000) + 1); // Add new data at the beginning
    });
    if (time.length >= 15) time.pop(); // Remove oldest timestamp
    time.unshift(getCurrentTime()); // Add current time at the beginning
}

function updateChart(chart) {
    chart.data.datasets = datasets;
    chart.update();
}

function addSeries() {
    const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    const newDataset = {
        label: `Series ${datasets.length + 1}`,
        data: [],
        borderColor: newColor,
        backgroundColor: newColor,
    };
    datasets.push(newDataset);
    updateChart(chart);
    
}

function calculateCorrelationMatrix() {
    const correlationMatrix = [];
    for (let i = 0; i < datasets.length; i++) {
        const row = [];
        for (let j = 0; j < datasets.length; j++) {
            if (i === j) {
                row.push(1); // Correlation of a dataset with itself is 1
            } else {
                const correlation = pearsonCorrelation(
                    datasets[i].data.slice(-5),
                    datasets[j].data.slice(-5)
                ).toFixed(2);
                row.push(correlation);
            }
        }
        correlationMatrix.push(row);
    }
    return correlationMatrix;
}

function updateCorrelationDisplay() {
    const correlationMatrix = calculateCorrelationMatrix();
    const correlationDisplay = document.getElementById('correlationDisplay');
    let correlationText = 'Correlation Matrix:<br>';

    // Generate the correlation matrix text
    correlationMatrix.forEach(row => {
        row.forEach(value => {
            correlationText += `${value} | \t`;
        });
        correlationText += '<br>';
    });

    // Update the HTML element with the correlation matrix text
    correlationDisplay.innerHTML = correlationText;
}


function setupChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: time, // Use current time as x-axis labels
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        maxRotation: 15, // Cancel label rotation
                        minRotation: 15, // Cancel label rotation
                        font: {
                            size: 10 // Set font size to 10 (or any desired value)
                        }
                    },
                    reverse: true, // Keep this if you want the newest data on the right
                },
                y: { 
                    beginAtZero: true 
                }
            }
        }
    });
}


let chart;
let intervalId = null; // Variable to hold the interval reference

function startDataUpdates() {
    if (intervalId === null) {
        intervalId = setInterval(async function () {
            updateData();
            updateChart(chart);
           updateCorrelationDisplay()();
        }, 2300);
    }
}

function stopDataUpdates() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}


let correlationUpdateInterval;

function showCorrelationMatrix() {
    updateCorrelationMatrixInModal(); // Initial update
    correlationUpdateInterval = setInterval(updateCorrelationMatrixInModal, 2000); // Update every 2 seconds

    // Show the modal using Bootstrap's modal functionality
    new bootstrap.Modal(document.getElementById('correlationMatrixModal')).show();
}


function updateCorrelationMatrixInModal() {
    const correlationMatrix = calculateCorrelationMatrix();
    let correlationHtml = '<table class="table"><thead><tr><th></th>';

    // Add column headers (Series names)
    datasets.forEach(dataset => {
        correlationHtml += `<th>${dataset.label}</th>`;
    });
    correlationHtml += '</tr></thead><tbody>';

    // Add rows with row headers (Series names)
    correlationMatrix.forEach((row, rowIndex) => {
        correlationHtml += `<tr><th>${datasets[rowIndex].label}</th>`;
        row.forEach(value => {
            correlationHtml += `<td>${value}</td>`;
        });
        correlationHtml += '</tr>';
    });

    correlationHtml += '</tbody></table>';

    const modalBody = document.querySelector('#correlationMatrixModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = correlationHtml;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    chart = setupChart();

    // Attach event listeners to buttons using their IDs
    document.getElementById('startButton').addEventListener('click', startDataUpdates);
    document.getElementById('stopButton').addEventListener('click', stopDataUpdates);
    document.getElementById('addSeriesButton').addEventListener('click', addSeries);

    // Event listener for the "Show Correlation" button
    document.querySelector('.btn.btn-light').addEventListener('click', showCorrelationMatrix);
    const correlationModal = document.getElementById('correlationMatrixModal');
    correlationModal.addEventListener('hidden.bs.modal', function (event) {
        clearInterval(correlationUpdateInterval); // Clear the interval when the modal is closed
    });
});
