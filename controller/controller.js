const { searchUser, searchUserID, getAllUsers, deleteUser, updateUser, addUser } = require('./usersfunctions')
const { addDetectCorr, addCorrData, CorrelationSearch, updateCorrleationData } = require('./correlationFunctions')



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
  addDetectCorrelation: async (req, res) => {


    let data = req.body.parcel;
    console.log(data);

    // Assuming addDetectCorr is a function that needs to be implemented
    let name = data.correlatedSeries[0].split(',')
    console.log(name);
    addDetectCorr(name[0], name[1], data.threshold, data.startTime[0], data.endTime[0]);

    res.redirect('/');

  },

  login: (req,res) =>{
    res.render("login",{
      title: 'login page',
    })
  },

  postLogin: (req,res) =>{
    console.log('t')
  },

  reports: (req, res) => {

    res.render("reports", {
      title: "Reports",
    });
  },

  detailedReport: (req, res) => {

    res.render("detailedReport", {
      title: "Report Details",
    });
  },

  dashboard: async (req, res) => {
    try {
      const users = await getAllUsers();
      // console.log(users)
      res.render("dashboard", {
        title: "Dashboard",
        users: users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  

  profile: (req, res) => {

    res.render("profile", {
      title: "Profile",
    });
  },

  addUser: async (req, res) => {
    try {
        // Extract user data from request body
        let AdminID = req.body.AdminID;
        let name = req.body.name;
        let Email = req.body.email;
        let password = req.body.password;
        let IsAdmin = req.body.isAdmin;

       
        await addUser(name, Email , password, IsAdmin, AdminID);
        console.log('User added successfuly')
        res.redirect("/dashboard");
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
},


  updateUser: async (req, res) => {
    try {
      // Extract user data from request body
      let id = req.params.id;

      let user = {
       AdminID : req.body.AdminID,
       name : req.body.name,
       Email : req.body.email,
       password : req.body.password,
       IsAdmin : req.body.isAdmin,
       date : req.body.date
      }
      console.log(id , user)
      // Edit user in the database
      await updateUser(id , user);

      // Send success response
      res.redirect("/dashboard")
    } catch (error) {
      console.error('Error editing user:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },

  editUser: async (req, res) => {
    const id = req.params.id;
    try {
      const users = await getAllUsers();
      console.log(users);
      res.render("editUser", {
        title: "editUser",
        users: users,
        userId: id,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      await deleteUser(id)
      res.redirect('/dashboard')
    } catch (error) {
      console.error('Error deleting users:', error);
      res.status(500).send('Internal Server Error');
    }
  },
},


async function testdb() {

  // add admin
  addUser('ahmed', 'khaled', 'ahmed@hotmail.com', true, null)
  //add user with his admin
  addUser("ali", 'mohammed', 'ali@hotmail.com', false, await searchUserID('ahmed', 'khaled'))

  // add corr data
  addCorrData('youtube', 0.79, '2023/28/12', '2023,/29/12', 0)

  //update admin last name
  updateUser(await searchUserID('ahmed', 'khaled'), { password: 'saleh' })
  // search for user by his id 
  console.log(await searchUser('1703788699748'))

  // delete admin 
  //  await deleteUser(await searchUserID('ahmed','saleh'))
}


