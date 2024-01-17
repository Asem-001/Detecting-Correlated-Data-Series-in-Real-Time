const { CorrelationData, DetectedCorrelation } = require('../models/coreelation')
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, Timestamp, getDocs, query, where } = require("firebase/firestore");
const db = require("../models/config")




async function addCorrData(CorrName, Threshold, CorrDateAdded, CorrDateEnded, NoOfCorr) {
    const date = new Date
  
    const corr = new CorrelationData(CorrName, Threshold, CorrDateAdded, CorrDateEnded, NoOfCorr)
  
    await setDoc(doc(db, "Correlation", CorrName + ''), corr).then(() => {
      console.log(`The Correlation ${corr.CorrName} successfully added !`)
    });
    return CorrName + ''
  }
  
  async function CorrelationSearch(data) {
    let d;
    const q = await query(collection(db, 'Correlation'), where("CorrName", "==", data));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      d = doc.data();
    });
    if (d) {
      return d;
    }
    else {
      console.log('data unexists!!');
      return undefined
    }
  }
  
  async function updateCorrleationData(id, newdata) {
  
    try {
      await updateDoc(doc(db, "Correlation", id), newdata);
      console.log(`Successfully updated Correlation with ID: ${id}`);
    } catch (error) {
      console.error(`Error updating Correlation with ID ${id}:`, error);
    }
  }
  
  async function addDetectCorr(FirstCorrName, SecondCorrName, Threshold, CorrTimeStart, CorrTimeEnd) {
    const date = new Date
  
    const corr = new DetectedCorrelation(FirstCorrName, SecondCorrName, Threshold, CorrTimeStart, CorrTimeEnd)
  
    await setDoc(doc(db, "DetectedCorrelation", "" + date.getTime()), corr).then(() => {
      console.log(`The Correlation ${corr.CorrName} successfully added !`)
    });
  }

  
  

async function getAllCorrelation() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'Correlation'));
  
      // usersSnapshot.forEach((doc) => {
  
      //     console.log(doc.id, " => ", doc.data());
      //   });
      return usersSnapshot
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;  // Re-throw the error if you want to handle it outside this function
    }
  
  }
  
  module.exports = {addDetectCorr, updateCorrleationData, CorrelationSearch, addCorrData, getAllCorrelation}

  