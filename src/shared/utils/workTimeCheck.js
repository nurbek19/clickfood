export const isPartnerWorking = (partner) => {
  if (!partner?.work_time?.from || !partner?.work_time?.to) {
    return true; // If no work time set, assume always working
  }

  // Parse ISO times to Date objects - they will automatically convert to local timezone
  const startTime = new Date(partner.work_time.from);
  const endTime = new Date(partner.work_time.to);
  const now = new Date();

  // Extract hours and minutes for comparison
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const startHours = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const startTimeInMinutes = startHours * 60 + startMinutes;

  const endHours = endTime.getHours();
  const endMinutes = endTime.getMinutes();
  const endTimeInMinutes = endHours * 60 + endMinutes;

  console.log('Times in minutes:', {
    current: currentTimeInMinutes,
    start: startTimeInMinutes,
    end: endTimeInMinutes
  });

  // Handle cases where end time is on the next day
  if (endTimeInMinutes < startTimeInMinutes) {
    // If current time is before midnight
    if (currentTimeInMinutes >= startTimeInMinutes) {
      // console.log('Case 1: After start time, before midnight');
      return true;
    }
    // If current time is after midnight but before end time
    if (currentTimeInMinutes <= endTimeInMinutes) {
      // console.log('Case 2: After midnight, before end time');
      return true;
    }
    // console.log('Case 3: Outside overnight hours');
    return false;
  }

  // Normal case: start and end times are on the same day
  const isWorking = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
  console.log('Normal case:', isWorking);
  return isWorking;
};