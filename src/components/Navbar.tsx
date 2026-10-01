import React from 'react';
import { Film, ShieldCheck, Download, RefreshCw, Calendar } from 'lucide-react';
import { formatKoreanDate } from '../utils/date';

interface NavbarProps {
  selectedDate: string;
  onRefresh: () => void;
  onExportCsv: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDate,
  onRefresh,
  onExportCsv,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Global Black Top Bar (44px) */}
      <div className="bg-[#000000] text-white h-[44px] px-4 sm:px-8 flex items-center justify-between text-xs font-normal border-b border-[#272729]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#ffffff]" />
            <span className="font-semibold tracking-tight text-white/90 text-xs">
              KOBIS Box Office
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#86868b]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#2997ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
              보안 환경변수 API 연동됨
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#a1a1a6]">
              <Calendar className="w-3.5 h-3.5 text-[#2997ff]" />
              {formatKoreanDate(selectedDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Nav Frosted Glass Header (52px) */}
      <div className="bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-[#e0e0e0] h-[52px] px-4 sm:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Category Title */}
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] font-display">
              일일 박스오피스
            </h1>
            <span className="text-xs text-[#86868b] font-normal hidden sm:inline">
              영화관입장권통합전산망 공식 데이터
            </span>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full bg-[#fafafc] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] transition active:scale-95 disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0066cc]' : ''}`} />
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-semibold tracking-tight transition active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 내보내기</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
