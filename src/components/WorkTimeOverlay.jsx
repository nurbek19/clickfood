import { getFormattedWorkTime } from '../utils/workTimeCheck';
import '../App.css';

export const WorkTimeOverlay = ({ partner }) => {
  if (!partner || !partner.work_time) {
    return null;
  }

  return (
    <div className="work-time-overlay">
      <div className="work-time-alert">
        <div className="work-time-alert-icon">🕒</div>
        <h3>Заведение сейчас закрыто</h3>
        <p>Время работы: {getFormattedWorkTime(partner.work_time)}</p>
        <p>Вы можете сделать заказ когда заведение откроется</p>
      </div>
    </div>
  );
};
