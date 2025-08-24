import Suggestion from '../components/Suggestion';
import ScheduleCalendar from '../components/ScheduleCalendar';
import Reminder from '../components/Reminder';
import styled from "@emotion/styled";

const MainContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0px",
  height: "auto",
  width: "auto",
});

export default function MainPage() {
    return (
        <MainContainer>
            <Suggestion />
            <ScheduleCalendar defaultView="week" availableViews={['week']} />
            <Reminder />
        </MainContainer>
    );
}
