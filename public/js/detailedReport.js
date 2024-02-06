import { sendDetailsReportData } from './sendToBackend.js';


let selectedData, sortedMonthsObj, detectedData, myBarChart, myBarChartH;


document.addEventListener("DOMContentLoaded", async (e) => {
    const selectedDataString = localStorage.getItem('selectedData');


    if (!selectedDataString) {
        console.log('No selected data available');
        return;
    }


    selectedData = JSON.parse(selectedDataString);

    detectedData = await sendDetailsReportData(e, selectedData.CorrName);

    let data_avg = detectedData.numberOfFreq[3]
    let data_number_freq = detectedData.numberOfFreq[0]

    // show information about the data   it in front end
    let htmlInfoContent = `
                        <h6 class="card-title-small">Data Name: <b>${selectedData.CorrName}</b> </h6>
                        <h6 class="card-title-small">Added Date: <b> ${selectedData.CorrDateAdded[2] + '/' + selectedData.CorrDateAdded[1] + '/' + selectedData.CorrDateAdded[0]}</b></h6>
                        <h6 class="card-title-small">Last Search Date: <b>${selectedData.CorrDateEnded[2] + '/' + selectedData.CorrDateEnded[1] + '/' + selectedData.CorrDateEnded[0]}</b></h6>
                        <h6 class="card-title-small">Maximum Threshold: <b>${Math.max(...selectedData.SetThreshold)}</b></h6>
                        <h6 class="card-title-small">Minimum Threshold: <b>${Math.min(...selectedData.SetThreshold)}</b></h6>   
                        
                
`

    // Get the top ten entries from dD.CorrName
    let topTen = Object.entries(data_number_freq.CorrName)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    let topTenObject = topTen.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});


    // take the top 3 data then show it in front end
    for (let i = 0; i < 3; i++) {
        let elementId = `TotalDeteNumber-top${i + 1}`;
        let element = document.getElementById(elementId);

        if (element) {
            element.innerHTML = `${topTen[i][0]}<b> detected ${topTen[i][1]}</b> times.`;
        }
    }



    // create the bar chart and pie chart 
    createPieChart(Object.keys(topTenObject), Object.values(topTenObject))
    // send the year as defualt value for first time 
    sortedMonthsObj = sortMonths(detectedData.numberOfFreq[1].months)


    //drow the chart
    myBarChart = BarChart(sortedMonthsObj,'Number of detected', 'months', 'barChart', myBarChart)
    myBarChartH = BarChart(data_number_freq.CorrName, 'Total detected','Data name', 'barChartH', myBarChartH)

    //avgResults
    for (const [key, value] of Object.entries(data_avg)) {

        let htmlAvgContent = ` 
        <h6 class="card-title-small">Average of <b>${key} </b> Thresold : <b>${value.avgThreshold}  </b>and Window Size :<b>${value.avgWindowSize}</b></h6>
        <hr>
        
        `
        document.getElementById('avgContainer').insertAdjacentHTML("afterbegin", htmlAvgContent);
    }

    document.getElementById('infoContainer').insertAdjacentHTML("afterbegin", htmlInfoContent);
    document.getElementById('totalDetected').innerText = selectedData.NoOfCorr
    document.getElementById('barchart_id').innerText = 'Bar Chart: All detected data wth ' + selectedData.CorrName + " by Time "
    document.getElementById('piechart_id').innerText = 'Pie Chart: Distribution of highest 10 Detected Data Correlated with ' + selectedData.CorrName
    document.getElementById('barchartH_id').innerText = 'Bar Chart: all Detected Data Correlated with ' + selectedData.CorrName
 
});

function createPieChart(dataLabels, dataValues) {
    let color = dataLabels.map(() => getRandomColor());

    new Chart(document.querySelector('#pieChart'), {
        type: 'pie',
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataValues,
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
}
//sort the object key that contain months 
function sortMonths(monthsObj) {
    const monthOrder = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12

    };

    // Convert object to array, sort it, and convert back to object
    let sortedMonthsObj = Object.entries(monthsObj)
        .sort((a, b) => monthOrder[a[0]] - monthOrder[b[0]])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    console.log(sortedMonthsObj);
    return sortedMonthsObj
}


// Function to generate a random color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`; // Use rgba for semi-transparent colors
}


document.getElementById('timeframeSelect').addEventListener('change', function () {
    let selectedValue = this.value;

    // This will log 'year', 'month' depending on the selection

    if (selectedValue === 'year') {
        myBarChart = BarChart(sortedMonthsObj,'Number of detected', 'months', 'barChart', myBarChart)


    }
    else {
        console.log(detectedData.numberOfFreq[2]);
        myBarChart = BarChart(detectedData.numberOfFreq[2].week,'Number of detected', 'number of weeks in a month', 'barChart', myBarChart)
    }


});


function BarChart(data,xlabel,ylabel, loc, chartname) {
    let color = Object.keys(data).map(() => getRandomColor())

    if (chartname) {
        console.log('destory');
        chartname.destroy(); // Destroy the existing chart
    }

    chartname = new Chart(document.getElementById(loc), {
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
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text:ylabel 
                    },
                    ticks: {
                        stepSize: 5, // Ensure y-axis values are integers
                        precision: 0  // No decimal places
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: xlabel
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        boxWidth: 10
                    }
                }
            }
        }
    });

    return chartname
}
