const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors")
app.use(cors({
    origin: "*"
}))


const UserFinances = require("./routes/UserFinance");
app.use(express.json())

app.use("/api", UserFinances)



mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database is running successfully.")
}).catch((err) => {
    console.log(err)
})

app.listen("5000", () => {
    console.log("server is running on port 5000")
})