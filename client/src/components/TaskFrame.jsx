import {
  styled
} from '@mui/material/styles';

const TaskFrame1 = styled("div")({
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

const Rectangle24 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  width: `11px`,
  height: `59px`,
  position: `absolute`,
  left: `858px`,
  top: `0px`,
});

const Rectangle25 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  width: `11px`,
  height: `59px`,
  position: `absolute`,
  left: `155px`,
  top: `0px`,
});

const Vector = styled("img")({
  height: `128px`,
  width: `1024px`,
  position: `absolute`,
  left: `0px`,
  top: `58px`,
});

const PriorityHigh = styled("div")({
  textAlign: `center`,
  whiteSpace: `wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 255, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `800`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `100px`,
  height: `60px`,
  position: `absolute`,
  left: `14px`,
  top: `92px`,
});

const Due = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(88, 129, 95, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `800`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `100px`,
  height: `30px`,
  position: `absolute`,
  left: `779px`,
  top: `69px`,
});

const Sunday = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(88, 129, 95, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `130px`,
  height: `30px`,
  position: `absolute`,
  left: `764px`,
  top: `101px`,
});

const Q27Jul2025 = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(88, 129, 95, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `130px`,
  height: `30px`,
  position: `absolute`,
  left: `764px`,
  top: `131px`,
});

const TaskName = styled("div")({
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
  position: `absolute`,
  left: `155px`,
  top: `83px`,
});

const TaskDescription = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(89, 111, 99, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `500`,
  fontSize: `20px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `155px`,
  top: `127px`,
});

const Rectangle26 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  borderRadius: `0px 15px 15px 0px`,
  width: `130px`,
  height: `128px`,
  position: `absolute`,
  left: `894px`,
  top: `58px`,
});

const Edit = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 246, 246, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `800`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `65px`,
  height: `40px`,
  position: `absolute`,
  left: `926px`,
  top: `102px`,
  cursor: 'pointer'
});

const Line7 = styled("img")({
  height: `0px`,
  width: `128px`,
  position: `absolute`,
  left: `828px`,
  top: `122px`,
});


function TaskFrame({ task, onEdit }) {

  // Hàm trợ giúp để format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) {
      return { dayOfWeek: '', date: 'No due date' };
    }
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return { dayOfWeek, date: formattedDate };
  };

  const dueDateInfo = formatDate(task.dueDate);
  
  // Hàm để thay đổi màu sắc dựa trên độ ưu tiên
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FFC0CB'; // Màu hồng nhạt cho High
      case 'medium': return '#FFFFE0'; // Màu vàng nhạt cho Medium
      case 'low': return '#ADD8E6'; // Màu xanh nhạt cho Low
      default: return '#FFF6F6'; // Màu mặc định
    }
  };

  return (
    <TaskFrame1>
      <Rectangle24>
      </Rectangle24>
      <Rectangle25>
      </Rectangle25>
      <Vector as='svg' xmlns="http://www.w3.org/2000/svg" width="1024" height="128" viewBox="0 0 1024 128" fill="none">
        <path d="M0 15C0 6.71573 6.71573 0 15 0H1009C1017.28 0 1024 6.71573 1024 15V113C1024 121.284 1017.28 128 1009 128H15C6.71573 128 0 121.284 0 113V15Z" fill="#FFF6F6"/>
        <path d="M0 15C0 6.71573 6.71573 0 15 0H128V128H15C6.71573 128 0 121.284 0 113V15Z" fill="#58815F"/>
        <path d="M15 1H127V127H15C7.26801 127 1 120.732 1 113V15C1 7.26801 7.26801 1 15 1ZM1009 1C1016.73 1 1023 7.26801 1023 15V113C1023 120.732 1016.73 127 1009 127H129V1H1009Z" stroke="#58815F" stroke-width="2"/>
      </Vector>
      <PriorityHigh>
        {`Priority\n${task.priority ? task.priority.toUpperCase() : 'N/A'}`}
      </PriorityHigh>
      <Due>
        {`DUE`}
      </Due>
      <Sunday>
        {dueDateInfo.dayOfWeek}
      </Sunday>
      <Q27Jul2025>
        {dueDateInfo.date}
      </Q27Jul2025>
      <TaskName>
        {task.title}
      </TaskName>
      <TaskDescription>
        {task.description}
      </TaskDescription>
      <Rectangle26>
      </Rectangle26>
      <Edit onClick={() => onEdit(task)}>
        {`EDIT`}
      </Edit>
      <Line7 as='svg' xmlns="http://www.w3.org/2000/svg" width="2" height="128" viewBox="0 0 2 128" fill="none">
        <path d="M1 127.996L1.0001 -0.00378407" stroke="#596F63" stroke-width="2"/>
      </Line7>
    </TaskFrame1>);

  }

export default TaskFrame;