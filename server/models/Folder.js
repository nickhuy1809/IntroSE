const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thư mục không được để trống'],
        trim: true
    },
    // Tham chiếu đến người dùng sở hữu thư mục này
    accountId: {
        type: String,
        ref: 'Account',
        required: true
    }
}, {
    timestamps: true
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;