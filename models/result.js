const mongoose = require('mongoose')
const Schema = mongoose.Schema
ResultSchema = new Schema({
    "course_id": {"type": String},
    "score": {"type": String},
    "student_id": {"type": String}
})
module.exports = mongoose.model('Result', ResultSchema)