const Folder = require('../Models/Folder.js');
const Course = require('../Models/Course.js');
const Grade = require('../Models/Grade.js');

// Tạo folder mới
exports.createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên thư mục là bắt buộc' });
        const folder = await Folder.create({ name, accountId: req.accountId });
        res.status(201).json(folder);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo thư mục", error: error.message });
    }
};
// Lấy tất cả folder của user
exports.getFoldersByAccount = async (req, res) => {
    try {
        const folders = await Folder.find({ accountId: req.accountId }).sort({ createdAt: -1 });
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
// Cập nhật folder
exports.updateFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, accountId: req.accountId }, // Điều kiện tìm kiếm, đảm bảo đúng chủ sở hữu
            { name: req.body.name },
            { new: true, runValidators: true }
        );
        if (!folder) return res.status(404).json({ message: 'Không tìm thấy thư mục' });
        res.status(200).json(folder);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật thư mục", error: error.message });
    }
};
// Xóa folder (và toàn bộ dữ liệu bên trong nó)
exports.deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, accountId: req.accountId });
        if (!folder) return res.status(404).json({ message: 'Không tìm thấy thư mục' });

        const coursesInFolder = await Course.find({ folderId: folder._id }).select('_id');
            const courseIds = coursesInFolder.map(c => c._id);

            await Grade.deleteMany({ courseId: { $in: courseIds } });
            await Course.deleteMany({ folderId: folder._id });
            await folder.deleteOne();

            res.status(200).json({ message: 'Đã xóa thư mục và toàn bộ dữ liệu liên quan' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};