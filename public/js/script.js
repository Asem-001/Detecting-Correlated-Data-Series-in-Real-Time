import { pearsonCorrelation } from "./pearson.js";
import { selectOptions, removeSeriesFromSelected } from "./controlPanel.js";
import { fetchData } from "./ApiHandler.js";
import { sendToBackend } from "./sendToBackend.js";

let datasets = []; // Array to store data series
let time = []; // Array to store timestamps
let totalData = {'names': [], 
                'addDate': [], 
                'endDate': [], 
                'threshold':[]};
let correlationObject = {'correlatedSeries': [],
                         'startTime': [],
                         'endTime': [],
                         'threshold': [] } 

// Returns current time as a string
function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

// Updates the chart with new datasets
function updateChart(chart) {
  chart.data.datasets = datasets;
  chart.update();
}

async function updateData() {
  for (const dataset of datasets) {
    if (dataset.data.length >= 120) dataset.data.pop(); // Remove oldest data point from the end
    let x = parseFloat(
      await fetchData(`http://localhost:3000/api/${dataset.label}`)
    );
    dataset.data.unshift(x); // Add new data point to the beginning
  }

  if (time.length >= 120) time.pop(); // Remove oldest time point from the end
  time.unshift(getCurrentTime()); // Add current time to the beginning
}

function addSeries() {
  let collection = document.getElementById("timeSeriesSelect").value;
  if (!collection) {
    alert("Please select a series before adding."); // Alert if no series is selected
    return;
  }
  const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  
  // Create new dataset object
  const newDataset = {
    label: collection,
    data: [],
    borderColor: newColor,
    backgroundColor: newColor,
  };
  // check if series name not in the Total data
  if (!totalData.names.includes(newDataset.label)) {
    totalData.names.push(newDataset.label);
     // add the time that user add series
    totalData.addDate.push(new Date().toDateString() + " " + new Date().toLocaleTimeString());

  
  }

  datasets.push(newDataset); // Add new dataset to the array
  document.getElementById("seriesCount").innerText = datasets.length;
  updateChart(chart);
  updateDatasetSelectOptions();
}

function updateDatasetSelectOptions() {
  const select = document.getElementById("datasetSelect");
  select.innerHTML =
    '<option disabled selected value="">Select Series</option>';
  datasets.forEach((dataset, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = dataset.label;
    select.appendChild(option);
  });
}

function deleteSeries() {
  const select = document.getElementById("datasetSelect");
  const selectedIndex = select.value;
  if (selectedIndex >= 0 && datasets[selectedIndex]) {
    const deletedSeries = datasets[selectedIndex].label;

    // Remove the selected dataset
    datasets.splice(selectedIndex, 1);

    // Use the imported function to remove the deleted series from selectedSeries
    removeSeriesFromSelected(deletedSeries);

    // Update totalData to remove the deleted series data
    totalData.names.splice(selectedIndex, 1);
    totalData.addDate.splice(selectedIndex, 1);
    totalData.endDate.splice(selectedIndex, 1);
    totalData.threshold = [];

    // Refresh the chart and dataset select options
    updateChart(chart);
    updateDatasetSelectOptions();

    // Refresh the options in the series select dropdown
    // Assuming selectOptions is accessible here, otherwise import it as needed
    selectOptions();

    // Update the displayed series count
    document.getElementById("seriesCount").innerText = datasets.length;
  } else {
    // Handle the case where no valid series is selected for deletion
    console.warn("No valid series selected for deletion");
  }
}

// Initializes and returns a Chart.js chart instance
function setupChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: datasets,
    },
    options: {
      tension: 0.4,
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 90, // Adjust label rotation
            minRotation: 90,
            font: {
              size: 10,
            },
          },
          reverse: true, // Newest data on the right
        },
        y: {
          beginAtZero: true, // Start y-axis at zero
        },
      },
    },
  });
}

let chart;
let intervalId = null; // Holds the interval reference for data updates

// Starts periodic data updates
function startDataUpdates(e) {
  if (intervalId === null) {
    console.log(totalData);
    // sendToBackend(e)

    let tempArray = document.getElementById("range").value.split(",");
    totalData.threshold[0] = parseFloat(tempArray[0]);
    totalData.threshold[1] = parseFloat(tempArray[1]);
    tempArray = [];

    intervalId = setInterval(async function () {
      updateData(); // Update data
      updateChart(chart); // Update chart
      updateCorrelationDisplay(); // Update correlation display
    }, 1300); // Update interval in milliseconds
  }
}
function clearTotalData() {
  // Remove the the selected from Totaldata
  totalData.names.splice(0, totalData.names.length);
  totalData.addDate.splice(0, totalData.addDate.length);
}

// Stops periodic data updates

function stopDataUpdates(e) {
  e.preventDefault(); // Stop refreshing the page

  totalData.endDate[0] = new Date().toDateString() + " " + new Date().toLocaleTimeString(); // Add the time that user end
  totalData.threshold[0] = document.getElementById("range").value;
  // After the user stop the program the data will be sended to the backend

  if (intervalId !== null) {
    // sendToBackend(e)
    clearTotalData();

    clearInterval(intervalId); // Clear the interval
    intervalId = null;
    
  }
}

// Calculates and returns a correlation matrix for the current datasets
function calculateCorrelationMatrix() {
  const sliceSize = parseInt(
    document.getElementById("sliceSizeSelect").value,
    10
  );
  const correlationMatrix = [];
  for (let i = 0; i < datasets.length; i++) {
    const row = [];
    for (let j = 0; j < datasets.length; j++) {
      if (i === j) {
        row.push(1);
      } else if (i >= j) {
        let array1 = datasets[i].data.slice(0, sliceSize);
        let array2 = datasets[j].data.slice(0, sliceSize);

        if (array1.length == array2.length && array1.length == sliceSize) {
          const correlation = pearsonCorrelation(array1, array2).toFixed(2);

          let string = '';
          string = datasets[i].label +","+datasets[j].label

          if (correlation >= totalData.threshold[0] && correlation <= totalData.threshold[1]) {
        
            if (!correlationObject.correlatedSeries.includes(string)){
                correlationObject.correlatedSeries.push(string);
                correlationObject.startTime.push(new Date().toDateString() + " " + new Date().toLocaleTimeString());
                correlationObject.endTime.push(new Date().toDateString() + " " + new Date().toLocaleTimeString());
                correlationObject.threshold.push([correlation]);
               

            }else{
                let index = correlationObject.correlatedSeries.indexOf(string);
                correlationObject.endTime[index]= new Date().toDateString() + " " + new Date().toLocaleTimeString()
                correlationObject.threshold[index].push(correlation)
               
            }   
          }else{
            
                if(correlationObject.correlatedSeries.indexOf(string) != -1){
        
                    let index = correlationObject.correlatedSeries.indexOf(string);
                    let correlated = correlationObject.correlatedSeries[index].split(',');

                    let appendedCode = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Correlation detected from ${correlationObject.startTime[index]} to ${correlationObject.endTime[index]}
                    between ${correlated[0]} and ${correlated[1]} !
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`; 
                    document.getElementById("notificationContent").insertAdjacentHTML("afterbegin", appendedCode);

                    correlationObject.correlatedSeries.splice(index,1);
                    correlationObject.startTime.splice(index,1);
                    correlationObject.endTime.splice(index,1);
                    correlationObject.threshold.splice(index,1);

                }
            }  
          row.push(correlation);
        } else {
          row.push(NaN);
        }
      } else {
        row.push("-");
      }
    }
    correlationMatrix.push(row);
  }
  return correlationMatrix;
}

function pushNotification() {

   
}

// Updates the display to show the current correlation matrix
function updateCorrelationDisplay() {
  const correlationMatrix = calculateCorrelationMatrix();
  const correlationDisplay = document.getElementById("correlationDisplay");
  let correlationHTML = '<table class="correlation-table table table-striped">';

  // Transposing the header row and the first column
  correlationHTML += "<tr><th></th>";
  correlationMatrix.forEach((_, rowIndex) => {
    correlationHTML += `<th>${datasets[rowIndex].label}</th>`;
  });
  correlationHTML += "</tr>";

  // Adding dataset labels and transposing data cells
  datasets.forEach((dataset, columnIndex) => {
    correlationHTML += `<tr><th>${dataset.label}</th>`;
    correlationMatrix.forEach((row) => {
      let value = row[columnIndex];
      let cellClass = "heatmap-cell ";
      if (value === "-") {
        cellClass += "undefined";
      } else if (!isNaN(value)) {
        const numValue = parseFloat(value);
        if (numValue >= 0.8 && numValue <= 1) {
          cellClass += "very-high";
        } else if (numValue >= 0.6 && numValue < 0.8) {
          cellClass += "high";
        } else if (numValue >= 0.4 && numValue < 0.6) {
          cellClass += "medium";
        } else if (numValue >= 0.2 && numValue < 0.4) {
          cellClass += "low";
        } else if (numValue > 0 && numValue < 0.2) {
          cellClass += "very-low";
        } else if (numValue > -0.2 && numValue < 0) {
          cellClass += "low-negative";
        } else if (numValue > -0.4 && numValue <= -0.2) {
          cellClass += "medium-negative";
        } else if (numValue > -0.6 && numValue <= 0.4) {
          cellClass += "high-negative";
        } else if (numValue >= -1 && numValue <= 0.6) {
          cellClass += "very-high-negative";
        }
      } else {
        cellClass += "undefined";
      }
      correlationHTML += `<td class="${cellClass}">${value}</td>`;
    });
    correlationHTML += "</tr>";
  });

  correlationHTML += "</table>";
  correlationDisplay.innerHTML = correlationHTML;
}

// Initialize and set event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  chart = setupChart();
  await selectOptions();

  document.getElementById("startButton").addEventListener("click", startDataUpdates);
  document.getElementById("stopButton").addEventListener("click", stopDataUpdates);
  document.getElementById("addSeriesButton").addEventListener("click", addSeries);
  document.getElementById("deleteSeriesButton").addEventListener("click", deleteSeries);
});
