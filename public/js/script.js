function pearsonCorrelation(x, y) {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length for correlation calculation.');
  }

  const n = x.length;

  // Calculate the mean of x and y
  const meanX = x.reduce((sum, value) => sum + value, 0) / n;
  const meanY = y.reduce((sum, value) => sum + value, 0) / n;

  // Calculate the numerator and denominators
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;

    numerator += diffX * diffY;
    denominatorX += diffX ** 2;
    denominatorY += diffY ** 2;
  }

  // Calculate the correlation coefficient
  const correlation = numerator / Math.sqrt(denominatorX * denominatorY);

  return correlation;
}

let employeeFullName = [];
let employeeSalaryData = [];
let testName = [];
let testSalaryData = [];
let counter = 0;

function calc(){
  const arr1 = employeeSalaryData.slice(-5);
  const arr2 = testSalaryData.slice(-5);
  console.log(arr1);
  // Ensure both arrays have the same length
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length for correlation calculation.');
  }
  // [1,2,3,45,6,7,8,9,10,11,12,13,14,15,1,2,3,4]

  let correlation = pearsonCorrelation(arr1, arr2).toFixed(2)
  document.getElementById('correlationValue').innerText = correlation
  
}

function updateData() {
  if (employeeSalaryData.length < 15) {
    number = Math.floor(Math.random() * 10000) + 1;
    employeeSalaryData.push(number);
  } else {
    employeeSalaryData.shift();
    number = Math.floor(Math.random() * 10000) + 1;
    employeeSalaryData.push(number);
  }
}

function updateLabels() {
  let currentDate = new Date();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let formattedTime = `${hours}:${minutes}:${seconds}`;

  if (testName.length < 15) {
    testName.push(formattedTime);
  } else {
    testName.shift();
    testName.push(formattedTime);
  }
}

function updateTestData() {
  if (testSalaryData.length < 15) {
    number = Math.floor(Math.random() * 10000) + 1;
    testSalaryData.push(number);
  } else {
    testSalaryData.shift();
    number = Math.floor(Math.random() * 10000) + 1;
    testSalaryData.push(number);
  }
}

function updateTestLabels() {
  let currentDate = new Date();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  let formattedTime = `${hours}:${minutes}:${seconds}`;

  if (employeeFullName.length < 15) {
    employeeFullName.push(formattedTime);
  } else {
    employeeFullName.shift();
    employeeFullName.push(formattedTime);
  }
}


async function drawChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  const chartData = {
    labels: employeeFullName,
    datasets: [
      {
        label: "Annual salary",
        data: employeeSalaryData,
        borderWidth: 1,
      },
    
      {
        label: "test other line ",
        data: testSalaryData,
        borderWidth: 1,
      },
    ],
  };

  const chartConfig = {
    type: "line",
    data: chartData,
  };

  const theChart = new Chart(ctx, chartConfig);

  setInterval(async function () {
    updateData();
    updateLabels();
    updateTestLabels();
    updateTestData();
    calc()
    // Update chart data
    theChart.data.labels = employeeFullName.slice(); // create a copy
    theChart.data.datasets[0].data = employeeSalaryData.slice(); // create a copy
    theChart.data.labels = testName.slice();
    theChart.data.datasets[1].data = testSalaryData
    // Update the chart
    theChart.update();
    
  
     
    
  
  
  }, 2300);
}

drawChart();
