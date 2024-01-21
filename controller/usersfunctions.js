const userclass = require("../models/users")
const { doc, collection, addDoc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, Timestamp, getDocs, query, where } = require("firebase/firestore");
const db = require("../models/config")






async function addUser(Fname,Lname, Email ,password, IsAdmin, adminID) {
    const date = new Date
    const id = date.getFullYear().toString().slice(-2)+date.getTime()% 100000
   
    const user = new userclass(id,Fname,Lname, Email,password, IsAdmin, adminID)
  
    const docRef = await setDoc(doc(db, "Users", "" + id), user).then(() => {
      console.log(`The user ${user.name} successfully added !`+ user)
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
            const updatedUser = await searchUserID(user.name, user.password);
            console.log(updatedUser, user.Fname, user.password);
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
      const users = [];
  
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
  
        // console.log(doc.id, " => ", user);
      });
  
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;  // Re-throw the error if you want to handle it outside this function
    }
  }
  


  
async function searchUserID(Email, password) {
    try {
      let matchedDate = null; // Initialize to null
      const usersSnapshot = await query(collection(db, 'Users'), where("Email", '==', Email), where("password", '==', password));
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

        let user = docSnapshot.data()
        
        let fullUser = {
          id: id,
          AdminID: user.AdminID,
          Created: user.Created,
          Email: user.Email,
          IsAdmin: user.IsAdmin,
          name: user.name,
          password: user.password ,
        }

        return fullUser ;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;  // Re-throw the error to handle it outside if necessary
    }
  }




  module.exports = {searchUser, searchUserID, getAllUsers, deleteUser,updateUser,addUser}