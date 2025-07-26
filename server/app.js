const express = require('express');
const cors = require('cors');
const accountRoutes = require('./Routes/accountRoutes.js');

const app = express();

// Middleware
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body
app.use(express.urlencoded({ extended: true }));

// Routes
// Mọi request đến /api/accounts sẽ được xử lý bởi accountRoutes
app.use('/api/accounts', accountRoutes);

// Route cơ bản để kiểm tra server có hoạt động không
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;