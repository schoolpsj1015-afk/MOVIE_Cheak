import React from 'react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatKoreanSales } from '../utils/date';
import { Users, Ticket, Crown, PieChart } from 'lucide-react';

interface BoxOfficeStatsProps {
  movies: DailyBoxOfficeItem[];
}

export const BoxOfficeStats: React.FC<BoxOfficeStatsProps> = ({ movies }) => {
  if (movies.length === 0) return null;

  const totalDailyAudi = movies.reduce((sum, item) => sum + (parseInt(item.audiCnt, 10) || 0), 0);
  const totalDailySales = movies.reduce((sum, item) => sum + (parseInt(item.salesAmt, 10) || 0), 0);
  const top1Movie = movies.find((m) => m.rank === '1');
  const top1Share = top1Movie ? top1Movie.salesShare : '0';

  const top5Movies = movies.slice(0, 5);

  const colors = [
    'bg-[#0066cc]',
    'bg-[#1d1d1f]',
    'bg-[#515154]',
    'bg-[#86868b]',
    'bg-[#d2d2d7]',
  ];

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Audience */}
        <div className="p-4 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#86868b] font-normal block tracking-tight">Top 10 당일 총 관객수</span>
            <strong className="text-xl sm:text-2xl text-[#1d1d1f] font-semibold tracking-tight font-display block">
              {formatNumber(totalDailyAudi)}명
            </strong>
          </div>
        </div>

        {/* Total Sales */}
        <div className="p-4 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#86868b] font-normal block tracking-tight">Top 10 당일 총 매출액</span>
            <strong className="text-xl sm:text-2xl text-[#1d1d1f] font-semibold tracking-tight font-display block">
              {formatKoreanSales(totalDailySales)}
            </strong>
          </div>
        </div>

        {/* #1 Movie Dominance */}
        <div className="p-4 bg-[#f5f5f7] border border-[#e0e0e0] rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0066cc] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#86868b] font-normal block tracking-tight">1위 영화 점유율</span>
            <strong className="text-xl sm:text-2xl text-[#0066cc] font-semibold tracking-tight font-display block">
              {top1Share}% <span className="text-xs font-normal text-[#86868b]">({top1Movie?.movieNm})</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Sales Share Distribution Bar Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#0066cc]" />
            Top 5 작품 매출액 점유율 분포
          </h3>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 bg-[#f5f5f7] rounded-full overflow-hidden flex border border-[#e0e0e0]">
          {top5Movies.map((m, idx) => {
            const share = parseFloat(m.salesShare) || 0;
            return (
              <div
                key={m.movieCd}
                style={{ width: `${share}%` }}
                className={`${colors[idx % colors.length]} h-full transition-all duration-300`}
                title={`${m.movieNm}: ${m.salesShare}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 text-xs">
          {top5Movies.map((m, idx) => (
            <div key={m.movieCd} className="flex items-center gap-1.5 shrink-0 font-normal">
              <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
              <span className="text-[#1d1d1f]">{m.movieNm}</span>
              <span className="text-[#0066cc] font-medium">({m.salesShare}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
