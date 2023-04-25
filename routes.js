const express = require('express')
const { body, validationResult, query} = require('express-validator')
const cors = require('cors')
require('dotenv').config()

let app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cors())

const studentDB = require('./dao/studentDAO')
const courseDB = require('./dao/courseDAO')
const resultDB = require('./dao/resultDAO')

// Student Routes
const studentInit = (req, res, next) => {
    studentDB.initialize(process.env.CONNECTION_STRING, res, next)
}

app.get('/api/student',
    studentInit,
    async (req, res) => {
        let result = await studentDB.getAllStudent();
        res.status(201).send(result)
    }
)

app.post('/api/student',
    studentInit,
    body('firstName').trim().escape().notEmpty().withMessage("First name cannot be empty"),
    body('familyName').trim().escape().notEmpty().withMessage("Family name cannot be empty"),
    body('dob').trim().escape().notEmpty().withMessage("Date of birth cannot be empty").isInt({min: 0}).withMessage("Invalid date"),
    body('email').trim().escape().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Invalid email"),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(406).send({errors: errors.array()})
        }
        let student = {
            dob: req.body.dob,
            email: req.body.email.trim(),
            familyName: req.body.familyName.trim(),
            firstName: req.body.firstName.trim()
        }
        let result = await studentDB.addNewStudent(student);
        res.status(201).send(result)
    }
)

app.delete('/api/student',
    studentInit,
    body('id').trim().escape().notEmpty().withMessage("ID cannot be empty"),
    async (req, res) => {
        let result = await studentDB.deleteStudentById(req.body.id)
        if(result) {
            res.status(201).send()
        }else{
            res.status(406).send()
        }
    }
)

const courseInit = (req, res, next) => {
    courseDB.initialize(process.env.CONNECTION_STRING, res, next)
}

app.get('/api/course',
    courseInit,
    async (req, res) => {
        let result = await courseDB.getAllCourse();
        res.status(201).send(result)
    }
)

app.post('/api/course',
    courseInit,
    body('course').trim().escape().notEmpty().withMessage("Course name cannot be empty"),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(406).send({errors: errors.array()})
        }
        let course = {
            course: req.body.course.trim()
        }
        let result = await courseDB.addNewCourse(course);
        res.status(201).send(result)
    }
)

app.delete('/api/course',
    courseInit,
    body('id').trim().escape().notEmpty().withMessage("ID cannot be empty"),
    async (req, res) => {
        let result = await courseDB.deleteCourseById(req.body.id)
        if(result) {
            res.status(201).send()
        }else{
            res.status(406).send()
        }
    }
)

const resultInit = (req, res, next) => {
    resultDB.initialize(process.env.CONNECTION_STRING, res, next)
}

app.get('/api/result',
    resultInit,
    async (req, res) => {
        let output = []
        let result = await resultDB.getAllResult();
        for (const r of result) {
            let student =  await studentDB.getStudentById(r['student_id'])
            let course = await courseDB.getCourseById(r['course_id'])
            if( course.length > 0 && student.length > 0){
                let data = {
                    student: student[0].firstName+" "+student[0].familyName,
                    course: course[0].course,
                    score: r.score
                }
                output.push(data)
            }
        }
        res.status(201).send(output)
    }
)

app.post('/api/result',
    studentInit,
    body('course_id').trim().escape().notEmpty().withMessage("Course cannot be empty"),
    body('student_id').trim().escape().notEmpty().withMessage("Student cannot be empty"),
    body('score').trim().escape().notEmpty().withMessage("Score cannot be empty"),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(406).send({errors: errors.array()})
        }
        let data = {
            course_id: req.body.course_id.trim(),
            student_id: req.body.student_id.trim(),
            score: req.body.score.trim(),
        }
        let result = await resultDB.addNewResult(data);
        res.status(201).send(result)
    }
)

module.exports = app;