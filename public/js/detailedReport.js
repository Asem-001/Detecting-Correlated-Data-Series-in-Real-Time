
import { sendDetailsReportData } from './sendToBackend.js';
let selectedData,detectedData
document.addEventListener("DOMContentLoaded", async (e) => {
    const selectedDataString = localStorage.getItem('selectedData');
    const allData = localStorage.getItem('allData')
//    console.log(allData);
   
    if (!selectedDataString) {
        console.log('No selected data available');
        return;
    }


    selectedData = JSON.parse(selectedDataString);
    console.log('Selected Data:', selectedData);

    detectedData = await sendDetailsReportData(e, selectedData.CorrName);
    console.log('From JS page:', detectedData);

    // Rest of your code...

    let htmlInfoContent = `
                        <h6 class="card-title-small">Data Name: <b>${selectedData.CorrName}</b> </h6>
                        <h6 class="card-title-small">Added Date: <b> ${selectedData.CorrDateAdded[2] + '/' + selectedData.CorrDateAdded[1] + '/' + selectedData.CorrDateAdded[0]}</b></h6>
                        <h6 class="card-title-small">Last Search Date: <b>${selectedData.CorrDateEnded[2] + '/' + selectedData.CorrDateEnded[1] + '/' + selectedData.CorrDateEnded[0]}</b></h6>
                        <h6 class="card-title-small">Maximum Threshold: <b>${Math.max(...selectedData.SetThreshold)}</b></h6>
                        <h6 class="card-title-small">Minimum Threshold: <b>${Math.min(...selectedData.SetThreshold)}</b></h6>
`
    document.getElementById('infoContainer').innerHTML = htmlInfoContent
    document.getElementById('totalDetected').innerText = selectedData.NoOfCorr
    
    document.getElementById('barchart_id').innerText = 'Bar Chart: All detected data wth '+selectedData.CorrName +" by Time "
    document.getElementById('piechart_id').innerText = 'Pie Chart: Distribution of Detected Data Correlated with '+selectedData.CorrName 

    let dD = detectedData.numberOfFreq[0]
    let topThree = Object.entries(dD.CorrName)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    console.log(topThree);
    for (let i = 0; i < topThree.length; i++) {
        let elementId = `TotalDeteNumber-top${i + 1}`;
        let element = document.getElementById(elementId);
    
        if (element) {
            element.innerHTML = `${topThree[i][0]}<b> detected ${topThree[i][1]}</b> times.`;
        }
    }
    
     const colorArray = Object.values(dD.CorrName).map(() => getRandomColor());
     let color = Object.keys(dD.CorrName).map(() => getRandomColor())
    console.log(colorArray);
    new Chart(document.querySelector('#pieChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(dD.CorrName),
            datasets: [{
                data: Object.values(dD.CorrName),
                backgroundColor: color,
               
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    color: '#000', // Label text color
                    anchor: 'end', // Position of the label
                    align: 'start', // Alignment of the label text
                    formatter: (value, context) => {
                        // Displaying both label and value for each slice
                        return context.chart.data.labels[context.dataIndex] + ': ' + value;
                    },
                    font: {
                        size: 16 // Font size for labels
                    }
                }
            }
        }

    });

    BarChart(detectedData.numberOfFreq[1].months,'year')
});
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b}, 0.7)`;
}


document.getElementById('timeframeSelect').addEventListener('change', function() {
    let selectedValue = this.value;
    
    console.log('Selected value:', selectedValue); // This will log 'year', 'month', or 'week' depending on the selection
     
      if(selectedValue === 'year'){
        BarChart(detectedData.numberOfFreq[1].months,selectedValue)
        console.log(detectedData.numberOfFreq[1].months);
        
      }
      else {
        BarChart(detectedData.numberOfFreq[2].week,selectedValue)
        console.log(detectedData.numberOfFreq[2].week);

      }
     
    
});

let myBarChart;
function BarChart(data,name) {
    let color = Object.keys(data).map(() => getRandomColor())

    if (myBarChart) {
        console.log('destory');
        myBarChart.destroy(); // Destroy the existing chart
    }
    myBarChart = new Chart(document.querySelector('#barChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(data), // Assuming these are your month labels
            datasets: [{
                
                data: Object.values(data),
                backgroundColor: color,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of detected'
                    },
                    ticks: {
                        stepSize: 1, // Ensure y-axis values are integers
                        precision: 0  // No decimal places
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: name
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        boxWidth: 20
                    }
                }
            }
        }
    });
    
    
}