class CorrelationData {
    constructor( CorrName,SetThreshold,CorrDateStart,CorrDateEnd,NoOfCorr) {
        
        return {
            "CorrName":CorrName,
            "SetThreshold":SetThreshold,
            "CorrDateStart":CorrDateStart,
            'CorrDateEnd': CorrDateEnd,
            "NoOfCorr": NoOfCorr,
        }
    }
// Meta data
// CorrName: Name of the correlation data, e.g., "time series_1"
// Threshold: Fixed float number set by the user on the home page.
// CorrDateStart: Start date for detecting correlation, when the user presses start on the home page.
// CorrDateEnd: End date for detecting correlation, when the user presses stop on the home page.
// NoOfCorr: Counter indicating how many correlations have been detected for this data.

}
class DetectedCorrelation{
    constructor(FirstCorrName, SecondCorrName,FirstDataID,SecondDataID,DetcThreshold,CorrTimeStart,CorrTimeEnd) {
        
        return {
            "FirstDetectedDataName":FirstCorrName,
            "SecondDetectedDataName":SecondCorrName,
             'FirstDataID':FirstDataID,
             'SecondDataID':SecondDataID,
            "DetcThreshold":DetcThreshold,
            'CorrTimeStart': CorrTimeStart,
            'CorrTimeEnd':CorrTimeEnd,
        }
    }
// Meta data
// FirstDetectedDataName, SecondDetectedDataName : the data names that happen correlation among them 
// FirstDataID, SecondDataID : the its forign key for the data IDs in "Correlation data coolection"
// Threshold: A float number representing the correlation value that was detected in that number
// CorrTimeStart: Start time when detected correlation 
// CorrTimeEnd: End time when detected correlation
}

module.exports = {"CorrelationData":CorrelationData, 
                  "DetectedCorrelation":DetectedCorrelation}


