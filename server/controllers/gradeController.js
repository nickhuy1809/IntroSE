const Grade = require('../Models/Grade.js');
const Course = require('../Models/Course.js');

// Tạo điểm mới
exports.createGrade = async (req, res) => {
    const { description, score, weight, maxScore, courseId } = req.body;
    
    if (!description || score === undefined || weight === undefined || !courseId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin: description, score, weight, courseId' });
    }
    if (typeof score !== 'number' || (maxScore !== undefined && typeof maxScore !== 'number')) {
        return res.status(400).json({ message: 'Điểm số phải là một con số' });
    }
    if (maxScore !== undefined && score > maxScore) {
        return res.status(400).json({ message: 'Điểm số không thể lớn hơn điểm tối đa' });
    }

    try {
        const parentCourse = await Course.findOne({ _id: courseId, accountId: req.accountId });
        if (!parentCourse) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        const grade = await Grade.create({ description, score, weight, maxScore, courseId, accountId: req.accountId });
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
        const { description, score, weight, maxScore } = req.body;
        const grade = await Grade.findOneAndUpdate(
            { _id: req.params.id, accountId: req.accountId },
            { description, score, weight, maxScore },
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


// Lấy tất cả điểm của các course trong một folder cụ thể
exports.getGradesForFolder = async (req, res) => {
    try {
        // 1. Tìm tất cả các course ID thuộc về folder này và người dùng này
        const coursesInFolder = await Course.find({ 
            folderId: req.params.folderId, 
            accountId: req.accountId 
        }).select('_id'); // .select('_id') để tối ưu hóa, chỉ lấy trường _id

        // Nếu folder không có course nào, trả về một mảng rỗng là hợp lý
        if (coursesInFolder.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Tạo một mảng mới chỉ chứa các giá trị ID
        const courseIds = coursesInFolder.map(course => course._id);
        
        // 3. Tìm tất cả các Grade có trường `courseId` nằm trong mảng `courseIds`
        const grades = await Grade.find({ courseId: { $in: courseIds } });
        
        // 4. Trả về mảng các grade tìm được
        res.status(200).json(grades);
    } catch (error) {
        // Nếu có lỗi xảy ra, báo lỗi server
        res.status(500).json({ message: "Lỗi server khi lấy điểm theo thư mục", error: error.message });
    }
};