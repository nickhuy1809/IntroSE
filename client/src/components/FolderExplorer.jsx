import React from 'react';
import styled from '@emotion/styled';

const FolderExplorer1 = styled("div")({
  borderRadius: `15px 15px 0px 0px`,
  display: `fixed`,
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
  borderRadius: "15px 15px 0 0",
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
  display: `fixed`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `center`,
  alignItems: `center`,
  padding: `20px`,
  boxSizing: `border-box`,
  width: `1024px`,
  height: `61px`,
  left: `9px`,
  top: `9px`,
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

function FolderExplorer() {
  return (
    <FolderExplorer1>
      <Rectangle27 />
      <Frame6>
        <CoursesInThisFolder>
          {`Courses in this folder`}
        </CoursesInThisFolder>
      </Frame6>
    </FolderExplorer1>
  );
}

export default FolderExplorer;