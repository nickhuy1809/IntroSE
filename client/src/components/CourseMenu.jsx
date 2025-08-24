import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Cell from "../components/Cell";

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

const Overlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.2)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Wrapper = styled("div")({
  padding: "20px",
  backgroundColor: "#f5f6ef",
  maxWidth: "1500px",
  width: "95vw",
  maxHeight: "90vh",
  margin: "auto",
  borderRadius: "16px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const CourseNameWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px",
});

const Table = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
});

const TableScroll = styled("div")({
    minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  marginBottom: "20px",
  overflowY: "overlay",
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(88,129,95,0.5)",
    borderRadius: "4px",
  },
});

const Column = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
});

const BottomControls = styled("div")({
  marginTop: "20px",
  display: "flex",
  gap: "10px",
  justifyContent: "center",
});

function DeleteButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        all: 'unset',
        background: isHovered ? '#c9302c' : '#d9534f',
        color: 'white',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path 
          d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function CourseMenu({ course, onClose, onDataChange }) {
  const [courseName, setCourseName] = useState(course.name);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchGrades = async () => {
      if (!course || !course._id) {
        setError("Không có thông tin khóa học.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/grades/course/${course._id}`, {
          headers: { 'x-account-id': accountId },
        });
        if (!response.ok) throw new Error('Không thể tải dữ liệu điểm.');
        const data = await response.json();
        // Map dữ liệu từ backend sang state của frontend
        const formattedGrades = data.map(g => ({
          _id: g._id,
          name: g.description,
          raw: g.score,
          percent: g.weight,
          maxScore: g.maxScore || 10
        }));
        setGrades(formattedGrades);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, [course, accountId]);

  // Hàm cập nhật tên khóa học
  const updateCourseName = async (newName) => {
    if (newName === course.name) return;
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Cập nhật tên khóa học thất bại');
      setCourseName(newName);
      // onDataChange(); // Thông báo cho component cha để cập nhật UI
    } catch (err) {
      alert(err.message);
    }
  };

  const updateGrade = async (index, field, value) => {
    const originalGrades = [...grades];
    const newGrades = [...grades];
    // Chuyển đổi giá trị sang số nếu cần
    if (field === "raw" || field === "percent" || field === "maxScore") {
      value = parseFloat(value) || 0;
    }

    const updatedGrade = { ...newGrades[index], [field]: value };
    newGrades[index] = updatedGrade;
    setGrades(newGrades); // Cập nhật UI ngay lập tức để người dùng thấy

    try {
        // Map tên trường của frontend sang backend
        const backendFieldMap = { name: 'description', raw: 'score', percent: 'weight' };
        const payload = {
            description: updatedGrade.name,
            score: updatedGrade.raw,
            weight: updatedGrade.percent,
            maxScore: updatedGrade.maxScore
        };
        
        const response = await fetch(`http://localhost:5000/api/grades/${updatedGrade._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
            body: JSON.stringify(payload)
        });
        if(!response.ok) throw new Error('Cập nhật thất bại');
        // onDataChange(); // Tải lại frame để cập nhật total score
    } catch (err) {
        alert(err.message);
        setGrades(originalGrades); // Nếu lỗi, hoàn lại state cũ
    }
  };

  const addGrade = async () => {
    const newGradeData = {
      description: `Grade ${grades.length + 1}`,
      score: 0,
      weight: 0,
      maxScore: 10, // Giả sử điểm tối đa mặc định là 10
      courseId: course._id,
    };

    try {
        const response = await fetch(`http://localhost:5000/api/grades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
            body: JSON.stringify(newGradeData)
        });
        if(!response.ok) throw new Error('Thêm điểm mới thất bại');
        const createdGrade = await response.json();
        // Cập nhật state với dữ liệu từ backend
        const formattedGrade = {
             _id: createdGrade._id, name: createdGrade.description, raw: createdGrade.score, percent: createdGrade.weight, maxScore: createdGrade.maxScore
        };
        setGrades([...grades, formattedGrade]);
        // onDataChange();
    } catch (err) {
        alert(err.message);
    }
  };

  const deleteGrade = async (index, gradeId) => {
    if(!window.confirm("Bạn có chắc chắn muốn xóa mục điểm này?")) return;
    try {
        const response = await fetch(`http://localhost:5000/api/grades/${gradeId}`, {
            method: 'DELETE',
            headers: { 'x-account-id': accountId }
        });
        if(!response.ok) throw new Error('Xóa thất bại');
        setGrades(grades.filter((_, i) => i !== index));
        // onDataChange();
    } catch (err) {
        alert(err.message);
    }
  };

  const handleSaveAndClose = () => {
    onDataChange();
    onClose();
  };

  const calculateProportional = (raw, percent, maxScore) => {
    if (!maxScore || maxScore === 0) return 0;
    return (((raw) * (percent)/100)).toFixed(2);
  };

  // Calculate sum of proportional grades
  const sumProportional = grades.reduce(
    (sum, g) => sum + parseFloat(calculateProportional(g.raw, g.percent, g.maxScore)), 0
  ).toFixed(2);

  const totalPercentage = grades.reduce((sum, g) => sum + g.percent, 0);

  if (!course) return null;

  return (
    <Overlay onClick={onClose}>
      <Wrapper onClick={e => e.stopPropagation()}>
        <CourseNameWrapper>
          <Cell
            variant="coursename"
            editable
            label={courseName}
            onChange={updateCourseName}
          />
        </CourseNameWrapper>
        {isLoading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div style={{color: 'red'}}>{error}</div>
        ) : (
          <TableScroll>
            <Table>
              <Column>
                <Cell variant="header" label="Grade name" />
                {grades.map((g, i) => (
                  <Cell
                    key={g._id || i}
                    variant="body"
                    editable
                    label={g.name}
                    onChange={(val) => updateGrade(i, "name", val)}
                  />
                ))}
                <Cell variant="final" label="Total" />
              </Column>
              <Column>
                <Cell variant="header" label="Raw grade" />
                {grades.map((g, i) => (
                  <Cell
                    key={g._id || i}
                    variant="body"
                    editable
                    label={g.raw.toString()}
                    onChange={(val) => updateGrade(i, "raw", val)}
                  />
                ))}
                <Cell variant="final" label="" />
              </Column>
              <Column>
                <Cell variant="header" label="Max Score" />
                {grades.map((g, i) => (
                  <Cell
                    key={g._id || i}
                    variant="body"
                    editable
                    label={g.maxScore.toString()}
                    onChange={(val) => updateGrade(i, "maxScore", val)}
                  />
                ))}
                <Cell variant="final" label="" />
              </Column>
              <Column>
                <Cell variant="header" label="Percentage" />
                {grades.map((g, i) => (
                  <Cell
                    key={g._id || i}
                    variant="body"
                    editable
                    label={g.percent.toString()}
                    onChange={(val) => updateGrade(i, "percent", val)}
                  />
                ))}
                <Cell variant="final" label={`${totalPercentage}%`} />
              </Column>
              <Column>
                <Cell variant="header" label="Proportional grade" />
                {grades.map((g, i) => (
                  <Cell
                    key={g._id || i}
                    variant="body"
                    label={calculateProportional(g.raw, g.percent, g.maxScore)}
                  />
                ))}
                <Cell variant="final" label={sumProportional} />
              </Column>
              <Column>
                <Cell variant="header" label="Delete" />
                {grades.map((g, i) => (
                  <Cell variant="body" key={g._id || i}>
                    <DeleteButton onClick={(e) => {
                      e.stopPropagation();
                      deleteGrade(i, g._id);
                    }} />
                  </Cell>
                ))}
                <Cell variant="final" label="" />
              </Column>
            </Table>
          </TableScroll>
        )}
        <BottomControls>
          <ModernButton variant="primary" onClick={handleSaveAndClose}>
            Save & Close
          </ModernButton>
          <ModernButton onClick={addGrade}>
            + New Grade
          </ModernButton>
        </BottomControls>
      </Wrapper>
    </Overlay>
  );
}

export default CourseMenu;