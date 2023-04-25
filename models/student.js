const mongoose = require('mongoose')
const Schema = mongoose.Schema
StudentSchema = new Schema({
    "dob": {"type": String},
    "email": {"type": String},
    "familyName": {"type": String},
    "firstName": {"type": String}
})

module.exports = mongoose.model('Student', StudentSchema)