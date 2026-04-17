export interface Friend {
  id: number;
  name: string;
  picture: string;
  email: string;
  days_since_contact: number;
  status: string;
  tags?: string[];
  bio: string;
  goal: number;
  next_due_date: string;
}

export const FRIENDS_DATA_PATH = '/data/friends.json';

export function normalizeFriendStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, '-');
}

export function formatFriendStatus(status: string) {
  return status.replace(/-/g, ' ');
}

export function getFriendStatusClasses(status: string) {
  switch (normalizeFriendStatus(status)) {
    case 'overdue':
      return 'bg-[#EF4444] text-white';
    case 'on-track':
      return 'bg-[#22574A] text-white';
    case 'almost-due':
      return 'bg-[#F5A623] text-white';
    default:
      return 'bg-blue-600 text-white';
  }
}

export function isOnTrackStatus(status: string) {
  return normalizeFriendStatus(status) === 'on-track';
}

export function needsAttentionStatus(status: string) {
  const normalizedStatus = normalizeFriendStatus(status);
  return normalizedStatus === 'overdue' || normalizedStatus === 'almost-due';
}

export function getFriendStatus(daysSinceContact: number, goal: number) {
  if (daysSinceContact >= goal) {
    return 'overdue';
  }

  if (daysSinceContact >= Math.max(goal - 3, Math.ceil(goal * 0.75))) {
    return 'almost due';
  }

  return 'on-track';
}
