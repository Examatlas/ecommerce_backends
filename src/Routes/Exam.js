// src/routes/examRoutes.js
const express = require('express');
const router = express.Router();
const { createExam, getAllExams, getExamById, updateExam, deleteExam, getBooksByExamName } = require('../Controllers/Exam');
const uploadGFS = require("../Middleware/gridFs_multer");
const upload = require("../Middleware/multer");


// Create Exam (with optional image upload)
router.post('/createexam',upload.array('images',5), createExam);

// Get All Exams
router.get('/all', getAllExams);


router.get("/books/:examName", getBooksByExamName);

// Get Exam by ID
router.get('/getexambyid/:id', getExamById);

// Update Exam by ID (with optional image upload)
router.put('/update/:id',upload.array('images',5), updateExam);

// Delete Exam by ID
router.delete('/delete/:id', deleteExam);

module.exports = router;
