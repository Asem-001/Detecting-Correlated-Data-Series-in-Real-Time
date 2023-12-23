const pool = require("../models/database");

module.exports = {

  index: async (req, res) => {
    const [result] = await pool.query(`
    SELECT * FROM correlation_db.detectedcorr as det, correlation_db.correaltion_data as data
    where det.DataID = data.corrID LIMIT 1
    `); // write query here the arr "[result]" to retun only the data if only use "result" will return data + the data types.
   let obj  = result[0];
    res.render("index", {
      title: "Home page",
      data: obj
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

