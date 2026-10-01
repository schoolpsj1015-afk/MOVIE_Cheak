/**
 * Helper utility functions for handling dates formatted as YYYYMMDD and YYYY-MM-DD
 */

// Get yesterday's date in YYYY-MM-DD format
export function getYesterdayString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert YYYY-MM-DD to YYYYMMDD for KOBIS API
export function formatToKobisDate(dateDashStr: string): string {
  return dateDashStr.replace(/-/g, '');
}

// Convert YYYYMMDD to YYYY-MM-DD
export function formatToDashDate(kobisDateStr: string): string {
  if (!kobisDateStr || kobisDateStr.length !== 8) return '';
  return `${kobisDateStr.slice(0, 4)}-${kobisDateStr.slice(4, 6)}-${kobisDateStr.slice(6, 8)}`;
}

// Format YYYY-MM-DD or YYYYMMDD to Korean human readable date (예: 2026년 9월 30일 수요일)
export function formatKoreanDate(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.replace(/-/g, '');
  if (clean.length !== 8) return dateStr;

  const year = parseInt(clean.slice(0, 4), 10);
  const month = parseInt(clean.slice(4, 6), 10);
  const day = parseInt(clean.slice(6, 8), 10);

  const dateObj = new Date(year, month - 1, day);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[dateObj.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// Check if a date string YYYY-MM-DD is valid and not in the future (up to yesterday)
export function isValidBoxOfficeDate(dateDashStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateDashStr)) return false;
  const yesterday = getYesterdayString();
  return dateDashStr <= yesterday;
}

// Get specific date shifted by days from today
export function getRelativeDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format number into Korean currency / audience count string (예: 1,234,567명)
export function formatNumber(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

// Format sales amount into Eok / Man format for easy Korean reading (예: 12.5억원)
export function formatKoreanSales(salesAmtStr: string | number | undefined): string {
  if (!salesAmtStr) return '0원';
  const num = typeof salesAmtStr === 'string' ? parseInt(salesAmtStr, 10) : salesAmtStr;
  if (isNaN(num)) return '0원';

  if (num >= 100000000) {
    const eok = (num / 100000000).toFixed(1);
    return `${eok}억원`;
  } else if (num >= 10000) {
    const man = Math.floor(num / 10000).toLocaleString();
    return `${man}만원`;
  }
  return `${num.toLocaleString()}원`;
}
