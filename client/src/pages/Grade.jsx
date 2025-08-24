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
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState({ folders: true, content: true, analysis: false }); 
  const [error, setError] = useState({ folders: null, content: null, analysis: null });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [analysisResult, setAnalysisResult] = useState(null);

  const accountId = localStorage.getItem('accountId');

  // Hàm được gọi khi có thay đổi dữ liệu (thêm/sửa/xóa)
  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1); // Tăng trigger lên để kích hoạt lại useEffect
  };

  const triggerAIAnalysis = useCallback(async (folderId) => {
    if (!folderId) {
        setAnalysisResult(null);
        return;
    };

    setIsLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    setAnalysisResult(null); // Xóa kết quả cũ đi

    try {
        const analysisRes = await fetch(`http://localhost:5000/api/analysis/folder/${folderId}`, { 
            headers: { 'x-account-id': accountId } 
        });

        if (!analysisRes.ok) {
            // Cố gắng đọc lỗi từ server nếu có
            const errorData = await analysisRes.json().catch(() => null);
            throw new Error(errorData?.message || 'Không thể tải phân tích AI.');
        }

        const analysisData = await analysisRes.json();
        setAnalysisResult(analysisData);

    } catch (err) {
        setError(prev => ({ ...prev, analysis: err.message }));
        setAnalysisResult(null); // Reset nếu lỗi
    } finally {
        setIsLoading(prev => ({ ...prev, analysis: false }));
    }
  }, [accountId]);

  useEffect(() => {
    const fetchCoreData = async () => {
      if (!accountId) return;

      setIsLoading(prev => ({ ...prev, folders: true, content: true }));
      setError(prev => ({ ...prev, folders: null, content: null }));

      try {
        // 1. Fetch lại danh sách folder
        const foldersRes = await fetch('http://localhost:5000/api/folders', {
          headers: { 'x-account-id': accountId },
        });
        if (!foldersRes.ok) throw new Error('Cannot Load Folders');
        const foldersData = await foldersRes.json();
        setFolders(foldersData);

        // 2. Xác định folder ID để fetch nội dung
        let folderIdToFetch = selectedFolderId;
        if (selectedFolderId === null && foldersData.length > 0) {
          folderIdToFetch = foldersData[0]._id;
          setSelectedFolderId(folderIdToFetch);
          // KHI CHỌN FOLDER ĐẦU TIÊN TỰ ĐỘNG, CŨNG GỌI AI
          triggerAIAnalysis(folderIdToFetch); 
        }
        
        // 3. Lấy nội dung (course, grade) cho folder được chọn
        if (folderIdToFetch) {
          const [coursesRes, gradesRes] = await Promise.all([ // <-- BỎ `analysisRes` RA KHỎI ĐÂY
            fetch(`http://localhost:5000/api/courses/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } }),
            fetch(`http://localhost:5000/api/grades/folder/${folderIdToFetch}`, { headers: { 'x-account-id': accountId } })
          ]);

          if (coursesRes.ok && gradesRes.ok) {
            const coursesData = await coursesRes.json();
            const gradesData = await gradesRes.json();
            setCourses(coursesData);
            setGrades(gradesData);
          } else {
            throw new Error('Không thể tải dữ liệu khóa học.');
          }
        } else {
          // Nếu không có folder nào, reset hết
          setCourses([]);
          setGrades([]);
        }

      } catch (err) {
        setError(prev => ({ ...prev, folders: err.message, content: err.message }));
      } finally {
        setIsLoading(prev => ({ ...prev, folders: false, content: false }));
      }
    };

    fetchCoreData();
    // Phụ thuộc vào refreshTrigger để tải lại khi có thay đổi từ CourseMenu/FolderManager
    // Không cần selectedFolderId ở đây nữa vì việc gọi AI đã được xử lý riêng.
  }, [accountId, refreshTrigger]);

  const handleFolderSelect = (folderId) => {
    // Chỉ thực hiện nếu click vào một folder khác
    if (folderId !== selectedFolderId) {
        setSelectedFolderId(folderId);
        setSelectedCourse(null);
        // GỌI AI PHÂN TÍCH KHI VÀ CHỈ KHI USER CLICK VÀO FOLDER
        triggerAIAnalysis(folderId);
    } else {
        // Nếu click lại folder cũ, cũng có thể refresh AI
        console.log("Re-analyzing current folder...");
        triggerAIAnalysis(folderId);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsCourseMenuOpen(true); 
  };

  const handleCloseCourseMenu = () => {
    setIsCourseMenuOpen(false);
    setSelectedCourse(null); // Reset course đang chọn
  };

  // Tìm object folder đầy đủ từ danh sách để truyền tên xuống cho FolderExplorer
  const currentFolder = folders.flatMap(f => [f, ...(f.subfolders || [])]).find(f => f._id === selectedFolderId);

  useEffect(() => {
    const fetchContentForSelectedFolder = async () => {
        if (!selectedFolderId) {
            setCourses([]);
            setGrades([]);
            return;
        }

        setIsLoading(prev => ({ ...prev, content: true }));
        setError(prev => ({ ...prev, content: null }));
        try {
            const [coursesRes, gradesRes] = await Promise.all([
                fetch(`http://localhost:5000/api/courses/folder/${selectedFolderId}`, { headers: { 'x-account-id': accountId } }),
                fetch(`http://localhost:5000/api/grades/folder/${selectedFolderId}`, { headers: { 'x-account-id': accountId } })
            ]);

            if (coursesRes.ok && gradesRes.ok) {
                const coursesData = await coursesRes.json();
                const gradesData = await gradesRes.json();
                setCourses(coursesData);
                setGrades(gradesData);
            } else {
                throw new Error('Không thể tải dữ liệu khóa học.');
            }
        } catch (err) {
            setError(prev => ({ ...prev, content: err.message }));
        } finally {
            setIsLoading(prev => ({ ...prev, content: false }));
        }
    };
    
    fetchContentForSelectedFolder();
  }, [selectedFolderId, accountId]); 

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
        onFolderSelect={handleFolderSelect}
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
      {isCourseMenuOpen && selectedCourse && (
        <CourseMenu
          course={selectedCourse}
          onClose={handleCloseCourseMenu}
          onDataChange={handleDataChange}
        />
      )}
    </GradeContainer>
  );
}