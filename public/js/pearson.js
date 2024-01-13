// Calculates Pearson correlation coefficient between two arrays
export function pearsonCorrelation(x, y) {
    let computationCounter = 0;
    
const n = x.length;
    
      // Calculate the mean of x and y
      const meanX = x.reduce((sum, value) => sum + value, 0) / n;
      computationCounter += x.length + 1;
      const meanY = y.reduce((sum, value) => sum + value, 0) / n;
      computationCounter += x.length + 1;
       
      // Calculate the numerator and denominators
      let numerator = 0;
      let denominatorX = 0;
      let denominatorY = 0;
   
      
      for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
       
        computationCounter++;
  
        const diffY = y[i] - meanY;
        computationCounter++;
    
        numerator += diffX * diffY;
        computationCounter += 2;
  
        denominatorX += diffX ** 2;
        computationCounter += 2;
  
        denominatorY += diffY ** 2;
        computationCounter += 2;
      }
    
     
      // Calculate the correlation coefficient
      let correlation = numerator / Math.sqrt(denominatorX * denominatorY);
      computationCounter += 3;
      
      console.log(computationCounter);
      if(isNaN(correlation)){
        correlation = 0
        return correlation;
      }else{
       return correlation; 
      }
      
      
}
