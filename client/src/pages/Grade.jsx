import { useState, useEffect, useCallback } from 'react';
import styled from "@emotion/styled";
import FolderExplorer from "../components/FolderExplorer";
import StatisticsBoard from "../components/StatisticsBoard";
import FolderManager from "../components/FolderManager";
import CourseMenu from "../components/CourseMenu";

const GradeContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "15px",
  position: "relative",
});

export default function Grade() {
  // --- STATE ---
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
   const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState({ folders: true, content: true, analysis: true }); 
  const [error, setError] = useState({ folders: null, content: null, analysis: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [analysisResult, setAnalysisResult] = useState(null);

  const accountId = localStorage.getItem('accountId');

  // Hàm được gọi khi có thay đổi dữ liệu (thêm/sửa/xóa)
  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1); // Tăng trigger lên để kích hoạt lại useEffect
  };

  // Chạy lần đầu và mỗi khi `refreshTrigger` thay đổi
  useEffect(() => {
    const fetchAllData = async () => {
      if (!accountId) return;

      setIsLoading(prev => ({ ...prev, folders: true }));
      setError(prev => ({ ...prev, folders: null, content: null, analysis: null }));

      try {
        // 1. Luôn luôn fetch lại danh sách folder
        const foldersRes = await fetch('http://localhost:5000/api/folders', {
          headers: { 'x-account-id': accountId },
        });
        if (!foldersRes.ok) throw new Error('Cannot Load Folders');
        const foldersData = await foldersRes.json();
        setFolders(foldersData);
        setIsLoading(prev => ({ ...prev, folders: false }));

        // 2. Xác định folder ID để fetch nội dung
        let folderIdToFetch = selectedFolderId;
        // Tự động chọn folder đầu tiên nếu chưa có gì được chọn
        if (selectedFolderId === null && foldersData.length > 0) {
          folderIdToFetch = foldersData[0]._id;
          // Quan trọng: Không gọi setState ở đây để tránh vòng lặp,
          setSelectedFolderId(folderIdToFetch);
        }
        
        // 3. Lấy nội dung cho folder được chọn
        if (folderIdToFetch) {
          const [coursesRes, gradesRes, analysisRes] = await Promise.allSettled([
            fetch(`http://localhost:5000/api/courses/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } }),
            fetch(`http://localhost:5000/api/grades/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } }),
            fetch(`http://localhost:5000/api/analysis/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } })
          ]);
          // Xử lý kết quả courses và grades
          if (coursesRes.status === 'fulfilled' && coursesRes.value.ok && gradesRes.status === 'fulfilled' && gradesRes.value.ok) {
            const coursesData = await coursesRes.value.json();
            const gradesData = await gradesRes.value.json();
            setCourses(coursesData);
            setGrades(gradesData);
            setError(prev => ({ ...prev, content: null }));
          } else {
            setError(prev => ({ ...prev, content: 'Không thể tải dữ liệu khóa học.' }));
          }
          setIsLoading(prev => ({ ...prev, content: false }));

          // Xử lý kết quả phân tích AI
          if (analysisRes.status === 'fulfilled' && analysisRes.value.ok) {
            const analysisData = await analysisRes.value.json();
            setAnalysisResult(analysisData);
            setError(prev => ({ ...prev, analysis: null }));
          } else {
            setError(prev => ({ ...prev, analysis: 'Không thể tải phân tích AI.' }));
            setAnalysisResult(null); // Reset nếu lỗi
          }
          setIsLoading(prev => ({ ...prev, analysis: false }));

        } else {
          setCourses([]);
          setGrades([]);
          setAnalysisResult(null); // Reset nếu không có folder
          setIsLoading(prev => ({ ...prev, content: false, analysis: false }));
        }

      } catch (err) {
        setError({ folders: err.message, content: err.message, analysis: err.message });
        setIsLoading({ folders: false, content: false, analysis: false });
      }
    };

    fetchAllData();
  }, [accountId, selectedFolderId, refreshTrigger]);

  // 2. Hàm để cập nhật state, sẽ được truyền xuống component con
  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
  };

  // Tìm object folder đầy đủ từ danh sách để truyền tên xuống cho FolderExplorer
  const currentFolder = folders.flatMap(f => [f, ...(f.subfolders || [])]).find(f => f._id === selectedFolderId);

  return (
    <GradeContainer>
    <FolderExplorer 
      folder={currentFolder}
      courses={courses}
      grades={grades}
      isLoading={isLoading.content}
      error={error.content}
      onDataChange={handleDataChange}
      folderId={selectedFolderId}
      onEditClick={handleEditCourse}
    />
    <div>
      <FolderManager
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
        onDataChange={handleDataChange}
        isLoading={isLoading.folders}
        error={error.folders}
      />
        <StatisticsBoard 
          analysisResult={analysisResult}
          isLoading={isLoading.analysis}
          error={error.analysis}
        />
      </div>
    </GradeContainer>
  );
}