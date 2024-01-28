const { searchUser, searchUserID, getAllUsers, deleteUser, updateUser, addUser } = require('./usersfunctions')
const { addDetectCorr, addCorrData, CorrelationSearch, updateCorrleationData, addControlPanelInfo, SearchDetectedCorrelations, SearchCorrelationsByRangeDate,calculateCorrelationFrequencies, getAllCorrelation } = require('./correlationFunctions')
const e = require('method-override')
bcrypt = require('bcrypt')

let IDforEndDate = []


module.exports = {

  index:  (req, res) => {
    
    // addControlPanelInfo('2455763',[0.9,1],90)
    // SearchDetectedCorrelations("N225")
   
      
    res.redirect('/home')

  },

  home: async (req, res) => {
    let dumpInfo = {
      AdminID: 123123,
      SetThreshold: [-1, 1],
      WindowSize: 100
    }
    if (req.user.IsAdmin) {
      res.render("index", {
        title: "Home page",
        user: req.user,
        info: dumpInfo,
      });
    } else {
      let info = await searchControlPanelinfo(req.user.AdminID);
      res.render("index", {
        title: "Home page",
        user: req.user,
        info: info,
      });
    }

  },
  setSettings: async (req, res) => {
    let data = req.body.parcel
    addControlPanelInfo(data.AdminID, data.SetThreshold, data.WindowSize)
  },
  
  addCorrelationData: async (req, res) => {
    // Extract parcel data from request body
    let data = req.body.parcel;

    // Loop over each name in the data.names array
    for (let i = 0; i < data.names.length; i++) {

      // Perform the CorrelationSearch operation asynchronously for each name
      let doc = await CorrelationSearch(data.names[i])


      // If the document doesn't exist and there's no end date, add correlation data
      let date_time_add;
      let date_time_end;
      if (!doc & data.endDate.length == 0) {

        date_time_add = data.addDate[i].split('-')
        // date_time_end[0] = data.endDate[0].split('-')
        IDforEndDate.push(await addCorrData(data.names[i], data.threshold, date_time_add, '', 0));
      }
      // If the document doesn't exist and there is an end date, add correlation data with the end date
      else if (!doc & data.endDate.length > 0) {
        date_time_add = data.addDate[i].split('-')
        date_time_end = data.endDate[0].split('-')


        IDforEndDate.push(await addCorrData(data.names[i], data.threshold, date_time_add, date_time_end, 0));
      }
      // If the document exists, update the correlation data
      else if (data.endDate.length > 0) {
        date_time_end = data.endDate[0].split('-')
        updateCorrleationData(data.names[i], {
          SetThreshold: data.threshold,
          CorrDateEnded: date_time_end,

        });
      }
    }

    // Redirect to the home page after processing all names
    res.redirect('/home')


  },
  //This fucntion add the detected information that occur between two time series
  addDetectCorrelation: async (req, res) => {


    let data = req.body.parcel;
    let date= data.Date.split('-')
    // Assuming addDetectCorr is a function that needs to be implemented
    let name = data.correlatedSeries[0].split(',')
    addDetectCorr(name[0], name[1], data.threshold, data.startTime[0], data.endTime[0],date,data.Windowsize);

    res.redirect('/home')

  },

  login: (req, res) => {
    // addUser('ahmed','ali', 'ahmed@hotmail.com','123321', true, null)
    res.render("login", {
      title: 'login page',
      user: req.user
    })
  },

  postLogin: async (req, res) => { },



  reports: async (req, res) => {

    res.render("reports", {
      title: "detailedReport",
      user: req.user,

    })
  },

  reportssendData: async (req, res) => {
    let data;
    let date = req.params.date.split(',');
      
    // Check if both start and end dates are provided
    if (date.length >= 2 && date[0] && date[1]) {
      data  = []
        let start = date[0].split('-');
        let end = date[1].split('-');
        data = await SearchCorrelationsByRangeDate(start, end, date[2]);
    } 
    // Check if the third parameter is provided
    else if (date.length > 2 && date[2]) {
      
        data  = []
        for(let i =2; i<date.length;i++)
        data.push(await CorrelationSearch(date[i]));
    } 
    // Default case
    else {
        data = await getAllCorrelation();
    }

   
    res.status(200).json({
        ReportDataByDate: data
    });
},


  //This function return all data that ouccr correlation between the corrname and others data (detectedData)
  // and return  Calculates the frequencies of correlation for a given corrname (numberOfFreq).
  getDetectedCorrelations: async(req, res) => {
      
    let corrname = req.params.corrname

    const detectedData = await SearchDetectedCorrelations(corrname)
    const numberOfFreq = await calculateCorrelationFrequencies(corrname)
;
    res.status(200).json({
      detectedData: detectedData,
      numberOfFreq: numberOfFreq

    })
  },
  detailedReport: (req, res) => {


    res.render("detailedReport", {
      title: "Report Details",
      user: req.user
    });
  },

  logout: (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  },
  dashboard: async (req, res) => {
    try {
      const users = await getAllUsers();
      // console.log(users)
      res.render("dashboard", {
        title: "Dashboard",
        user: req.user,
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
      user: req.user
    });
  },

  addUser: async (req, res) => {
    try {
      // Extract user data from request body
      let AdminID = req.body.AdminID;
      let Fname = req.body.Fname;
      let Lname = req.body.Lname;
      let Email = req.body.Email;  // Corrected property name
      let password = await bcrypt.hash(req.body.password, 6);
      let Admin = req.body.IsAdmin;

      let IsAdmin = Admin === 'admin';
      if (IsAdmin) AdminID = null

      console.log('Admin variable:', IsAdmin);

      await addUser(Fname, Lname, Email, password, IsAdmin, AdminID);
      console.log('User added successfully');
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
      let AdminID = req.body.AdminID;
      let Fname = req.body.Fname;
      let Lname = req.body.Lname;
      let Email = req.body.Email;
      let password = await bcrypt.hash(req.body.password, 6);
      let IsAdmin = req.body.IsAdmin === 'admin';
      if (IsAdmin) AdminID = null
      console.log('Admin variable:', IsAdmin);
      let user = {
        AdminID, Fname, Lname, Email, password, IsAdmin // Use IsAdmin instead of Admin
      };

      // Edit user in the database
      await updateUser(id, user);

      // Send success response
      res.redirect("/dashboard");
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
        user: req.user,
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
}


  // async function testdb() {

  //   // add admin
  //   addUser('ahmed', 'khaled', 'ahmed@hotmail.com', true, null)
  //   //add user with his admin
  //   addUser("ali", 'mohammed', 'ali@hotmail.com', false, await searchUserID('ahmed', 'khaled'))

  //   // add corr data
  //   addCorrData('youtube', 0.79, '2023/28/12', '2023,/29/12', 0)

  //   //update admin last name
  //   updateUser(await searchUserID('ahmed', 'khaled'), { password: 'saleh' })
  //   // search for user by his id 
  //   console.log(await searchUser('1703788699748'))

  //   // delete admin 
  //   //  await deleteUser(await searchUserID('ahmed','saleh'))
  // }


