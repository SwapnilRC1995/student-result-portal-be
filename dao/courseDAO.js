const mongoose = require('mongoose')
const Course = require("../models/course")
const Student = require("../models/student");

const initialize = (connectionString, res, next) => {
    mongoose.connect(connectionString).then(() => {
        next()
    }).catch((err) => {
        res.status(500).send({
            error: err
        })
    })
}

const addNewCourse = async (data) => {
    let result;
    await Course.create(data).then((course) => {
        result = course;
        console.log("Course has been added successfully")
    }).catch((err) => {
        result = err
    })
    return result;
}

const getAllCourse = async () => {
    let result = [];
    await Course.find().lean().exec().then((courses) => {
        if(courses.length > 0){
            result = courses
        }
    }).catch((err) => {
        result = err
    })
    return result;
}

const getCourseById = async (id) => {
    let result = []
    await Course.findById(id).lean().exec().then((course) => {
        if(course){
            result.push(course)
        }
    }).catch((err) => {
        result = err
    })
    return result
}

const deleteCourseById = async (id) => {
    let res = false;
    await Course.findById(id).exec().then(async (course) => {
        await Course.deleteOne({"_id": id}).exec().then((result) => {
            if(result.deletedCount !== 0){
                res = true
            }
        }).catch((err) => {
            return res
        })
    }).catch((err) => {
        return res
    })
    return res;
}

module.exports = {
    initialize,
    addNewCourse,
    getAllCourse,
    getCourseById,
    deleteCourseById
}