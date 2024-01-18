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

  adminreports: (req, res) => {

    res.render("adminreports", {
      title: "Reports",
    });
  },

  detailedReport: (req, res) => {

    res.render("detailedReport", {
      title: "Report Details",
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


