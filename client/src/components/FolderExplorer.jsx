import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from './Button';
import CourseFrame from './CourseFrame';

const ModalOverlay = styled("div")({
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const ModalContent = styled("div")({
  background: '#f5f6ef',
  borderRadius: '20px',
  border: '4px solid #4d774e',
  minWidth: '400px',
  padding: '40px 36px',
  boxShadow: '0 8px 32px 0 rgba(60,60,60,0.18)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const ModalTitle = styled("h3")({
  marginTop: 0,
  marginBottom: 24,
  fontSize: "2rem",
  fontWeight: 800,
  color: "#164a41",
  textAlign: "center",
  fontFamily: "EB Garamond, serif"
});

const StyledInput = styled("input")({
  fontSize: "1.25rem",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "2px solid #4d774e",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  background: "#fff",
  marginBottom: 0,
  transition: "border 0.2s",
  "&:focus": {
    border: "2.5px solid #164a41"
  }
});

const ButtonRow = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginTop: "24px"
});

const ModernButton = styled("button")(({ variant }) => ({
  padding: "12px 32px",
  fontSize: "1.15rem",
  fontWeight: 700,
  borderRadius: "14px",
  border: "none",
  background: variant === "primary"
    ? "linear-gradient(90deg,#4d774e,#9dc88d)"
    : "#fff",
  color: variant === "primary" ? "#fff" : "#4d774e",
  boxShadow: variant === "primary"
    ? "0 2px 12px 0 rgba(77,119,78,0.12)"
    : "none",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
  borderBottom: variant === "primary"
    ? "3px solid #164a41"
    : "2px solid #4d774e",
  "&:hover": {
    background: variant === "primary"
      ? "linear-gradient(90deg,#9dc88d,#4d774e)"
      : "#f5f6ef",
    color: "#164a41"
  }
}));

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
      alert("Course name is required");
    }
  };

  // Kiểu dáng tạm thời cho modal
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <StyledInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name..."
            autoFocus
          />
          <ButtonRow>
            <ModernButton type="submit" variant="primary">Save</ModernButton>
            <ModernButton type="button" onClick={onClose}>Cancel</ModernButton>
          </ButtonRow>
        </form>
      </ModalContent>
    </ModalOverlay>
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
});

const Rectangle27 = styled("div")({
  backgroundColor: `#dbe5d1`,
  border: `5px solid #164a41`,
  borderRadius: `15px 15px 0px 0px`,
  boxSizing: `border-box`,
  width: `1042px`,
  height: `1079px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Frame6 = styled("div")({
  backgroundColor: `#164a41`,
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

function FolderExplorer({folder, courses, grades, isLoading, error, onDataChange, onEditClick }) {
  // THÊM STATE ĐỂ QUẢN LÝ COURSE MODAL ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  // editingCourse có thể dùng trong tương lai để sửa tên course
  const [editingCourse, setEditingCourse] = useState(null); 

  const accountId = localStorage.getItem('accountId');
  // const navigate = useNavigate();

  const handleSaveCourse = async (courseName) => {
    if (!folder || !folder._id) {
        alert("Lỗi: Không xác định được thư mục hiện tại để thêm khóa học.");
        return; // Dừng hàm lại ngay lập tức
    }
    const isEditing = !!editingCourse;
    
    const url = isEditing
      ? `http://localhost:5000/api/courses/${editingCourse._id}`
      : 'http://localhost:5000/api/courses';

    const method = isEditing ? 'PUT' : 'POST';

     const body = { name: courseName, folderId: folder._id };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Thao tác thất bại');
      onDataChange();  // Tải lại danh sách để cập nhật UI
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // --- HÀM XỬ LÝ KHI CLICK VÀO COURSE FRAME ---
  const handleCourseClick = (courseId) => {
    console.log(`Điều hướng đến trang chi tiết của course: ${courseId}`);
    // Dòng này sẽ hoạt động khi đã thiết lập React Router
    // navigate(`/grades/course/${courseId}`); 
  };
  
  // --- CÁC HÀM ĐIỀU KHIỂN MODAL ---
  const openAddCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    onEditClick(course);
    setIsCourseModalOpen(true);
  };

  return (
    <>
      <FolderExplorer1>
        <Rectangle27 />
        <Frame7>
          {isLoading ? (
            <div style={{ color: 'black', padding: '20px' }}>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>
          ) : courses.length > 0 ? (
            courses.map(course => {
              // Với mỗi course, lọc ra các grade tương ứng của nó
              const gradesForCourse = grades.filter(grade => grade.courseId === course._id);
              return (
                <CourseFrame 
                  key={course._id} 
                  course={course} 
                  grades={gradesForCourse}
                  onEditClick={onEditClick}
                  onCourseClick={handleCourseClick}
                />
              );
            })
          ) : (
            <div style={{ color: 'black', padding: '20px' }}>
              {folder ? "This folder has no courses. Please create a new course!" : "Please select a folder to get started."}
            </div>
          )}
        </Frame7>
        <Frame6>
          <CoursesInThisFolder>
            {folder ? `Courses in ${folder.name}` : 'Courses in this folder'}
          </CoursesInThisFolder>
          {folder && <StyledButton label='+ New course' onClick={openAddCourseModal} />}
        </Frame6>
      </FolderExplorer1>
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={handleSaveCourse} // <-- Gọi hàm save duy nhất
        initialName={editingCourse ? editingCourse.name : ''} // <-- Lấy tên cũ nếu sửa
        title={editingCourse ? 'Rename Course' : 'Create New Course'} // <-- Đổi tiêu đề
      />
    </>
  );
}

export default FolderExplorer;