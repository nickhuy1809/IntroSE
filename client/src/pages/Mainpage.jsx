import Suggestion from '../components/Suggestion';
import ScheduleCalendar from '../components/ScheduleCalendar';
import Reminder from '../components/Reminder';

export default function MainPage() {
    return (
        <div className="app-container">
            <main className="main-content">
                <div className="suggestion-container">
                    <Suggestion />
                </div>
                <div className="calendar-container">
                    <ScheduleCalendar defaultView="week" availableViews={['week']} />
                </div>
                <div className="reminder-container">
                    <Reminder />
                </div>
            </main>
        </div>
    );
}
