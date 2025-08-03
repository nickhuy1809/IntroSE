import { useState } from 'react';
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
  // 1. State `selectedFolderId` được quản lý ở cấp cao nhất
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  // 2. Hàm để cập nhật state, sẽ được truyền xuống component con
  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
  };

  return (
    <GradeContainer>
      {/* Left panel: FolderExplorer */}
      <FolderExplorer folderId={selectedFolderId} onEditClick={handleEditCourse} />

      {/* Right panel: either CourseMenu or FolderManager+Statistics */}
      <div>
        {selectedCourse ? (
          <CourseMenu onClose={() => setSelectedCourse(null)} />
        ) : (
          <>
            <FolderManager selectedFolderId={selectedFolderId} onFolderSelect={handleFolderSelect}/>
            <StatisticsBoard folderId={selectedFolderId} />
          </>
        )}
      </div>
    </GradeContainer>
  );
}