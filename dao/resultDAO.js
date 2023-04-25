const mongoose = require('mongoose')
const Result = require("../models/result")
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

const addNewResult = async (data) => {
    let res;
    await Result.create(data).then((result) => {
        res = result;
        console.log("Student has been added successfully")
    }).catch((err) => {
        res = err
    })
    return res;
}

const getAllResult = async () => {
    let result = [];
    await Result.find().lean().exec().then((results) => {
        if(results.length > 0){
            result = results
        }
    }).catch((err) => {
        result = err
    })
    return result;
}

module.exports = {
    initialize,
    addNewResult,
    getAllResult
}