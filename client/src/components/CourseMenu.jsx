import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Cell from "../components/Cell";

const Wrapper = styled("div")({
  padding: "20px",
  backgroundColor: "#f5f6ef",
  maxWidth: "1000px",
  margin: "auto",
});

const Table = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "5px",
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
  justifyContent: "space-between",
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
    // backend or file save logic here
    if (onClose) onClose();
  };
  
  const handleDeleteGrade = (e) => {
    // backend or file save logic here
  };
  const calculateProportional = (raw, percent) => {
    return ((raw * percent) / 100).toFixed(2);
  };

  return (
    <Wrapper>
      <h2>Course Name</h2>
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
        </Column>
        <Column>
          <Cell variant="header" label="Delete" />
          {grades.map((_, i) => (
            <Cell variant="body" key={i}>
                <DeleteButton onClick={handleDeleteGrade} />
            </Cell>
          ))}
        </Column>
      </Table>

      <BottomControls>
        <Button variant="contained" color="success" onClick={saveGrades}>
          Save & Close
        </Button>
        <Button variant="outlined" onClick={addGrade}>
          + New Grade
        </Button>
      </BottomControls>
    </Wrapper>
  );
}

export default CourseMenu;