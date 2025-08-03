const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thư mục không được để trống'],
        trim: true,
        minlength: [1, 'Tên thư mục không được để trống'],
        maxlength: [100, 'Tên thư mục không được quá 100 ký tự']
    },
    accountId: { type: String, ref: 'Account', required: true },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
}, { timestamps: true });
const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;