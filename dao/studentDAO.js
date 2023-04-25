const mongoose = require('mongoose')
const Student = require("../models/student")

const initialize = (connectionString, res, next) => {
    mongoose.connect(connectionString).then(() => {
        next()
    }).catch((err) => {
        res.status(500).send({
            error: err
        })
    })
}

const addNewStudent = async (data) => {
    let result;
    await Student.create(data).then((student) => {
        result = student;
        console.log("Student has been added successfully")
    }).catch((err) => {
        result = err
    })
    return result;
}

const getAllStudent = async () => {
    let result = [];
    await Student.find().lean().exec().then((students) => {
        if(students.length > 0){
            result = students
        }
    }).catch((err) => {
        result = err
    })
    return result;
}

const getStudentById = async (id) => {
    let result = [];
    await Student.findById(id).lean().exec().then((student) => {
        if(student){
            result.push(student)
        }
    }).catch((err) => {
        result = err
    })
    return result;
}

const deleteStudentById = async (id) => {
    let res = false;
    await Student.findById(id).exec().then(async (student) => {
        await Student.deleteOne({"_id": id}).exec().then((result) => {
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
    addNewStudent,
    getStudentById,
    getAllStudent,
    deleteStudentById
}