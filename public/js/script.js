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

function calculateAndUpdateCorrelation() {
    if (datasets.length >= 2) {
        const correlation = pearsonCorrelation(
            datasets[0].data.slice(-5), 
            datasets[1].data.slice(-5)
        ).toFixed(2);
        document.getElementById('correlationValue').innerText = correlation;
    }
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
                        maxRotation: 30, // Cancel label rotation
                        minRotation: 30, // Cancel label rotation
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

document.addEventListener('DOMContentLoaded', () => {
    chart = setupChart();

    setInterval(async function () {
        updateData();
        updateChart(chart);
        calculateAndUpdateCorrelation();
    }, 2300);

    document.getElementById('addSeriesButton').addEventListener('click', addSeries);
});
