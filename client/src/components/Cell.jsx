import React, { useState } from "react";
import { styled } from "@mui/material/styles";

const CellWrapper = styled("div")(({ variant }) => {
  const baseStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    gap: "10px",
    boxSizing: "border-box",
    width: "200px",
    height: "120px",
    cursor: "pointer",
  };

  const variants = {
    header: {
      backgroundColor: "rgba(88, 129, 95, 1)",
      position: "relative",
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
  };

  return {
    ...baseStyle,
    ...(variants[variant] || {}),
  };
});

const CellText = styled("div")({
  textAlign: "center",
  whiteSpace: "pre-wrap",
  fontFamily: "EB Garamond",
  fontWeight: 700,
  fontSize: "36px",
  fontStyle: "normal",
  lineHeight: "normal",
  textDecoration: "none",
  textTransform: "none",
  color: "#000",
});

const CellInput = styled("input")({
  width: "100%",
  fontFamily: "EB Garamond",
  fontSize: "36px",
  fontWeight: 700,
  border: "none",
  outline: "none",
  background: "transparent",
  textAlign: "center",
});

export default function Cell({ variant = "header", label = "Cell", editable = false, onChange }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  const handleBlur = () => {
    setEditing(false);
    onChange?.(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <CellWrapper variant={variant} onClick={() => editable && setEditing(true)}>
      {editing && editable ? (
        <CellInput
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <CellText>{value}</CellText>
      )}
    </CellWrapper>
  );
}