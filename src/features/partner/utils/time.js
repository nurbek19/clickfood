export const toISO = (hhmm) => {
  const today = new Date();
  const [h, m] = (hhmm || '00:00').split(':');
  const d = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    parseInt(h),
    parseInt(m)
  );
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

export const fromISOToHHmm = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toTimeString().slice(0, 5);
};


