import { pearsonCorrelation } from "./pearson.js"

export let employeeFullName = [];
export let employeeSalaryData = [];
export let testName = [];
export let testSalaryData = [];

export function updateData() {
    let number
  
    if (employeeSalaryData.length < 15) {
      number = Math.floor(Math.random() * 10000) + 1;
      employeeSalaryData.push(number);
    } else {
      employeeSalaryData.shift();
      number = Math.floor(Math.random() * 10000) + 1;
      employeeSalaryData.push(number);
    }
  }
  
  export function updateLabels() {
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

 export function calc(){
    const arr1 = employeeSalaryData.slice(-5);
    const arr2 = testSalaryData.slice(-5);
  
    // Ensure both arrays have the same length
    if (arr1.length !== arr2.length) {
      throw new Error('Arrays must have the same length for correlation calculation.');
    }
    // [1,2,3,45,6,7,8,9,10,11,12,13,14,15,1,2,3,4]
  
    let correlation = pearsonCorrelation(arr1, arr2).toFixed(2)
    document.getElementById('correlationValue').innerText = correlation
    
  }
  
  
 export function updateTestData() {
    let number
    if (testSalaryData.length < 15) {
      number = Math.floor(Math.random() * 10000) + 1;
      testSalaryData.push(number);
    } else {
      testSalaryData.shift();
      number = Math.floor(Math.random() * 10000) + 1;
      testSalaryData.push(number);
    }
  }
  
 export function updateTestLabels() {
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
  