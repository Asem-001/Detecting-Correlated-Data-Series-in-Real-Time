let datasets = []; // Array to store data series
let time = []; // Array to store timestamps

// Returns current time as a string
function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

// Calculates Pearson correlation coefficient between two arrays
function pearsonCorrelation(arr1, arr2) {
    // Initialize variables
    let n = arr1.length;
    let sum_x = 0, sum_y = 0, sum_xy = 0, sum_x2 = 0, sum_y2 = 0,counter = 0;

    // Summation calculations
    for (let i = 0; i < n; i++) {
        sum_x += arr1[i];
        counter++
        sum_y += arr2[i];
        counter++
        sum_xy += (arr1[i] * arr2[i]);
        counter += 2
        sum_x2 += (arr1[i] * arr1[i]);
        counter += 2
        sum_y2 += (arr2[i] * arr2[i]);
        counter += 2
    }

    // Calculation of the correlation coefficient
    let numerator = sum_xy - (sum_x * sum_y / n);
    counter += 3
    let denominator = Math.sqrt((sum_x2 - sum_x * sum_x / n) * (sum_y2 - sum_y * sum_y / n));
    counter += 8

    if (denominator === 0) return 0; // Avoid division by zero

    let correlation =  numerator / denominator ;
    counter++
    console.log(counter)
    return correlation
}

// Updates the datasets and time arrays with new data and timestamps
function updateData() {
    datasets.forEach(dataset => {
        if (dataset.data.length >= 15) dataset.data.pop(); // Limit data array size
        dataset.data.unshift(Math.floor(Math.random() * 10000) + 1); // Add random data
    });
    if (time.length >= 15) time.pop(); // Limit time array size
    time.unshift(getCurrentTime()); // Add current time
}

// Updates the chart with new datasets
function updateChart(chart) {
    chart.data.datasets = datasets;
    chart.update();
}

// Adds a new data series to the chart
function addSeries() {
    // Generate a random color
    const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    // Create new dataset object
    const newDataset = {
        label: `Series ${datasets.length + 1}`,
        data: [],
        borderColor: newColor,
        backgroundColor: newColor,
    };
    datasets.push(newDataset); // Add new dataset to the array
    updateChart(chart);
}

// Calculates and returns a correlation matrix for the current datasets
function calculateCorrelationMatrix() {
    const correlationMatrix = [];
    for (let i = 0; i < datasets.length; i++) {
        const row = [];
        for (let j = 0; j < datasets.length; j++) {
            if (i === j) {
                row.push(1); // Correlation with itself is 1
            } else {
                // Calculate correlation for different series
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

// Updates the display to show the current correlation matrix
function updateCorrelationDisplay() {
    const correlationMatrix = calculateCorrelationMatrix();
    const correlationDisplay = document.getElementById('correlationDisplay');
    let correlationText = 'Correlation Matrix:<br>';

    // Generate HTML for the correlation matrix
    correlationMatrix.forEach(row => {
        row.forEach(value => {
            correlationText += `${value} | \t`;
        });
        correlationText += '<br>';
    });

    correlationDisplay.innerHTML = correlationText; // Update the HTML element
}

// Initializes and returns a Chart.js chart instance
function setupChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        maxRotation: 15, // Adjust label rotation
                        minRotation: 15,
                        font: {
                            size: 10
                        }
                    },
                    reverse: true, // Newest data on the right
                },
                y: { 
                    beginAtZero: true // Start y-axis at zero
                }
            }
        }
    });
}

let chart;
let intervalId = null; // Holds the interval reference for data updates

// Starts periodic data updates
function startDataUpdates() {
    if (intervalId === null) {
        intervalId = setInterval(async function () {
            updateData(); // Update data
            updateChart(chart); // Update chart
            updateCorrelationDisplay(); // Update correlation display
        }, 2300); // Update interval in milliseconds
    }
}

// Stops periodic data updates
function stopDataUpdates() {
    if (intervalId !== null) {
        clearInterval(intervalId); // Clear the interval
        intervalId = null;
    }
}

let correlationUpdateInterval;

// Displays the correlation matrix in a modal
function showCorrelationMatrix() {
    updateCorrelationMatrixInModal(); // Initial update
    correlationUpdateInterval = setInterval(updateCorrelationMatrixInModal, 2000); // Update every 2 seconds

    // Show the modal
    new bootstrap.Modal(document.getElementById('correlationMatrixModal')).show();
}

// Updates the correlation matrix in the modal
function updateCorrelationMatrixInModal() {
    const correlationMatrix = calculateCorrelationMatrix();
    let correlationHtml = '<table class="table"><thead><tr><th></th>';

    // Add column headers
    datasets.forEach(dataset => {
        correlationHtml += `<th>${dataset.label}</th>`;
    });
    correlationHtml += '</tr></thead><tbody>';

    // Add rows
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

// Initialize and set event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    chart = setupChart();

    // Attach event listeners to buttons
    document.getElementById('startButton').addEventListener('click', startDataUpdates);
    document.getElementById('stopButton').addEventListener('click', stopDataUpdates);
    document.getElementById('addSeriesButton').addEventListener('click', addSeries);

    document.querySelector('.btn.btn-light').addEventListener('click', showCorrelationMatrix);
    const correlationModal = document.getElementById('correlationMatrixModal');
    correlationModal.addEventListener('hidden.bs.modal', function (event) {
        clearInterval(correlationUpdateInterval); // Clear interval when modal closes
    });
});
