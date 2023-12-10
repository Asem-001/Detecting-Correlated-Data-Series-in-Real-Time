import Chart from "chart.js/auto";
import { getRelativePosition } from "chart.js/helpers";

let employeeFullName = [];
let employeeSalaryData = [];
let testName = [];
let testSalaryData = [];

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
