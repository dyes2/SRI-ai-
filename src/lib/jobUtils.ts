import { Job } from '../types';

export type ComputedStatus = 'UPCOMING' | 'ONGOING' | 'CLOSED';

export function getComputedJobStatus(job: Job): ComputedStatus {
  const now = new Date();
  // Set to Seoul time if we want to be strict, but typically new Date() is fine for user's local
  // For safety in a web app, we usually treat dates without times as inclusive.
  
  const start = job.schedule?.postingPeriod.start ? new Date(job.schedule.postingPeriod.start) : null;
  const end = job.schedule?.postingPeriod.end ? new Date(job.schedule.postingPeriod.end) : null;

  if (!start || !end) return job.status as ComputedStatus; // Fallback to recorded status

  // Normalize to date only for comparison if needed, 
  // but usually postingPeriod strings are 'YYYY-MM-DD'
  const todayStr = now.toISOString().split('T')[0];
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  if (todayStr < startStr) return 'UPCOMING';
  if (todayStr > endStr) return 'CLOSED';
  return 'ONGOING';
}

export function formatDotDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}
