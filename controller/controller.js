const pool = require("../models/database");

module.exports = {
  index: async (req, res) => {
    const [result] = await pool.query(`
    SELECT * FROM correlation_db.detectedcorr as det, correlation_db.correaltion_data as data
    where det.DataID = data.corrID
    `); // write query here the arr "[result]" to retun only the data if only use "result" will return data + the data types.
    console.log(result);

    
    res.render("index", {
      title: "Home page",
    });
  },


};

