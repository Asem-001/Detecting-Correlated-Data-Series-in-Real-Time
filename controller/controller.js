const users = require("../models/users");

module.exports = {
  index: (req, res) => {
    res.render("index", {
    title: "Home page",   
    });
  },


};
