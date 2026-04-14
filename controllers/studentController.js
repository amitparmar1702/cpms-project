import Student from '../models/Student.js';

// @desc    Get student by ID
// @route   GET /api/student/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
