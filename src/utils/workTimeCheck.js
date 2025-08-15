/**
 * Check if a partner is currently working based on their work time schedule
 * @param {Object} workTime - Partner's work time object with 'from' and 'to' properties
 * @returns {boolean} - True if partner is currently working, false otherwise
 */
export const isPartnerWorking = (workTime) => {
  if (!workTime || !workTime.from || !workTime.to) {
    return false;
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes since midnight

  // Parse work start and end times
  const [startHour, startMinute] = workTime.from.split(':').map(Number);
  const [endHour, endMinute] = workTime.to.split(':').map(Number);
  
  const workStartMinutes = startHour * 60 + startMinute;
  const workEndMinutes = endHour * 60 + endMinute;

  // Handle cases where work time spans midnight
  if (workEndMinutes < workStartMinutes) {
    // Work time spans midnight (e.g., 22:00 to 06:00)
    return currentTime >= workStartMinutes || currentTime <= workEndMinutes;
  } else {
    // Normal work time within same day
    return currentTime >= workStartMinutes && currentTime <= workEndMinutes;
  }
};

/**
 * Get formatted work time string for display
 * @param {Object} workTime - Partner's work time object
 * @returns {string} - Formatted work time string
 */
export const getFormattedWorkTime = (workTime) => {
  if (!workTime || !workTime.from || !workTime.to) {
    return 'Время работы не указано';
  }
  return `${workTime.from} - ${workTime.to}`;
};
