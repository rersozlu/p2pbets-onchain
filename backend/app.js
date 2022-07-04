const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//home route
app.get("/", (req, res) => {
  res.json({ author: "rersozlu", app: "avaxbets" });
});

//Import routes
const betsRoute = require("./routes/bets");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/bets", betsRoute);

//Connection to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION, () => {
  console.log("connected to mongodb");
});
//PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running");
});

//export the api
module.exports = app;
