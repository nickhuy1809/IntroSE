const express = require('express');
const cors = require('cors');
const app = express();

// Import các file routes
const accountRoutes = require('./Routes/accountRoutes.js');
// Thêm các file routes khác của bạn ở đây khi cần
// const folderRoutes = require('./Routes/folder.routes.js');
// const courseRoutes = require('./Routes/course.routes.js');
// const gradeRoutes = require('./Routes/grade.routes.js');
// const analysisRoutes = require('./Routes/analysis.routes.js');


// --- PHẦN CẤU HÌNH CORS ĐÚNG ĐẮN ---

// 1. Định nghĩa các tùy chọn cho CORS
const corsOptions = {
  // Cho phép các nguồn gốc (origin) khớp với biểu thức chính quy này.
  // Nó sẽ chấp nhận http://localhost:3000, http://localhost:3001, v.v.
  origin: /localhost:\d+$/,
  
  // Cho phép các phương thức HTTP này
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  // Cho phép các header này trong request. Cần phải có 'x-account-id' của chúng ta.
  allowedHeaders: ['Content-Type', 'x-account-id'],
  
  // Tùy chọn để tương thích tốt hơn
  optionsSuccessStatus: 204
};

// 2. Sử dụng middleware cors với các tùy chọn đã định nghĩa.
// Dòng này sẽ được áp dụng cho TẤT CẢ các request và sẽ tự động xử lý
// các preflight request (OPTIONS) mà không cần đến app.options('*', ...).
app.use(cors(corsOptions));


// --- KẾT THÚC PHẦN CẤU HÌNH CORS ---


// Middleware cơ bản để xử lý JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- ĐỊNH NGHĨA CÁC API ROUTE ---
app.use('/accounts', accountRoutes);
// app.use('/api/folders', folderRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/grades', gradeRoutes);
// app.use('/api/analysis', analysisRoutes);


// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
  res.send('API của GradeAnalyst đang hoạt động...');
});

module.exports = app;