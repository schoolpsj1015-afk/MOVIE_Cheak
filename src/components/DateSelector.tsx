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
    <div className="bg-[#121420] border-2 border-[#8400FF] p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Datepicker and Step Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handlePrevDay}
            disabled={isLoading}
            className="p-2.5 bg-[#1c1f30] hover:bg-[#8400FF] text-white border-2 border-slate-700 hover:border-white transition disabled:opacity-40"
            title="이전 날짜"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1 sm:flex-initial min-w-[210px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8400FF]">
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
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0d14] border-2 border-slate-700 focus:border-[#8400FF] text-white font-impact tracking-wider text-base focus:outline-none transition [color-scheme:dark]"
            />
          </div>

          <button
            onClick={handleNextDay}
            disabled={isLoading || isNextDisabled}
            className="p-2.5 bg-[#1c1f30] hover:bg-[#8400FF] text-white border-2 border-slate-700 hover:border-white transition disabled:opacity-30"
            title="다음 날짜 (어제까지 가능)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Current Date Display */}
          <div className="hidden sm:block text-slate-300 pl-2">
            <span className="text-slate-400 text-xs font-bold block">조회 대상일</span>
            <span className="text-white font-black text-sm">{formatKoreanDate(selectedDate)}</span>
          </div>
        </div>

        {/* Right: Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-black text-slate-400 mr-1 flex items-center gap-1 shrink-0 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#8400FF]" />
            빠른 선택:
          </span>
          {presets.map((preset) => {
            const isSelected = selectedDate === preset.date;
            return (
              <button
                key={preset.label}
                onClick={() => onDateChange(preset.date)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs font-black whitespace-nowrap transition border-2 ${
                  isSelected
                    ? 'bg-[#8400FF] border-white text-white font-black'
                    : 'bg-[#181a26] hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white font-black'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info notice */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-bold">
        <Info className="w-3.5 h-3.5 text-[#8400FF] shrink-0" />
        <span>
          일일 박스오피스는 전일(어제) 집계분까지 제공됩니다. (최신 가능일: <strong className="text-white font-impact tracking-wider">{yesterday}</strong>)
        </span>
      </div>
    </div>
  );
};
