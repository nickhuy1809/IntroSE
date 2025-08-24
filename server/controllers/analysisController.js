const Folder = require('../Models/Folder.js');
const Course = require('../Models/Course.js');
const Grade = require('../Models/Grade.js');
// Import hàm AI thật từ file tiện ích
const { call_Your_AI_API } = require('../Utils/llm.js');

exports.analyzeFolder = async (req, res) => {
    try {
        // LẤY DỮ LIỆU 
        const folder = await Folder.findOne({ _id: req.params.folderId, accountId: req.accountId });
        if (!folder) return res.status(404).json({ message: "Không tìm thấy thư mục" });

        const courses = await Course.find({ folderId: req.params.folderId }).select('_id name');
        if (courses.length === 0) return res.status(200).json({ motivationalMessage: "Thư mục này chưa có khóa học. Hãy tạo một khóa học để bắt đầu nhé!" });
        
        const courseIds = courses.map(c => c._id);
        const grades = await Grade.find({ courseId: { $in: courseIds } });
        if (grades.length === 0) return res.status(200).json({ motivationalMessage: "Bạn chưa có điểm nào trong thư mục này. Hãy thêm điểm để nhận phân tích từ AI nhé!" });
        
        // XÂY DỰNG PROMPT 
        let scoreData = "";
        courses.forEach(course => {
            scoreData += `Môn học: ${course.name}\n`;
            const gradesForCourse = grades.filter(g => g.courseId.equals(course._id));
            if (gradesForCourse.length > 0) {
                gradesForCourse.forEach(grade => {
                    scoreData += `- ${grade.description}: ${grade.score}/${grade.maxScore}\n`;
                });
            } else {
                scoreData += `- (Chưa có điểm)\n`;
            }
            scoreData += "\n";
        });

        let prompt = `
            Hãy đóng vai một cố vấn học tập chuyên nghiệp, tận tâm và thấu hiểu.

            Dưới đây là dữ liệu điểm của một học sinh trong thư mục có tên "${folder.name}":
            ---
            ${scoreData}
            ---
            Dựa trên dữ liệu trên, hãy thực hiện các nhiệm vụ sau:

            1.  **Phân tích tổng quan:** Viết một đoạn văn ngắn (2-3 câu) nhận xét chung về tình hình học tập.
            2.  **Xác định điểm mạnh:** Liệt kê 2-3 điểm mạnh nổi bật nhất.
            3.  **Xác định lĩnh vực cần cải thiện:** Liệt kê 2-3 lĩnh vực cần chú ý nhất.
            4.  **Viết thông điệp động viên:** Soạn một thông điệp ngắn gọn, tích cực, và chân thành.
            5.  **Đề xuất nhiệm vụ:** Đề xuất 2-3 nhiệm vụ (tasks) cụ thể, có thể hành động được. Mỗi nhiệm vụ cần có tiêu đề và mô tả ngắn.

            **YÊU CẦU ĐỊNH DẠNG ĐẦU RA:**
            Kết quả phải được trả về dưới dạng một đối tượng JSON hợp lệ và chỉ duy nhất JSON, không có bất kỳ văn bản giải thích nào khác bên ngoài đối tượng JSON này. Sử dụng các khóa (keys) sau: "overallSummary", "strengths", "areasForImprovement", "motivationalMessage", "suggestedTasks". Đối với "suggestedTasks", mỗi task phải là một object có hai khóa: "title" và "description". Sử dụng hoàn toàn ngôn ngữ tiếng Việt.
            `;

        // GỌI AI VÀ XỬ LÝ KẾT QUẢ
        const aiResponse = await call_Your_AI_API(prompt);

        if (aiResponse.error) {
            return res.status(200).json(aiResponse); // Trả về lỗi chi tiết cho frontend
        }
        
        res.status(200).json(aiResponse);

    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi phân tích", error: error.message });
    }
};