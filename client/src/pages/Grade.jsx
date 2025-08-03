import { useState } from 'react';
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
  // 1. State `selectedFolderId` được quản lý ở cấp cao nhất
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // 2. Hàm để cập nhật state, sẽ được truyền xuống component con
  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  return (
    <GradeContainer>
      <FolderExplorer folderId={selectedFolderId} />
      <div>
        <FolderManager selectedFolderId={selectedFolderId} onFolderSelect={handleFolderSelect}/>
        <StatisticsBoard folderId={selectedFolderId} />
      </div>
    </GradeContainer>
  );
}