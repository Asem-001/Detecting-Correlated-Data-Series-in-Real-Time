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


//*____________________________

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function(e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function(e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

 

})();