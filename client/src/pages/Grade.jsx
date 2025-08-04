import { useState, useEffect, useCallback } from 'react';
import styled from "@emotion/styled";
import FolderExplorer from "../components/FolderExplorer";
import StatisticsBoard from "../components/StatisticsBoard";
import FolderManager from "../components/FolderManager";


const GradeContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "0px",
  position: "relative",
});

export default function Grade() {
  // --- STATE ---
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState({ folders: true, content: true }); 
  const [error, setError] = useState({ folders: null, content: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const accountId = localStorage.getItem('accountId');

  // Hàm được gọi khi có thay đổi dữ liệu (thêm/sửa/xóa)
  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1); // Tăng trigger lên để kích hoạt lại useEffect
  };

  // Chạy lần đầu và mỗi khi `refreshTrigger` thay đổi
  useEffect(() => {
    const fetchAllData = async () => {
      if (!accountId) return;

      setIsLoading({ folders: true, content: true });
      setError({ folders: null, content: null });

      try {
        // 1. Luôn luôn fetch lại danh sách folder
        const foldersRes = await fetch('http://localhost:5000/api/folders', {
          headers: { 'x-account-id': accountId },
        });
        if (!foldersRes.ok) throw new Error('Không thể tải danh sách thư mục');
        const foldersData = await foldersRes.json();
        setFolders(foldersData);

        // 2. Xác định folder ID để fetch nội dung
        let folderIdToFetch = selectedFolderId;
        // Tự động chọn folder đầu tiên nếu chưa có gì được chọn
        if (selectedFolderId === null && foldersData.length > 0) {
          folderIdToFetch = foldersData[0]._id;
          // Quan trọng: Không gọi setState ở đây để tránh vòng lặp,
          // chúng ta sẽ dùng biến `folderIdToFetch` tạm thời
        }
        
        // 3. Lấy nội dung cho folder được chọn
        if (folderIdToFetch) {
          const [coursesRes, gradesRes] = await Promise.all([
            fetch(`http://localhost:5000/api/courses/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } }),
            fetch(`http://localhost:5000/api/grades/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } })
          ]);
          if (!coursesRes.ok || !gradesRes.ok) throw new Error('Không thể tải dữ liệu khóa học');
          const coursesData = await coursesRes.json();
          const gradesData = await gradesRes.json();
          setCourses(coursesData);
          setGrades(gradesData);
        } else {
          // Nếu không có folder nào, reset content
          setCourses([]);
          setGrades([]);
        }

      } catch (err) {
        setError({ folders: err.message, content: err.message });
      } finally {
        setIsLoading({ folders: false, content: false });
      }
    };

    fetchAllData();
  }, [accountId, selectedFolderId, refreshTrigger]);

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
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
        <StatisticsBoard folderId={selectedFolderId} />
      </div>
    </GradeContainer>
  );
}