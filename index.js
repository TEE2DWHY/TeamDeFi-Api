const express = require("express");
const { Mongoose } = require("mongoose");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();



const UserFinances = require("./routes/UserFinanceRouter");


app.use("/financial-markets", UserFinances)


Mongoose.connect(process.env.MONGO_URL).then

app.listen("5000", () => {
    console.log("server is running on port 3000")
})