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
    <header className="sticky top-0 z-30 bg-[#0f111a] border-b-2 border-[#8400FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8400FF] flex items-center justify-center text-white font-black text-xl font-impact tracking-wider border-2 border-white">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-black">
                KOBIS <span className="text-[#8400FF] bg-white px-2 py-0.5 text-black font-black uppercase tracking-wider">일일 박스오피스</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-bold">
              영화관입장권통합전산망 API
            </p>
          </div>
        </div>

        {/* API Key Security Badge & Current Date indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#181a26] border-2 border-[#8400FF] text-[#a855f7] text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>환경변수 API 키 사용</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#181a26] border border-slate-700 text-slate-200 text-xs font-black">
            <Calendar className="w-3.5 h-3.5 text-[#8400FF]" />
            <span>{formatKoreanDate(selectedDate)}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-[#181a26] hover:bg-[#8400FF] text-slate-200 hover:text-white border-2 border-slate-700 hover:border-[#8400FF] transition disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-white' : ''}`} />
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8400FF] hover:bg-[#7000DB] text-white text-xs font-black uppercase tracking-wider border-2 border-white transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-black">CSV 저장</span>
          </button>
        </div>
      </div>
    </header>
  );
};
