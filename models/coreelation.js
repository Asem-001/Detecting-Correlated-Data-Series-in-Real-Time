class Correlation {
    constructor( CorrName,Threshold,CorrDateStart,CorrDateEnd,NoOfCorr) {
        
        return {
            "CorrName":CorrName,
            "Threshold":Threshold,
            "CorrDateStart":CorrDateStart,
            'CorrDateEnd': CorrDateEnd,
            "NoOfCorr": NoOfCorr,
        }
    }

}
class DetectedCorr{
    constructor( CorrName,DataID,corrType,corrTimeStart,corrTimeEnd) {
        
        return {
            "CorrName":CorrName,
            "DataID":DataID,
            "corrType":corrType,
            'corrTimeStart': corrTimeStart,
            'corrTimeEnd':corrTimeEnd,
        }
    }

}

module.exports = {"Correlation":Correlation, 
                  "DetectedCorr":DetectedCorr}