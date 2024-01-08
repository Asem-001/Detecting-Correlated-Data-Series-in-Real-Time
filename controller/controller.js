const { timeStamp, log } = require("console");
const db = require("../models/config")
const userclass = require("../models/users")
const { CorrelationData, DetectedCorrelation } = require('../models/coreelation')
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, Timestamp, getDocs, query, where } = require("firebase/firestore");

//this for gathering the IDs for current detection
let IDforEndDate = []

module.exports = {

  index: async (req, res) => {
    //  testdb()

    res.render("index", {
      title: "Home page"

    });
  },
  addCorrelationData: async (req, res) => {
    // Extract parcel data from request body
    let data = req.body.parcel;

    // Check if end date is empty
    if (data.end.length == 0) {
      // Loop through names in data
      for (let i = 0; i < data.names.length; i++) {
        // Push the result of addCorrData function into IDforEndDate array, the result will be the ID of this correlation Data
        IDforEndDate.push(await addCorrData(data.names[i], data.threshold, data.start[i], '', 0));
      }
    } else {
      // Fetch all correlation data
      const alldata = await getAllCorrelation();

      // Iterate over each document in alldata
      alldata.forEach((doc) => {
        // If the id of the document is included in IDforEndDate array
        if (IDforEndDate.includes(doc.id)) {
          // Update the correlation data with the new end date
          updateCorrleationData(doc.id, { CorrDateEnd: data.end[0] });
        }
      });
      // Clear IDforEndDate array
      IDforEndDate.splice(0, IDforEndDate.length);
    }
    // Redirect to home page
    res.redirect('/');

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



async function addCorrData(CorrName, Threshold, CorrDateStart, CorrDateEnd, NoOfCorr) {
  const date = new Date

  const corr = new CorrelationData(CorrName, Threshold, CorrDateStart, CorrDateEnd, NoOfCorr)

  await setDoc(doc(db, "Correlation", "" + date.getTime()), corr).then(() => {
    console.log(`The Correlation ${corr.CorrName} successfully added !`)
  });
  return date.getTime() + ''
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

async function addDetectCorr(FirstCorrName, SecondCorrName, FirstDataID, SecondDataID, Threshold, CorrTimeStart, CorrTimeEnd) {
  const date = new Date

  const corr = new DetectedCorrelation(FirstCorrName, SecondCorrName, FirstDataID, SecondDataID, Threshold, CorrTimeStart, CorrTimeEnd)

  await setDoc(doc(db, "DetectedCorrelation", "" + date.getTime()), corr).then(() => {
    console.log(`The Correlation ${corr.CorrName} successfully added !`)
  });
}
