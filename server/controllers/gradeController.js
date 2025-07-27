const Grade = require('../Models/Grade.js');
const Course = require('../Models/Course.js');

// Tạo điểm mới
exports.createGrade = async (req, res) => {
    try {
        const { description, score, maxScore, courseId } = req.body;
        const parentCourse = await Course.findOne({ _id: courseId, accountId: req.accountId });
        if (!parentCourse) return res.status(404).json({ message: 'Không tìm thấy khóa học cha' });
        const grade = await Grade.create({ description, score, maxScore, courseId, accountId: req.accountId });
        res.status(201).json(grade);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo điểm", error: error.message });
    }
};

// Lấy tất cả điểm của một course
exports.getGradesForCourse = async (req, res) => {
    try {
        const grades = await Grade.find({ courseId: req.params.courseId, accountId: req.accountId }).sort({ createdAt: -1 });
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật điểm
exports.updateGrade = async (req, res) => {
    try {
        const { description, score, maxScore } = req.body;
        const grade = await Grade.findOneAndUpdate(
            { _id: req.params.id, accountId: req.accountId },
            { description, score, maxScore },
            { new: true, runValidators: true }
        );
        if (!grade) return res.status(404).json({ message: 'Không tìm thấy điểm' });
        res.status(200).json(grade);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật điểm", error: error.message });
    }
};

// Xóa điểm
exports.deleteGrade = async (req, res) => {
    try {
        const grade = await Grade.findOneAndDelete({ _id: req.params.id, accountId: req.accountId });
        if (!grade) return res.status(404).json({ message: 'Không tìm thấy điểm' });
        res.status(200).json({ message: 'Đã xóa điểm thành công' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};