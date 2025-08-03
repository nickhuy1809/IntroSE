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
  return (
    <GradeContainer>
      <FolderExplorer />
      <div>
        <FolderManager />
        <StatisticsBoard />
      </div>
    </GradeContainer>
  );
}