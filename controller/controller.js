const users = require("../models/users");

module.exports = {
  index: (req, res) => {
    
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
