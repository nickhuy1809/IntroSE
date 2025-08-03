import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from './Button';
import CourseFrame from './CourseFrame';

function CourseModal({ isOpen, onClose, onSubmit, initialName = '', title }) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      onClose();
    } else {
      alert("Tên khóa học không được để trống!");
    }
  };

  // Kiểu dáng tạm thời cho modal
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const modalContentStyle = { background: 'white', padding: '20px', borderRadius: '8px', width: '300px' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nhập tên khóa học..."
            style={inputStyle}
            autoFocus
          />
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FolderExplorer1 = styled("div")({
  borderRadius: `15px 15px 0px 0px`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `1042px`,
  height: `1079px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  overflow: `hidden`,
});

const Rectangle27 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 0.5)`,
  border: `5px solid rgba(88, 129, 95, 1)`,
  borderRadius: `15px 15px 0px 0px`,
  boxSizing: `border-box`,
  width: `1042px`,
  height: `1079px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Frame6 = styled("div")({
  backgroundColor: `rgba(251, 155, 110, 1)`,
  borderRadius: `20px`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  alignItems: `center`,
  padding: `20px`,
  boxSizing: `border-box`,
  width: `1024px`,
  height: `61px`,
  left: `9px`,
  top: `9px`,
});

const Frame7 = styled("div")({
  display: "block",
  padding: 0,
  boxSizing: "border-box",
  width: "1024px",
  maxHeight: "1004px",
  overflowY: "auto",
  background: "transparent",
  position: "absolute",
  top: "70px",
  left: "9px",
  isolation: "isolate",
  "::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
});

const CoursesInThisFolder = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(248, 247, 227, 1)`,
  fontStyle: `normal`,
  fontFamily: `Exo`,
  fontWeight: `700`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  margin: `0px`,
});

const StyledButton = styled(Button)({
  width: `187.65px`,
  height: `51.07px`,
  right : `0px`,
  top: `5px`,
  display: `flex`,
});

function FolderExplorer({ folderId }) {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // THÊM STATE ĐỂ QUẢN LÝ COURSE MODAL ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  // editingCourse có thể dùng trong tương lai để sửa tên course
  const [editingCourse, setEditingCourse] = useState(null); 

  const accountId = localStorage.getItem('accountId');
  // const navigate = useNavigate();

  // HÀM LẤY DỮ LIỆU (Cần cập nhật để có thể gọi lại) ---
  const fetchData = async () => {
    if (!folderId) {
      setCourses([]);
      setGrades([]);
      setCurrentFolder(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [folderRes, coursesRes, gradesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/folders/${folderId}`, { headers: { 'x-account-id': accountId } }),
          fetch(`http://localhost:5000/api/courses/folder/${folderId}`, { headers: { 'x-account-id': accountId } }),
          fetch(`http://localhost:5000/api/grades/folder/${folderId}`, { headers: { 'x-account-id': accountId } })
      ]);
      if (!folderRes.ok || !coursesRes.ok || !gradesRes.ok) throw new Error('Không thể tải dữ liệu cho thư mục này');
      const folderData = await folderRes.json();
      const coursesData = await coursesRes.json();
      const gradesData = await gradesRes.json();
      setCurrentFolder(folderData);
      setCourses(coursesData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [folderId]);

  const handleSaveCourse = async (courseName) => {
    const isEditing = !!editingCourse;
    
    const url = isEditing
      ? `http://localhost:5000/api/courses/${editingCourse._id}`
      : 'http://localhost:5000/api/courses';

    const method = isEditing ? 'PUT' : 'POST';

    const body = {
      name: courseName,
      folderId: folderId // folderId luôn được lấy từ prop
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Thao tác thất bại');
      fetchData(); // Tải lại danh sách để cập nhật UI
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // --- HÀM XỬ LÝ KHI CLICK VÀO COURSE FRAME ---
  const handleCourseClick = (courseId) => {
    console.log(`Điều hướng đến trang chi tiết của course: ${courseId}`);
    // Dòng này sẽ hoạt động khi bạn đã thiết lập React Router
    // navigate(`/grades/course/${courseId}`); 
  };
  
  // --- CÁC HÀM ĐIỀU KHIỂN MODAL ---
  const openAddCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  return (
    <>
      <FolderExplorer1>
        <Rectangle27 />
        <Frame7>
          {isLoading ? (
            <div style={{ color: 'black', padding: '20px' }}>Đang tải...</div>
          ) : error ? (
            <div style={{ color: 'red', padding: '20px' }}>Lỗi: {error}</div>
          ) : courses.length > 0 ? (
            courses.map(course => {
              // Với mỗi course, lọc ra các grade tương ứng của nó
              const gradesForCourse = grades.filter(grade => grade.courseId === course._id);
              return (
                <CourseFrame 
                  key={course._id} 
                  course={course} 
                  grades={gradesForCourse}
                  onEditClick={openEditCourseModal}
                  onCourseClick={handleCourseClick}
                />
              );
            })
          ) : (
            <div style={{ color: 'black', padding: '20px' }}>
              {folderId ? "Thư mục này chưa có khóa học nào. Hãy tạo một khóa học mới!" : "Vui lòng chọn một thư mục để bắt đầu."}
            </div>
          )}
        </Frame7>
        <Frame6>
          <CoursesInThisFolder>
            {currentFolder ? `Courses in ${currentFolder.name}` : 'Courses in this folder'}
          </CoursesInThisFolder>
          {folderId && <StyledButton label='+ New course' onClick={openAddCourseModal} />}
        </Frame6>
      </FolderExplorer1>
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={handleSaveCourse} // <-- Gọi hàm save duy nhất
        initialName={editingCourse ? editingCourse.name : ''} // <-- Lấy tên cũ nếu sửa
        title={editingCourse ? 'Đổi tên khóa học' : 'Tạo khóa học mới'} // <-- Đổi tiêu đề
      />
    </>
  );
}

export default FolderExplorer;