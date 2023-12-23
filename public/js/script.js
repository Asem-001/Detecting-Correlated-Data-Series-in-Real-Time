import {
  updateTestLabels,
  updateTestData,
  updateLabels,
  updateData,
  employeeFullName,
  employeeSalaryData,
  calc,
  testName,
  testSalaryData
} from './DataHandling.js'


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