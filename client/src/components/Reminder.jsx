export default function Reminders() {
    return (
        <div className="reminders">
            <h3>Reminder:</h3>
            <ul>
                {Array(8).fill(0).map((_, index) => (
                    <li key={index}><input type="checkbox"/> Study - Math and English vocab</li>
                ))} 
                <li><input type="checkbox"/> Label - Description</li>
            </ul>
        </div>
    );
}
