export function pearsonCorrelation(x, y) {
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