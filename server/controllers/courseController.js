const Course = require('../Models/Course.js');
const Folder = require('../Models/Folder.js');

// Tạo course mới
exports.createCourse = async (req, res) => {
    try {
        const { name, folderId } = req.body;
        const parentFolder = await Folder.findOne({ _id: folderId, accountId: req.accountId });
        if (!parentFolder) return res.status(404).json({ message: 'Không tìm thấy thư mục cha hoặc bạn không có quyền' });
        const course = await Course.create({ name, folderId, accountId: req.accountId });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo khóa học", error: error.message });
    }
};

// Lấy course trong 1 folder
exports.getCoursesInFolder = async (req, res) => {
    try {
        const parentFolder = await Folder.findOne({ _id: req.params.folderId, accountId: req.accountId });
        if (!parentFolder) return res.status(404).json({ message: 'Không tìm thấy thư mục' });
        const courses = await Course.find({ folderId: req.params.folderId }).sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id, accountId: req.accountId },
            { name: req.body.name },
            { new: true, runValidators: true }
        );
        if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật khóa học", error: error.message });
    }
};

// Xóa course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, accountId: req.accountId });
        if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        // Middleware trong model sẽ tự động xóa các grade liên quan
        await course.deleteOne();
        res.status(200).json({ message: 'Đã xóa khóa học thành công' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};