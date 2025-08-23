import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Cell from "../components/Cell";

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
  maxWidth: "1200px",
  width: "90vw",
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
  return (
    <button
      onClick={(e) => {}}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3.75V14.25M3.75 9H14.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function CourseMenu({ onClose }) {
  const [courseName, setCourseName] = useState("Course Name");
  const [grades, setGrades] = useState([
    { name: "Assignment 1", raw: 9, percent: 10 },
    { name: "Assignment 2", raw: 8, percent: 10 },
    { name: "Midterm", raw: 7.5, percent: 30 },
    { name: "Final", raw: 8, percent: 50 },
  ]);

  const updateGrade = (index, field, value) => {
    const newGrades = [...grades];
    if (field === "raw" || field === "percent") {
      value = parseFloat(value) || 0;
    }
    newGrades[index][field] = value;
    setGrades(newGrades);
  };

  const addGrade = () => {
    setGrades([
      ...grades,
      { name: `Grade ${grades.length + 1}`, raw: 0, percent: 0 },
    ]);
  };

  const deleteGrade = (index) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const saveGrades = () => {
    console.log("Saved grades:", grades);
    if (onClose) onClose();
  };

  const calculateProportional = (raw, percent) => {
    return ((raw * percent) / 100).toFixed(2);
  };

  // Calculate sum of proportional grades
  const sumProportional = grades.reduce(
    (sum, g) => sum + parseFloat(calculateProportional(g.raw, g.percent)),
    0
  ).toFixed(2);

  return (
    <Overlay>
      <Wrapper>
        <CourseNameWrapper>
          <Cell
            variant="coursename"
            editable
            label={courseName}
            onChange={setCourseName}
          />
        </CourseNameWrapper>
        <TableScroll>
          <Table>
            <Column>
              <Cell variant="header" label="Grade name" />
              {grades.map((g, i) => (
                <Cell
                  key={i}
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
                  key={i}
                  variant="body"
                  editable
                  label={g.raw.toString()}
                  onChange={(val) => updateGrade(i, "raw", val)}
                />
              ))}
              <Cell variant="final" label="" />
            </Column>
            <Column>
              <Cell variant="header" label="Percentage" />
              {grades.map((g, i) => (
                <Cell
                  key={i}
                  variant="body"
                  editable
                  label={g.percent.toString()}
                  onChange={(val) => updateGrade(i, "percent", val)}
                />
              ))}
              <Cell variant="final" label="" />
            </Column>
            <Column>
              <Cell variant="header" label="Proportional grade" />
              {grades.map((g, i) => (
                <Cell
                  key={i}
                  variant="body"
                  label={calculateProportional(g.raw, g.percent)}
                />
              ))}
              <Cell variant="final" label={sumProportional} />
            </Column>
            <Column>
              <Cell variant="header" label="Delete" />
              {grades.map((_, i) => (
                <Cell variant="body" key={i}>
                  <DeleteButton onClick={() => deleteGrade(i)} />
                </Cell>
              ))}
              <Cell variant="final" label="" />
            </Column>
          </Table>
        </TableScroll>
        <BottomControls>
          <Button variant="contained" color="success" onClick={saveGrades}>
            Save & Close
          </Button>
          <Button variant="outlined" onClick={addGrade}>
            + New Grade
          </Button>
        </BottomControls>
      </Wrapper>
    </Overlay>
  );
}

export default CourseMenu;