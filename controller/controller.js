const { timeStamp, log } = require("console");
const db = require("../models/config")
const userclass = require("../models/users")
const { CorrelationData, DetectedCorrelation } = require('../models/coreelation')
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, Timestamp, getDocs, query, where } = require("firebase/firestore");
const coreelation = require("../models/coreelation");
const { name } = require("ejs");


let IDforEndDate = []

module.exports = {

  index: async (req, res) => {
   
    res.render("index", {
      title: "Home page"

    });
  },
  addCorrelationData: async (req, res) => {
    // Extract parcel data from request body
    let data = req.body.parcel;



    // Loop over each name in the data.names array
    for (let i = 0; i < data.names.length; i++) {

      // Perform the CorrelationSearch operation asynchronously for each name
      let doc = await CorrelationSearch(data.names[i])
      console.log(doc);

      // If the document doesn't exist and there's no end date, add correlation data
      if (!doc & data.endDate.length == 0) {
        IDforEndDate.push(await addCorrData(data.names[i], data.threshold, data.addDate[i], '', 0));
      }
      // If the document doesn't exist and there is an end date, add correlation data with the end date
      else if (!doc & data.endDate.length > 0) {
        IDforEndDate.push(await addCorrData(data.names[i], data.threshold, data.addDate[i], data.endDate[0], 0));
      }
      // If the document exists, update the correlation data
      else {
        updateCorrleationData(data.names[i], {
          SetThreshold: data.threshold,
          CorrDateEnded: data.endDate[0]
        });
      }
    }

    // Redirect to the home page after processing all names
    res.redirect('/');


  },
  //This fucntion add the detected information that occur between two time series
  addDetectCorrelation:(req, res) =>{
    let date = new Date()
    const data = {'names':['timeseris_1','timeseris_2'],
                  'time':[date.toLocaleTimeString(), date.toLocaleTimeString()],
                  'threshold':[0.7]

  }
  console.log(data);

    // addDetectCorr(data.names[0],data.names[1],data.threshold, data.time[0], data.time[1])

    
  },

  adminreports: (req, res) => {

    res.render("adminreports", {
      title: "Reports",
    });
  },

  dashboard: (req, res) => {

    res.render("dashboard", {
      title: "Dashboard",
    });
  },

  profile: (req, res) => {

    res.render("profile", {
      title: "Profile",
    });
  }


};

async function testdb() {

  // add admin
  addUser('ahmed', 'khaled', 'ahmed@hotmail.com', true, null)
  //add user with his admin
  addUser("ali", 'mohammed', 'ali@hotmail.com', false, await searchUserID('ahmed', 'khaled'))

  // add corr data
  addCorrData('youtube', 0.79, '2023/28/12', '2023,/29/12', 0)

  //update admin last name
  updateUser(await searchUserID('ahmed', 'khaled'), { Lname: 'saleh' })
  // search for user by his id 
  console.log(await searchUser('1703788699748'))

  // delete admin 
  //  await deleteUser(await searchUserID('ahmed','saleh'))
}


async function addUser(Fname, Lname, Email, IsAdmin, adminID) {
  const date = new Date

  const user = new userclass(Fname, Lname, Email, IsAdmin, adminID)

  const docRef = await setDoc(doc(db, "Users", "" + date.getTime()), user).then(() => {
    console.log(`The user ${user.fname} successfully added !`)
  });

}
async function updateUser(id, newdata) {

  try {
    await updateDoc(doc(db, "Users", id), newdata);;
    console.log(`Successfully updated user with ID: ${id}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
  }
}

async function deleteUser(id) {
  try {
    const userToDelete = await searchUser(id);
    console.log(userToDelete.IsAdmin);

    if (userToDelete.IsAdmin) {
      const usersSnapshot = await getAllUsers();
      await deleteDoc(doc(db, 'Users', id));

      for (const doc of usersSnapshot.docs) {
        const user = doc.data();
        console.log("doc.AdminID == id", user.AdminID == id, user);

        if (user.AdminID == id) {
          console.log(user.AdminID == id);
          const updatedUser = await searchUserID(user.Fname, user.Lname);
          console.log(updatedUser, user.Fname, user.Lname);
          await updateUser(updatedUser, { "AdminID": null });
        }
      }

      console.log(`Successfully deleted Admin with ID: ${id}`);
    } else {
      await deleteDoc(doc(db, 'Users', id));
      console.log(`Successfully deleted user with ID: ${id}`);
    }

  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
  }
}

async function getAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'Users'));

    usersSnapshot.forEach((doc) => {

      console.log(doc.id, " => ", doc.data());
    });
    return usersSnapshot
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;  // Re-throw the error if you want to handle it outside this function
  }

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
async function searchUserID(Fname, Lname) {
  try {
    let matchedDate = null; // Initialize to null
    const usersSnapshot = await query(collection(db, 'Users'), where("Fname", '==', Fname), where("Lname", '==', Lname));
    const querySnapshot = await getDocs(usersSnapshot);

    querySnapshot.forEach((doc) => {
      matchedDate = doc.id;
    });

    if (matchedDate) {
      return matchedDate; // Return the matched data
    } else {
      console.log("No matching user found.");
      return null; // Return null if no match found
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error if you want to handle it outside this function
  }

}

async function searchUser(id) {
  try {
    // Create a reference to the document
    const docRef = doc(db, 'Users', id);

    // Fetch the document data
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;  // Re-throw the error to handle it outside if necessary
  }
}

function createfirstdoc() {
  doc(db, 'users', '1');
}



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
