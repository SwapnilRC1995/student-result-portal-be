const mongoose = require('mongoose')
const Schema = mongoose.Schema
CourseSchema = new Schema({
    "course": {"type": String}
})
module.exports = mongoose.model('Course', CourseSchema)