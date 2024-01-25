const { CorrelationData, DetectedCorrelation, ControlPanelSetting } = require('../models/coreelation')
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, or, and, orderBy, Timestamp, getDocs, query, where, startAt } = require("firebase/firestore");
const { searchUser, searchUserID, getAllUsers, deleteUser, updateUser, addUser, } = require('./usersfunctions')

const db = require("../models/config")




async function addCorrData(CorrName, SetThreshold, CorrDateStart, CorrDateEnd, NoOfCorr) {
  const date = new Date

  const corr = new CorrelationData(CorrName, SetThreshold, CorrDateStart, CorrDateEnd, NoOfCorr)

  await setDoc(doc(db, "Correlation", CorrName + ''), corr).then(() => {
    console.log(`The Correlation ${corr.CorrName} successfully added !`)
  });
  return CorrName + ''
}

// search for correaltion data by corrName in data base
async function CorrelationSearch(data) {
  let d;
  const q = await query(collection(db, 'Correlation'), where("CorrName", "==", data));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    d = doc.data();
  });
  //check if doc is exist
  if (d) {
    return d;
  }
  else {
    console.log('data unexists!!');
    return undefined
  }
}
// search for correaltion data by corrName in data base
async function SearchDetectedCorrelations(data) {
  let d;

  const q = await query(collection(db, 'DetectedCorrelation'), or(where("FirstNameID", "==", data), where("SecondNameID", "==", data)));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    d = doc.data();
    console.log(d);
  });

  //check if doc is exist
  if (d) {
    return d;
  }
  else {
    console.log('Detected Data unexists!!');
    return undefined
  }
}
async function SearchCorrelationsByRangeDate(startRange, endRange) {
  let dates = [];
  console.log(startRange, endRange);

  const q = await query(collection(db, 'Correlation'), where("CorrDateAdded", "array-contains-any", [startRange[0], startRange[1], startRange[2]]));



  const querySnapshot = await getDocs(q);
  
  querySnapshot.forEach((doc) => {
    const corrDateAdded = doc.data().CorrDateAdded; // Assuming format [year, month, day]
    const corrDateEnded = doc.data().CorrDateEnded; // Assuming format [year, month, day]

    // Create Date objects for comparison
    const addedDateObj = new Date(corrDateAdded[0], corrDateAdded[1] , corrDateAdded[2]); // months are 0-indexed in JS
    const endedDateObj = new Date(corrDateEnded[0], corrDateEnded[1] , corrDateEnded[2]);
    const comparisonDateObj = new Date(startRange[0], startRange[1], startRange[2]); // started range
    const comparisonDateObj2 = new Date(endRange[0], endRange[1], endRange[2]); // ended range

    // Check if CorrDateAdded is after or on the comparison date AND CorrDateEnded is before or on the comparison date
    if (addedDateObj >= comparisonDateObj && endedDateObj <= comparisonDateObj2) {
      dates.push(doc.data());
    }
});
  
  // console.log(dates);
  //check if doc is exist
  if (dates.length != 0) {
    return dates;
  }
  else {
    console.log('this date Data unexists!!');
    return undefined
  }
}

// update specific attribute from by id  correlation data 
async function updateCorrleationData(id, newdata) {

  try {
    await updateDoc(doc(db, "Correlation", id), newdata);
    // console.log(`Successfully updated Correlation with ID: ${id}`);
  } catch (error) {
    console.error(`Error updating Correlation with ID ${id}:`, error);
  }
}

async function addDetectCorr(FirstCorrName, SecondCorrName, Threshold, CorrTimeStart, CorrTimeEnd) {
  const date = new Date
  // Create a new correlation object with given parameters
  const corr = new DetectedCorrelation(FirstCorrName, SecondCorrName, Threshold, CorrTimeStart, CorrTimeEnd)

  // Search for the ID name of the first correlation
  const firstID = await CorrelationSearch(FirstCorrName)

  // Search for the ID name of the second correlation
  const SecondID = await CorrelationSearch(SecondCorrName)

  // If either correlation does not exist, log an error message and exit the function
  if (!firstID | !SecondID) {
    // console.log(`The ${firstID.CorrName} or ${SecondID.CorrName} is not exist!!`);
    return undefined
  }
  else {
    // If both correlations exist, log a success message
    // console.log(`The data ${firstID.CorrName} and ${SecondID.CorrName} is exist`);

    // Update the count of the first correlation
    await updateCorrleationData(firstID.CorrName, { NoOfCorr: firstID.NoOfCorr + 1 })

    // Update the count of the second correlation
    await updateCorrleationData(SecondID.CorrName, { NoOfCorr: SecondID.NoOfCorr + 1 })
  }

  // Add the correlation to the database with a timestamp as its identifier
  await setDoc(doc(db, "DetectedCorrelation", "" + date.getTime()), corr).then(() => {
    // console.log(`The Detected Correlation occur between ${FirstCorrName, SecondCorrName} successfully added !`)
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

// Add or update Control Panel settings for a specific admin. 
// This includes creating new settings if they don't exist, 
// or updating the last set of settings if they do.
async function addControlPanelInfo(AdminID, SetThreshold, WindowSize) {
  // Asynchronously searches for a user with the given AdminID.
  let checkIdExisting = await searchUser(AdminID);

  // Checks if the user is found. If not, the function returns early.
  if (checkIdExisting == null) {
    return;
  }

  // Asynchronously retrieves Control Panel information for the given AdminID.
  let adminid = await searchControlPanelinfo(AdminID);

  // Logs the retrieved admin information to the console.
  console.log(adminid);

  // Checks if the admin information is not found.
  if (adminid == null) {
    // If not found, creates a new ControlPanelSetting object with the provided parameters.
    const cnd = new ControlPanelSetting(AdminID, SetThreshold, WindowSize);

    // Asynchronously sets the document in the database with the new Control Panel settings.
    // Uses the AdminID as the document identifier.
    await setDoc(doc(db, "ControlPanelSetting", AdminID + ''), cnd).then(() => {
      // Logs a success message to the console after the document is set.
      console.log(`The admin ${cnd.AdminID} has successfully set new Control Panel info!`);
    });
  } else {
    // If the admin information is found, updates the existing document.
    await updateDoc(doc(db, "ControlPanelSetting", AdminID), {
      SetThreshold: SetThreshold,
      WindowSize: WindowSize
    }).then(() => {
      // Logs a success message to the console after the document is updated.
      console.log(`The admin ${AdminID} has successfully updated existing Control Panel info!`);
    });
  }


}
async function searchControlPanelinfo(id) {
  try {
    // Create a reference to the document
    const docRef = doc(db, 'ControlPanelSetting', id);

    // Fetch the document data
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {

      let cnd = docSnapshot.data()
      return cnd;

    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;  // Re-throw the error to handle it outside if necessary
  }
}




module.exports = { addDetectCorr, updateCorrleationData, CorrelationSearch, addCorrData, getAllCorrelation, addControlPanelInfo, SearchDetectedCorrelations, SearchCorrelationsByRangeDate }

