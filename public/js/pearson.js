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


  document.getElementById("computation").innerText = " " + computationCounter;

  if (isNaN(correlation)) {
    correlation = 0
    return correlation;
  } else {
    return correlation;
  }


}

// @param x , y is the time series we want to calculate
// @param y is the other time want to calculate
// @param Gx ,Gy  is the the last value in the time series will be stored in global variable for each time series
// @param Sx , Sy is the sum of the time series 
// @param Sxx , Syy is the sum of the sequared point in the time series 
// @param Sxy is the sum of multiplication between x and y

export function pearsonEnhanced(x, y, Gx, Gy, Sx, Sy, Sxy, Sxx, Syy) {
  // console.log('Gx, Gy, Sx, Sy, Sxy', Gx, Gy, Sx, Sy, Sxy, Sxx, Syy);
  let [Vx, Vy, c, correlation] = [0.0, 0.0, 0.0, 0.0];
  // console.log('inside the function x', x);
  // console.log('inside the function  y ', y);
  // console.log(Sxy, Sxx, Syy, Vx, Vy, c);
 
  const n = x.length

  if (Sx == 0 ) {
      for (let i = 0; i <x.length; i++) {
       
          Sx += x[i];
          Sxx += (x[i] ** 2);
          Sy += y[i];
          Syy += (y[i] ** 2);

          Sxy += x[i] * y[i];
      }
      // console.log('Sx, Sxx, Sy, Syy, Sxy',Sx, Sxx, Sy, Syy, Sxy);
  }
  else {
      console.log('iam here in Gx');

      // // console.log(x[x.length - 1] != Gx);
      // console.log('test x y',x[0],y[0]);
      Sx =Sx- Gx +x[0]
      // Sx =Sx+x[0];
      Sy =Sy- Gy  +y[0];
      // Sy =Sy+y[0];

      Sxy =Sxy- (Gx * Gy) + (x[0] * y[0]);
      // Sxy =Sxy+ (x[0] * y[0]);
      // console.log('---------------------------------------');

     
      Sxx = Sxx- (Gx ** 2) + (x[0]) ** 2;
      // Sxx = Sxx+ (x[0]) ** 2;

      Syy = Syy- (Gy ** 2) + (y[0])**2;
      // Syy = Syy+ (y[0])**2;
      
      // console.log('---------------------------------------');
    

  }



  // console.log('Sx, Sxx, Sy, Syy, Sxy',Sx, Sxx, Sy, Syy, Sxy);

  // console.log('Gx,', Gx);
  // console.log('Gy,', Gy);
  // console.log('Sx,', Sx);
  // console.log('Sy,',Sy);
  // console.log('Sxy,', Sxy);
  // console.log('Sxx,',  Sxx);
  // console.log('Syy,', Syy);

// calculating the variance 
  Vx = Sxx - ((Sx ** 2) / n);
  Vy = Syy - ((Sy ** 2) / n);

  c = Sxy - ((Sx * Sy) / n);

  let V = Math.sqrt(Vx * Vy);
  correlation = (c / V);
  // console.log('corr:',correlation, Vx, Vy, c, n);
  // console.log( (c / V));


  Gx = x[x.length - 1];
  Gy = y[y.length - 1];
  
  // document.getElementById("computation").innerText = " "+computationCounter;


  if (isNaN(correlation)) {
    
      correlation = 0
  }


  return [correlation, Gx, Gy, Sx, Sy, Sxy, Sxx, Syy];


}