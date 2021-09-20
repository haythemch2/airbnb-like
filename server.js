const express = require("express");

const app = express();

const cors = require("cors");
const DBConnect = require("./config");

require("dotenv").config();
DBConnect();

app.use(express.json());
app.use("/users", require("./Routes/User"));
app.use("/posts", require("./Routes/Post"));

app.listen(process.env.PORT, (err) => {
  err ? console.log(err) : console.log("server is running !");
});
