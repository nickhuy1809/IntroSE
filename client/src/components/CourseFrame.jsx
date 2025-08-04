import { useState, useEffect } from 'react';
import {
  styled
} from '@mui/material/styles';

import ProgressBar from './ProgressBar';

const CourseFrame1 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `1024px`,
  height: `186px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
});

const Rectangle25 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  width: `11px`,
  height: `59px`,
  position: `absolute`,
  left: `155px`,
  top: `0px`,
});

const Rectangle27 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  width: `11px`,
  height: `59px`,
  position: `absolute`,
  left: `858px`,
  top: `0px`,
});

const Vector = styled("img")({
  height: `128px`,
  width: `1024px`,
  position: `absolute`,
  left: `-1px`,
  top: `58px`,
});

const Rectangle26 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  borderRadius: `0px 15px 15px 0px`,
  width: `130px`,
  height: `128px`,
  position: `absolute`,
  left: `893px`,
  top: `58px`,
});

const TotalScore = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 255, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `800`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `129px`,
  height: `87.19px`,
  position: `absolute`,
  left: `0px`,
  top: `90px`,
});

const Edit = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 255, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `800`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `129px`,
  height: `87.19px`,
  position: `absolute`,
  left: `893px`,
  top: `105px`,
  cursor: `pointer`,
});

const CourseName = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 139, 73, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `700`,
  fontSize: `30px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `200px`,
  height: `56.67px`,
  position: `absolute`,
  left: `155px`,
  top: `68px`,
});

const StyledProgressBar = styled(ProgressBar)({
  width: `702px`,
  height: `20px`,
  position: `absolute`,
  left: `162px`,
  top: `140px`,
});

const Progress = styled("div")({
  textAlign: `left`,
  whiteSpace: "nowrap",         // Không cho xuống dòng
  overflow: "hidden",         
  textOverflow: "clip",    
  fontSynthesis: `none`,
  color: `rgba(89, 111, 99, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `500`,
  fontSize: `20px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `auto`,
  height: `37.78px`,
  position: `absolute`,
  left: `161px`,
  top: `111px`,
});


function CourseFrame({ course, grades, onEditClick, onCourseClick }) {
   // --- LOGIC TÍNH ĐIỂM TỔNG (OVERALL SCORE) ---
  const calculateOverallScore = () => {
    // Nếu không có điểm nào, trả về 0
    if (!grades || grades.length === 0) return { score: "N/A", totalWeight: 0 };

    let weightedScoreSum = 0;
    let totalWeight = 0;

    grades.forEach(grade => {
      // Bỏ qua các điểm không có trọng số hoặc điểm không hợp lệ
      if (grade.weight > 0 && grade.maxScore > 0) {
        // (điểm thực / điểm tối đa) * trọng số
        weightedScoreSum += (grade.score / grade.maxScore) * grade.weight;
        totalWeight += grade.weight;
      }
    });

    // Tránh chia cho 0
    if (totalWeight === 0) return { score: "N/A", totalWeight: 0 };
    
    // Điểm tổng cuối cùng là tổng điểm có trọng số chia cho tổng trọng số
    // Sau đó có thể nhân với 10 hoặc 100 để ra thang điểm mong muốn. Ở đây ta giữ thang điểm 100.
    const finalScore = (weightedScoreSum / totalWeight) * 10;
    
    return { score: finalScore.toFixed(1), totalWeight }; // Làm tròn đến 1 chữ số thập phân
  };

  const { score, totalWeight } = calculateOverallScore();

  return (
    <CourseFrame1 onClick={() => onCourseClick(course._id)}>
      <Rectangle25>
      </Rectangle25>
      <Rectangle27>
      </Rectangle27>
      <Vector as="svg" xmlns="http://www.w3.org/2000/svg" width="1024" height="128" viewBox="0 0 1024 128" fill="none">
        <path d="M0 15C0 6.71573 6.71573 0 15 0H1009C1017.28 0 1024 6.71573 1024 15V113C1024 121.284 1017.28 128 1009 128H15C6.71573 128 0 121.284 0 113V15Z" fill="#FFF6F6"/>
        <path d="M0 15C0 6.71573 6.71573 0 15 0H128V128H15C6.71573 128 0 121.284 0 113V15Z" fill="#58815F"/>
        <path d="M15 1H127V127H15C7.26801 127 1 120.732 1 113V15C1 7.26801 7.26801 1 15 1ZM1009 1C1016.73 1 1023 7.26801 1023 15V113C1023 120.732 1016.73 127 1009 127H129V1H1009Z" stroke="#58815F" strokeWidth="2"/>
      </Vector>
      <Rectangle26>
      </Rectangle26>
      <TotalScore>
        {`Total score:\n${score}`}
      </TotalScore>
      <Edit onClick={(e) => { e.stopPropagation(); onEditClick(course); }}>
        {`EDIT`}
      </Edit>
      <CourseName>
        {course.name}
      </CourseName>
      <StyledProgressBar progress={totalWeight} />
      <Progress>
        {`${totalWeight}% completed`}
      </Progress>
    </CourseFrame1>);

  }

export default CourseFrame;