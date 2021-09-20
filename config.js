const mongoose = require("mongoose");

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected !");
  } catch (err) {
    console.log(err);
  }
};
module.exports = DBConnect;
