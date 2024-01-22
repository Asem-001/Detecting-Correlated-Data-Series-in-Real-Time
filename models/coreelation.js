class CorrelationData {
    constructor( CorrName,SetThreshold,CorrDateStart,CorrDateEnd,NoOfCorr) {
        
        return {
            "CorrName":CorrName,
            "SetThreshold":SetThreshold,
            "CorrDateAdded":CorrDateStart,
            'CorrDateEnded': CorrDateEnd,
            "NoOfCorr": NoOfCorr,
        }
    }
// Meta data
// CorrName: Name of the correlation data, e.g., "time series_1"
// Threshold: last Fixed float number set  by the user on the home page.
// CorrDateStart: Start date for detecting correlation, when the user presses start on the home page.
// CorrDateEnd: End date for detecting correlation, when the user presses stop on the home page.
// NoOfCorr: Counter indicating how many correlations have been detected for this data.

}
class DetectedCorrelation{
    constructor(FirstDataID,SecondDataID,DetcThreshold,CorrTimeStart,CorrTimeEnd) {
        
        return {
             'FirstNameID':FirstDataID,
             'SecondNameID':SecondDataID,
            'DetcThreshold':DetcThreshold,
            'CorrTimeStart': CorrTimeStart,
            'CorrTimeEnd':CorrTimeEnd,
        }
    }
// Meta data
// FirstDataID, SecondDataID :the data names that happen correlation among them  and the its forign key for the data IDs in "Correlation data coolection"
// Threshold: A float number representing the correlation value that was detected in that number
// CorrTimeStart: Start time when detected correlation 
// CorrTimeEnd: End time when detected correlation
}
class ControlPanelSetting{
    constructor(AdminID,SetThreshold,WindowSize) {
        
        return {
             'AdminID':AdminID,
             'SetThreshold':SetThreshold,
             'WindowSize':WindowSize,
        }
    }
// Meta data
// AdminID, the id for who add this setting
// Threshold: A float number representing the correlation value that was detected in that number

}
module.exports = {"CorrelationData":CorrelationData, 
                  "DetectedCorrelation":DetectedCorrelation, "ControlPanelSetting":ControlPanelSetting}


