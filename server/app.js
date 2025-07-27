const express = require('express');
const cors = require('cors');
const app = express();

const accountRoutes = require('./Routes/accountRoutes.js');

// Cấu hình các tùy chọn
const corsOptions = {
  // Cho phép các nguồn gốc này
  origin: /localhost:\d+$/, 

  // Cho phép các phương thức này
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  // Cho phép các header này
  allowedHeaders: ['Content-Type', 'x-account-id'],
  
  // Xử lý preflight request cho tất cả các route
  preflightContinue: false,
  optionsSuccessStatus: 204 // Một số trình duyệt cũ yêu cầu 204
};

// Middleware này sẽ tự động xử lý các request OPTIONS
app.use(cors(corsOptions));


// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến API
app.use('/accounts', accountRoutes); 

// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
  res.send('API của đang hoạt động...');
});

module.exports = app;