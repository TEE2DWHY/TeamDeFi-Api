const mongoose = require("mongoose")

const userFinancesSchema = new mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true },
    phonenumber: { type: Number, require: true },
    info: { type: String }
})

module.exports = mongoose.model("UserFinances", userFinancesSchema)