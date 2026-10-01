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
    'bg-[#8400FF]',
    'bg-white',
    'bg-slate-400',
    'bg-slate-600',
    'bg-slate-800',
  ];

  return (
    <div className="bg-[#121420] border-2 border-slate-700 p-5 sm:p-6 space-y-6">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Audience */}
        <div className="p-4 bg-[#0b0d14] border-2 border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#8400FF] text-white flex items-center justify-center shrink-0 border border-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-black block uppercase">Top 10 당일 총 관객수</span>
            <strong className="text-xl sm:text-2xl text-white font-impact tracking-wider block">
              {formatNumber(totalDailyAudi)}명
            </strong>
          </div>
        </div>

        {/* Total Sales */}
        <div className="p-4 bg-[#0b0d14] border-2 border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#8400FF] text-white flex items-center justify-center shrink-0 border border-white">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-black block uppercase">Top 10 당일 총 매출액</span>
            <strong className="text-xl sm:text-2xl text-white font-impact tracking-wider block">
              {formatKoreanSales(totalDailySales)}
            </strong>
          </div>
        </div>

        {/* #1 Movie Dominance */}
        <div className="p-4 bg-[#0b0d14] border-2 border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#8400FF] text-white flex items-center justify-center shrink-0 border border-white">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-black block uppercase">1위 영화 점유율</span>
            <strong className="text-xl sm:text-2xl text-[#a855f7] font-impact tracking-wider block">
              {top1Share}% <span className="text-xs font-black text-slate-300">({top1Movie?.movieNm})</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Sales Share Distribution Bar Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#8400FF]" />
            Top 5 작품 매출액 점유율 분포
          </h3>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-4 bg-[#0b0d14] flex border-2 border-slate-700">
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
        <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-1 text-xs">
          {top5Movies.map((m, idx) => (
            <div key={m.movieCd} className="flex items-center gap-1.5 shrink-0 font-black">
              <span className={`w-3 h-3 border border-slate-700 ${colors[idx % colors.length]}`} />
              <span className="text-slate-200">{m.movieNm}</span>
              <span className="text-[#8400FF] font-impact text-sm">({m.salesShare}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
