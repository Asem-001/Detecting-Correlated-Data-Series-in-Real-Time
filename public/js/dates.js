// Returns current time as a string
export function getCurrentTime() {
    return new Date().toLocaleTimeString('en-eu');
  }
export function getTimeDate() {
    let date = new Date()
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    let day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }