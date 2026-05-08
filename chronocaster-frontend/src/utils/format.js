export const fmtTimer = (sec) => {
  const sign = sec < 0 ? '-' : '';
  const a = Math.abs(Math.floor(sec));
  const h = Math.floor(a / 3600);
  const m = Math.floor((a % 3600) / 60);
  const s = a % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${sign}${pad(h)}:${pad(m)}:${pad(s)}` : `${sign}${pad(m)}:${pad(s)}`;
};

export const fmtDuration = (sec) => {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

export const fmtSigned = (sec) => {
  const sign = sec >= 0 ? '+' : '-';
  const a = Math.abs(Math.floor(sec));
  const m = Math.floor(a / 60);
  const s = a % 60;
  return `${sign}${m}:${String(s).padStart(2, '0')}`;
};

export const fmtSchedule = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d - now;
  const diffMin = Math.round(diffMs / 60000);
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (Math.abs(diffMin) < 60 && diffMin >= 0) return `in ${diffMin} min · ${time}`;
  if (sameDay) return `today · ${time}`;
  if (diffMin < 0) {
    const days = Math.round(-diffMin / (60 * 24));
    return `${days}d ago`;
  }
  const days = Math.round(diffMin / (60 * 24));
  if (days <= 1) return `tomorrow · ${time}`;
  return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} · ${time}`;
};
