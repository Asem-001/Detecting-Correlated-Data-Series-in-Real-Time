const users = require("../models/users");

module.exports = {
  index: (req, res) => {
    
    res.render("index", {
    title: "Home page",   
    });
  },

  reports: (req, res) => {

    res.render("reports", {
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
