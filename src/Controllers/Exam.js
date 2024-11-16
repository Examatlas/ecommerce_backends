const Exam = require('../Models/Exam');
const Book = require("../Models/Book");
const uploadFile = require("../Utilis/gcp_upload")
const fs = require("fs")


exports.createExam = async (req, res) => {
    try {
        const { examName } = req.body;

        // Validate required fields
        if (!examName) {
            return res.status(400).json({ status: false, message: 'Exam name is required.' });
        }

        let imageFilenames = [];

        // Handle file uploads if files are present
        if (req.files && req.files.length) {
            imageFilenames = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const image_url = await uploadFile(file.path);

                        // Delete local file after upload
                        fs.unlink(file.path, (err) => {
                            if (err) console.error("Error deleting local file:", err);
                        });

                        return {
                            url: image_url,
                            filename: file.filename,
                            contentType: file.mimetype,
                            size: file.size,
                            uploadDate: Date.now(),
                        };
                    } catch (error) {
                        console.log("Error uploading file:", error);
                        return res.status(500).json({ status: false, error, message: "Error uploading file!" });
                    }
                })
            );
        }

        // Create a new exam with collected data
        const newExam = new Exam({
            examName,
            images: imageFilenames,
        });

        await newExam.save();
        return res.status(201).json({ status: true, message: 'Exam created successfully!', exam: newExam });
    } catch (error) {
        console.log("Error creating exam:", error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};



// Controller to get books filtered by examName
exports.getBooksByExamName = async (req, res) => {
    try {
      const { examName } = req.params; 

      // Find books by examName, not _id
      const books = await Book.find({ examName });
  
      // If no books are found, send a 404 response
      if (books.length === 0) {
        return res.status(404).json({ message: "No books found for this exam." });
      }
      // Send the filtered books as a response
      res.status(200).json({ books });
    } catch (error) {
        console.log(error.message,"error")
      res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get All Exams
exports.getAllExams = async (req, res) => {
    try {
        // Destructure query parameters with default values
        const { per_page = 10, page = 1 } = req.query;

        // Fetch exams with pagination
        const exams = await Exam.find()
            .skip((page - 1) * parseInt(per_page))
            .limit(parseInt(per_page));

        // Get the total count for pagination
        const totalExams = await Exam.countDocuments();

        res.status(200).json({
            status: true,
            message: 'Exams fetched successfully',
            pagination: {
                totalRows: totalExams,
                totalPages: Math.ceil(totalExams / per_page),
                currentPage: parseInt(page),
            },
            exams
        });
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching exams',
            error: error.message,
        });
    }
};



// Get Exam by ID
exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        res.status(200).json({ status: true, exam });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exam', error });
    }
};



// Update Exam by ID
exports.updateExam = async (req, res) => {
    try {
        const { examName } = req.body;

        // Validate required fields
        if (!examName) {
            return res.status(400).json({ status: false, message: 'Exam name is required.' });
        }

        let imageFilenames = [];

        // Handle file uploads if files are present
        if (req.files && req.files.length) {
            imageFilenames = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const image_url = await uploadFile(file.path);

                        // Delete local file after upload
                        fs.unlink(file.path, (err) => {
                            if (err) console.error("Error deleting local file:", err);
                        });

                        return {
                            url: image_url,
                            filename: file.filename,
                            contentType: file.mimetype,
                            size: file.size,
                            uploadDate: Date.now(),
                        };
                    } catch (error) {
                        console.log("Error uploading file:", error);
                        return res.status(500).json({ status: false, error, message: "Error uploading file!" });
                    }
                })
            );
        }

        // Update the exam with the new data
        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id,
            {
                examName,
                ...(imageFilenames.length > 0 && { images: imageFilenames }), // Update images if there are any new uploads
            },
            { new: true }
        );

        if (!updatedExam) {
            return res.status(404).json({ status: false, message: 'Exam not found' });
        }

        res.status(200).json({ status: true, message: 'Exam updated successfully', exam: updatedExam });
    } catch (error) {
        console.log("Error updating exam:", error);
        res.status(500).json({ status: false, message: 'Error updating exam', error: error.message });
    }
};


// delete exam by id 
exports.deleteExam = async (req, res) => {
    try {
        const deletedExam = await Exam.findByIdAndDelete(req.params.id);
        if (!deletedExam) return res.status(404).json({ message: 'Exam not found' });

        res.status(200).json({ message: 'Exam deleted successfully', exam: deletedExam });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exam', error });
    }
};


