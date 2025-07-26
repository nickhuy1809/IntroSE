const app = require('./app.js');
const dotenv = require('dotenv');
const connectDB = require('./Config/db.js');

// Nạp các biến môi trường từ file .env
dotenv.config();

// Kết nối tới MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});