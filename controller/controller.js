const { timeStamp, log } = require("console");
const db = require("../models/config")
const userclass = require("../models/users")
const { CorrelationData, DetectedCorrelation } = require('../models/coreelation')
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, Timestamp, getDocs } = require("firebase/firestore")

createfirstdoc()

//this code for only creating the coolection

module.exports = {

  index: async (req, res) => {
       testdb().then(
        log('test then')
      )

    res.render("index", {
      title: "Home page",
    });
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
  addUser('ahmed','khaled', 'ahmed@hotmail.com', true,null)
  //add user with his admin
  addUser("ali", 'mohammed', 'ali@hotmail.com', false,await searchUserID('ahmed','khaled') )
  
  // add corr data
  addCorrData('youtube', 0.79, '2023/28/12', '2023,/29/12', 0)

  //update admin last name
  updateUser(await searchUserID('ahmed','khaled'), { Lname: 'saleh' })
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
async function searchUserID(Fname, Lname) {
  try {
    let matchedDate = null;  // Initialize to null
    const usersSnapshot = await getDocs(collection(db, 'Users'));

    usersSnapshot.forEach((doc) => {
      if (doc.data().Fname === Fname && doc.data().Lname === Lname) {
        matchedDate = doc.id;

      }
    });

    if (matchedDate) {
      return matchedDate;  // Return the matched data
    } else {
      console.log("No matching user found.");
      return null;  // Return null if no match found
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;  // Re-throw the error if you want to handle it outside this function
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
}

async function addDetectCorr(FirstCorrName, SecondCorrName,FirstDataID,SecondDataID,Threshold,CorrTimeStart,CorrTimeEnd) {
  const date = new Date

  const corr = new CorrelationData(FirstCorrName, SecondCorrName,FirstDataID,SecondDataID,Threshold,CorrTimeStart,CorrTimeEnd)

  await setDoc(doc(db, "DetectedCorrelation", "" + date.getTime()), corr).then(() => {
    console.log(`The Correlation ${corr.CorrName} successfully added !`)
  });
}
