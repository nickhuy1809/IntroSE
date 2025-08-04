const Folder = require('../Models/Folder.js');
const Course = require('../Models/Course.js');
const Grade = require('../Models/Grade.js');

// Tạo folder mới
exports.createFolder = async (req, res) => {
    const { name, parentId = null } = req.body; // Nhận parentId (nếu có) từ body
    if (!name) return res.status(400).json({ message: 'Tên thư mục là bắt buộc' });

    try {
        // Nếu có parentId, kiểm tra xem thư mục cha có tồn tại và thuộc về user không
        if (parentId) {
            const parentFolder = await Folder.findOne({ _id: parentId, accountId: req.accountId });
            if (!parentFolder) return res.status(404).json({ message: 'Không tìm thấy thư mục cha.' });
        }

        const folder = await Folder.create({ name, parentId, accountId: req.accountId });
        res.status(201).json(folder);
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo thư mục", error: error.message });
    }
};
// Lấy tất cả folder của user
exports.getFoldersByAccount = async (req, res) => {
    try {
        // Lấy tất cả các folder của user về dưới dạng một danh sách phẳng
        const allFolders = await Folder.find({ accountId: req.accountId }).lean();

        // Xây dựng lại cấu trúc cây từ danh sách phẳng
        const folderMap = {};
        const rootFolders = [];

        // Đưa tất cả folder vào một map để dễ tìm kiếm
        allFolders.forEach(folder => {
            folder.subfolders = []; // Thêm một mảng rỗng để chứa các folder con
            folderMap[folder._id] = folder;
        });

        // Lặp lại để xác định quan hệ cha-con
        allFolders.forEach(folder => {
            if (folder.parentId) {
                // Nếu là folder con, tìm cha của nó trong map và thêm vào mảng subfolders của cha
                if (folderMap[folder.parentId]) {
                    folderMap[folder.parentId].subfolders.push(folder);
                }
            } else {
                // Nếu là folder cấp cao nhất, thêm vào mảng kết quả
                rootFolders.push(folder);
            }
        });
        
        res.status(200).json(rootFolders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Lấy thông tin một folder cụ thể
exports.getFolderById = async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, accountId: req.accountId });
        if (!folder) {
            return res.status(404).json({ message: 'Không tìm thấy thư mục' });
        }
        res.status(200).json(folder);
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
        const folderToDelete = await Folder.findOne({ _id: req.params.id, accountId: req.accountId });
        if (!folderToDelete) return res.status(404).json({ message: 'Không tìm thấy thư mục' });

        // Tìm tất cả các folder con của folder này (nếu có)
        const subfolders = await Folder.find({ parentId: folderToDelete._id });
        const subfolderIds = subfolders.map(f => f._id);
        
        // Tạo một mảng chứa ID của folder cha và tất cả các folder con
        const allFolderIdsToDelete = [folderToDelete._id, ...subfolderIds];

        // Tìm tất cả các course trong tất cả các folder sẽ bị xóa
        const coursesToDelete = await Course.find({ folderId: { $in: allFolderIdsToDelete } }).select('_id');
        const courseIdsToDelete = coursesToDelete.map(c => c._id);
        
        // Xóa tất cả các grade liên quan
        if (courseIdsToDelete.length > 0) {
            await Grade.deleteMany({ courseId: { $in: courseIdsToDelete } });
        }
        
        // Xóa tất cả các course liên quan
        if (courseIdsToDelete.length > 0) {
            await Course.deleteMany({ _id: { $in: courseIdsToDelete } });
        }
        
        // Cuối cùng, xóa tất cả các folder (cả cha và con)
        await Folder.deleteMany({ _id: { $in: allFolderIdsToDelete } });

        res.status(200).json({ message: 'Đã xóa thư mục và toàn bộ dữ liệu bên trong' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};