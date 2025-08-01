const express = require('express');
const cors = require('cors');
const app = express();

// Import các file routes
const accountRoutes = require('./Routes/accountRoutes.js');
const folderRoutes = require('./Routes/folderRoutes.js');
const courseRoutes = require('./Routes/courseRoutes.js');
const gradeRoutes = require('./Routes/gradeRoutes.js');
// const analysisRoutes = require('./Routes/analysisRoutes.js');
const pomodoroRoutes = require('./Routes/pomodoroRoutes.js');


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
app.use(cors(corsOptions));

app.use(express.static('public'));


// Middleware cơ bản để xử lý JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- ĐỊNH NGHĨA CÁC API ROUTE ---
app.use('/accounts', accountRoutes);
app.use('/folders', folderRoutes);
app.use('/courses', courseRoutes);
app.use('/grades', gradeRoutes);
// app.use('/analysis', analysisRoutes);
app.use('/pomodoro', pomodoroRoutes);


// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
  res.send('API của đang hoạt động...');
});

module.exports = app;