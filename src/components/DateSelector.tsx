import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { getYesterdayString, getRelativeDateString, formatKoreanDate } from '../utils/date';

interface DateSelectorProps {
  selectedDate: string; // Format: YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  isLoading: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  isLoading,
}) => {
  const yesterday = getYesterdayString();

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    onDateChange(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    if (selectedDate >= yesterday) return;
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const nextStr = `${year}-${month}-${day}`;
    if (nextStr <= yesterday) {
      onDateChange(nextStr);
    }
  };

  const isNextDisabled = selectedDate >= yesterday;

  const presets = [
    { label: '어제 (최신)', date: yesterday },
    { label: '3일 전', date: getRelativeDateString(-3) },
    { label: '1주일 전', date: getRelativeDateString(-7) },
    { label: '1개월 전', date: getRelativeDateString(-30) },
    { label: '1년 전', date: getRelativeDateString(-365) },
  ];

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        {/* Left: Datepicker and Step Navigation */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handlePrevDay}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] flex items-center justify-center transition active:scale-95 disabled:opacity-40"
            title="이전 날짜"
          >
            <ChevronLeft className="w-4 h-4 text-[#1d1d1f]" />
          </button>

          <div className="relative flex-1 sm:flex-initial min-w-[210px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0066cc]">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              max={yesterday}
              onChange={(e) => {
                if (e.target.value && e.target.value <= yesterday) {
                  onDateChange(e.target.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[#1d1d1f] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:bg-white transition"
            />
          </div>

          <button
            onClick={handleNextDay}
            disabled={isLoading || isNextDisabled}
            className="w-10 h-10 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] flex items-center justify-center transition active:scale-95 disabled:opacity-30"
            title="다음 날짜 (어제까지 가능)"
          >
            <ChevronRight className="w-4 h-4 text-[#1d1d1f]" />
          </button>

          {/* Current Date Display */}
          <div className="hidden sm:block text-[#1d1d1f] pl-2">
            <span className="text-[#86868b] text-xs font-normal block">조회 대상일</span>
            <span className="text-[#1d1d1f] font-semibold text-sm tracking-tight">{formatKoreanDate(selectedDate)}</span>
          </div>
        </div>

        {/* Right: Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-[#86868b] mr-1 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#0066cc]" />
            빠른 선택:
          </span>
          {presets.map((preset) => {
            const isSelected = selectedDate === preset.date;
            return (
              <button
                key={preset.label}
                onClick={() => onDateChange(preset.date)}
                disabled={isLoading}
                className={`px-3.5 py-1.5 text-xs font-normal rounded-full whitespace-nowrap transition active:scale-95 ${
                  isSelected
                    ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info notice */}
      <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center gap-2 text-xs text-[#86868b]">
        <Info className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
        <span>
          일일 박스오피스는 영진위 공식 API 집계 특성상 전일(어제)까지 제공됩니다. (선택 가능 상한: <strong className="text-[#1d1d1f] font-semibold">{yesterday}</strong>)
        </span>
      </div>
    </div>
  );
};
