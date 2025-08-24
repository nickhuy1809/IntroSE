import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

// Thêm các styled components
const CellWrapper = styled("div")(({ variant, canEdit }) => {
  const baseStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    gap: "10px",
    boxSizing: "border-box",
    width: variant === "coursename" ? "1000px" : "225px",
    height: "120px",
    cursor: canEdit ? "pointer" : "default",
  };

  const variants = {
    header: {
      backgroundColor: "rgba(88, 129, 95, 1)",
      position: "relative",
      borderRadius: "12px",
      isolation: "isolate",
      flexDirection: "row",
      color: "#F8F7E3",
    },
    body: {
      borderBottom: "1px solid #A8BCA1",
    },
    final: {
      borderTop: "5px solid #58815F",
    },
    coursename: {
      backgroundColor: "rgba(88, 129, 95, 1)",
      borderRadius: "10px",
      color: "#F8F7E3",
      fontSize: "24px",
      fontWeight: "bold",
    },
  };

  return {
    ...baseStyle,
    ...(variants[variant] || {}),
  };
});

const CellInput = styled("input")(({ variant }) => ({
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  textAlign: "center",
  fontSize: "36px", // Luôn đồng bộ với CellText
  fontFamily: "EB Garamond",
  fontWeight: 700, // Đồng bộ với CellText
  backgroundColor: "transparent",
  color: variant === "header" || variant === "coursename" ? "#F8F7E3" : "#000",
  padding: "0",
  margin: "0",
  boxSizing: "border-box",
}));

const CellText = styled("div")(({ variant }) => ({
  textAlign: "center",
  whiteSpace: "pre-wrap",
  fontFamily: "EB Garamond",
  fontWeight: 700,
  fontSize: "36px",
  fontStyle: "normal",
  lineHeight: "normal",
  textDecoration: "none",
  textTransform: "none",
  color: variant === "header" || variant === "coursename" ? "#F8F7E3" : "#000",
}));

export default function Cell({ variant = "header", label = "Cell", editable = false, onChange, colIndex, children }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  const canEdit = editable;

  const handleBlur = () => {
    setEditing(false);
    let finalValue = value;
    if (value.trim() === "") {
      finalValue = "";
    }
    onChange?.(finalValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <CellWrapper variant={variant} canEdit={canEdit} onClick={() => canEdit && setEditing(true)}>
      {children ? (
        // Nếu có children (như DeleteButton), hiển thị children
        children
      ) : editing && canEdit ? (
        // Nếu đang edit và có thể edit
        <CellInput
          variant={variant}
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        // Hiển thị text bình thường
        <CellText variant={variant}>{value}</CellText>
      )}
    </CellWrapper>
  );
}