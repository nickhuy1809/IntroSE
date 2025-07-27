const express = require('express');
const cors = require('cors');
const app = express();

// Import các file routes
const accountRoutes = require('./Routes/account.routes.js');
const folderRoutes = require('./Routes/folder.routes.js');
const courseRoutes = require('./Routes/course.routes.js');
const gradeRoutes = require('./Routes/grade.routes.js');
const analysisRoutes = require('./Routes/analysis.routes.js');

// Cấu hình CORS linh hoạt cho development
const corsOptions = {
  // Biểu thức này có nghĩa là: "Cho phép bất kỳ nguồn nào bắt đầu bằng http://localhost:"
  // Ví dụ: http://localhost:3000, http://localhost:3001, http://localhost:8080 đều được chấp nhận.
  origin: /localhost:\d+$/,
  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-account-id'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến API
app.use('/api/accounts', accountRoutes);
// app.use('/api/folders', folderRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/grades', gradeRoutes);
// app.use('/api/analysis', analysisRoutes);

// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
  res.send('API của đang hoạt động...');
});

module.exports = app;