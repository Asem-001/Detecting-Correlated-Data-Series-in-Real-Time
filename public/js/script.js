let datasets = []; // Array to store data series
let time = []; // Array to store timestamps

// Returns current time as a string
function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

// Calculates Pearson correlation coefficient between two arrays
function pearsonCorrelation(x, y) {
    let computationCounter = 0;
const n = x.length;
    
      // Calculate the mean of x and y
      const meanX = x.reduce((sum, value) => sum + value, 0) / n;
      computationCounter += x.length + 1;
      const meanY = y.reduce((sum, value) => sum + value, 0) / n;
      computationCounter += x.length + 1;
    
      // Calculate the numerator and denominators
      let numerator = 0;
      let denominatorX = 0;
      let denominatorY = 0;
   
      for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
        computationCounter++;
  
        const diffY = y[i] - meanY;
        computationCounter++;
    
        numerator += diffX * diffY;
        computationCounter += 2;
  
        denominatorX += diffX ** 2;
        computationCounter += 2;
  
        denominatorY += diffY ** 2;
        computationCounter += 2;
      }
    
      // Calculate the correlation coefficient
      const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
      computationCounter += 3;
      console.log(computationCounter)
      return correlation;
}

// Updates the datasets and time arrays with new data and timestamps
function updateData() {
    datasets.forEach(dataset => {
        if (dataset.data.length >= 50) dataset.data.pop(); // Limit data array size
        dataset.data.unshift(Math.floor(Math.random() * 10000) + 1); // Add random data
    });
    if (time.length >= 50) time.pop(); // Limit time array size
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
    document.getElementById('seriesCount').innerText = datasets.length;
    updateChart(chart);

    updateDatasetSelectOptions();

}

function updateDatasetSelectOptions() {
    const select = document.getElementById('datasetSelect');
    select.innerHTML = '<option selected>Select Series</option>';
    datasets.forEach((dataset, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = dataset.label;
        select.appendChild(option);
    });
}

function deleteSeries() {
    const select = document.getElementById('datasetSelect');
    const selectedIndex = select.value;
    if (selectedIndex >= 0 && datasets[selectedIndex]) {
        datasets.splice(selectedIndex, 1); // Remove the selected dataset
        updateChart(chart);
        updateDatasetSelectOptions();
    }
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

// Calculates and returns a correlation matrix for the current datasets
function calculateCorrelationMatrix() {
    const correlationMatrix = [];
    for (let i = 0; i < datasets.length; i++) {
        const row = [];
        for (let j = 0; j < datasets.length; j++) {
            if (i === j) {
                row.push(1);
            } else if (i >= j) {

                let array1 = datasets[i].data.slice(-5)
                let array2 = datasets[j].data.slice(-5)

                if(array1.length == array2.length && array1.length == 5){
                    const correlation = pearsonCorrelation(array1,array2).toFixed(2);
                    row.push(correlation);   
                }else{
                    row.push(NaN)
                } 
            }else{
                row.push('-')
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
    let correlationHTML = '<table class="correlation-table  table table-striped"><tr><th></th>';

    // Add dataset labels as table headers
    datasets.forEach(dataset => {
        correlationHTML += `<th>${dataset.label}</th>`;
    });

    correlationHTML += '</tr>';

    correlationMatrix.forEach((row, rowIndex) => {
        correlationHTML += `<tr><th>${datasets[rowIndex].label}</th>`;
        row.forEach(value => {
            correlationHTML += `<td>${value}</td>`;
        });
        correlationHTML += '</tr>';
    });

    correlationHTML += '</table>';
    correlationDisplay.innerHTML = correlationHTML;
}

let correlationUpdateInterval;

// Displays the correlation matrix in a modal
function showCorrelationMatrix() {
    updateCorrelationMatrixInModal(); // Initial update
    correlationUpdateInterval = setInterval(updateCorrelationMatrixInModal, 2000); // Update every 2 seconds

    // Show the modal
    new bootstrap.Modal(document.getElementById('correlationMatrixModal')).show();
}

// Initialize and set event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    chart = setupChart();

    document.getElementById('startButton').addEventListener('click', startDataUpdates);
    document.getElementById('stopButton').addEventListener('click', stopDataUpdates);
    document.getElementById('addSeriesButton').addEventListener('click', addSeries);

    document.getElementById('deleteSeriesButton').addEventListener('click', deleteSeries);

    document.querySelector('.btn.btn-light').addEventListener('click', showCorrelationMatrix);
    const correlationModal = document.getElementById('correlationMatrixModal');
    correlationModal.addEventListener('hidden.bs.modal', function (event) {
        clearInterval(correlationUpdateInterval); // Clear interval when modal closes
    });
});
