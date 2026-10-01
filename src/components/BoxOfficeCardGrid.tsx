import React from 'react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber } from '../utils/date';
import { TrendingUp, TrendingDown, Minus, Sparkles, Users, Calendar, Film } from 'lucide-react';

interface BoxOfficeCardGridProps {
  movies: DailyBoxOfficeItem[];
  onSelectMovie: (movie: DailyBoxOfficeItem) => void;
}

export const BoxOfficeCardGrid: React.FC<BoxOfficeCardGridProps> = ({ movies, onSelectMovie }) => {
  if (movies.length === 0) {
    return (
      <div className="py-16 text-center bg-[#121420] border-2 border-slate-700 text-slate-400">
        <Film className="w-12 h-12 mx-auto mb-3 text-[#8400FF]" />
        <p className="text-base font-black text-white">조건에 해당하는 영화 박스오피스 결과가 없습니다.</p>
        <p className="text-xs text-slate-400 font-bold mt-1">다른 날짜나 검색 조건을 선택해보세요.</p>
      </div>
    );
  }

  const maxAudi = Math.max(...movies.map((m) => parseInt(m.audiCnt, 10) || 1));

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="px-2 py-0.5 text-[11px] font-black bg-[#8400FF] text-white border border-white uppercase">
          NEW
        </span>
      );
    }

    const inten = parseInt(item.rankInten, 10);
    if (inten > 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-black bg-emerald-950 text-emerald-400 border border-emerald-500">
          <TrendingUp className="w-3 h-3" />
          {inten}
        </span>
      );
    } else if (inten < 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-black bg-rose-950 text-rose-400 border border-rose-500">
          <TrendingDown className="w-3 h-3" />
          {Math.abs(inten)}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-bold bg-[#0b0d14] text-slate-400 border border-slate-700">
        <Minus className="w-3 h-3" />
        유지
      </span>
    );
  };

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case '1':
        return 'bg-[#8400FF] text-white font-impact border-2 border-white text-xl';
      case '2':
        return 'bg-white text-slate-950 font-impact border-2 border-slate-300 text-xl';
      case '3':
        return 'bg-slate-800 text-amber-400 font-impact border-2 border-amber-400 text-xl';
      default:
        return 'bg-[#0b0d14] text-slate-300 font-impact border border-slate-700 text-lg';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {movies.map((movie) => {
        const audiCount = parseInt(movie.audiCnt, 10) || 0;
        const audiPercent = Math.min(100, Math.round((audiCount / maxAudi) * 100));

        return (
          <div
            key={movie.movieCd}
            onClick={() => onSelectMovie(movie)}
            className="group relative bg-[#121420] border-2 border-slate-700 hover:border-[#8400FF] p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Top header line: Rank & Change Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`w-9 h-9 flex items-center justify-center shrink-0 ${getRankBadge(
                    movie.rank
                  )}`}
                >
                  {movie.rank}
                </span>
                {renderRankChange(movie)}
              </div>

              {/* Movie Title */}
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#a855f7] transition line-clamp-2 leading-tight">
                {movie.movieNm}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mt-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8400FF]" />
                <span>{movie.openDt} 개봉</span>
              </div>
            </div>

            {/* Middle Stats */}
            <div className="my-4 space-y-3 pt-3 border-t border-slate-800">
              {/* Daily Audience with Visual Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-black flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#8400FF]" />
                    당일 관객
                  </span>
                  <strong className="text-white font-impact text-base tracking-wider">
                    {formatNumber(movie.audiCnt)}명
                  </strong>
                </div>
                <div className="w-full bg-[#0b0d14] h-2 border border-slate-800">
                  <div
                    className="bg-[#8400FF] h-full transition-all duration-300"
                    style={{ width: `${audiPercent}%` }}
                  />
                </div>
              </div>

              {/* Cumulative Audience & Sales Share */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#0b0d14] p-2.5 border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[11px] font-bold block">누적 관객</span>
                  <strong className="text-slate-200 font-impact tracking-wider">
                    {formatNumber(movie.audiAcc)}명
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] font-bold block">매출 점유율</span>
                  <strong className="text-[#a855f7] font-impact tracking-wider">
                    {movie.salesShare}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="pt-2 flex items-center justify-between text-xs font-black text-slate-400 group-hover:text-[#a855f7] transition border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8400FF]" />
                상세 &amp; AI 분석
              </span>
              <span className="text-[#8400FF] font-impact text-base">&rarr;</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
