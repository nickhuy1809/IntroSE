require('dotenv').config(); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Kiểm tra xem API Key có tồn tại không
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY không được tìm thấy trong file .env");
}

// Khởi tạo client của Google AI với API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Hàm gọi đến API của Google Gemini để lấy phân tích
 * @param {string} prompt - Câu lệnh yêu cầu chi tiết gửi cho AI
 * @returns {Promise<string>} - Một chuỗi JSON chứa kết quả phân tích
 */
const call_Your_AI_API = async (prompt) => {
  try {
    // Chọn model bạn muốn sử dụng (gemini-pro là một lựa chọn tốt)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Gọi API để tạo nội dung
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text; // Trả về chuỗi văn bản do AI tạo ra (dự kiến là một chuỗi JSON)
  } catch (error) {
    console.error("Lỗi khi gọi API của AI:", error);
    // Trả về một chuỗi JSON chứa thông báo lỗi để frontend có thể xử lý
    return JSON.stringify({
      error: true,
      message: "Rất tiếc, dịch vụ phân tích AI đang tạm thời gián đoạn."
    });
  }
};

module.exports = {
  call_Your_AI_API,
};