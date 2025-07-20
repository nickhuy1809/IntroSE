import Sidebar from './Sidebar';
import Suggestion from './Suggestion';
import Calendar from './Calendar';
import Reminder from './Reminder';

export default function MainPage() {
    return (
        <div className="main-container">
            <main className="content">
                <Suggestion />
                <Calendar />
            </main>
            <Reminder />
        </div>
    );
}
