const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();



const UserFinances = require("./routes/UserFinance");


app.use("/api", UserFinances)

app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database is running successfully.")
}).catch((err) => {
    console.log(err)
})

app.listen("5000", () => {
    console.log("server is running on port 5000")
})