import React from 'react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber } from '../utils/date';
import { TrendingUp, TrendingDown, Minus, Sparkles, Users, Calendar, Film, ChevronRight } from 'lucide-react';

interface BoxOfficeCardGridProps {
  movies: DailyBoxOfficeItem[];
  onSelectMovie: (movie: DailyBoxOfficeItem) => void;
}

export const BoxOfficeCardGrid: React.FC<BoxOfficeCardGridProps> = ({ movies, onSelectMovie }) => {
  if (movies.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-[#e0e0e0] rounded-2xl text-[#86868b]">
        <Film className="w-12 h-12 mx-auto mb-3 text-[#0066cc]/40" />
        <p className="text-base font-semibold text-[#1d1d1f]">조건에 해당하는 영화 박스오피스 결과가 없습니다.</p>
        <p className="text-xs text-[#86868b] mt-1">다른 날짜나 검색 필터를 선택해 보세요.</p>
      </div>
    );
  }

  const maxAudi = Math.max(...movies.map((m) => parseInt(m.audiCnt, 10) || 1));

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#0066cc] text-white rounded-full">
          NEW
        </span>
      );
    }

    const inten = parseInt(item.rankInten, 10);
    if (inten > 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium bg-[#e6f4ea] text-[#137333] rounded-full">
          <TrendingUp className="w-3 h-3" />
          {inten}
        </span>
      );
    } else if (inten < 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium bg-[#fce8e6] text-[#c5221f] rounded-full">
          <TrendingDown className="w-3 h-3" />
          {Math.abs(inten)}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-normal bg-[#f5f5f7] text-[#86868b] rounded-full border border-[#e0e0e0]">
        <Minus className="w-3 h-3" />
        유지
      </span>
    );
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case '1':
        return 'bg-[#0066cc] text-white font-semibold shadow-sm';
      case '2':
      case '3':
        return 'bg-[#1d1d1f] text-white font-semibold';
      default:
        return 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0] font-medium';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {movies.map((movie) => {
        const audiCount = parseInt(movie.audiCnt, 10) || 0;
        const audiPercent = Math.min(100, Math.round((audiCount / maxAudi) * 100));

        return (
          <div
            key={movie.movieCd}
            onClick={() => onSelectMovie(movie)}
            className="group relative bg-white border border-[#e0e0e0] rounded-2xl p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
          >
            {/* Top header line: Rank & Change Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${getRankBadgeClass(
                    movie.rank
                  )}`}
                >
                  #{movie.rank}
                </span>
                {renderRankChange(movie)}
              </div>

              {/* Movie Title */}
              <h3 className="text-base sm:text-lg font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-2 leading-tight tracking-tight font-display">
                {movie.movieNm}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-[#86868b] mt-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0066cc]" />
                <span>{movie.openDt} 개봉</span>
              </div>
            </div>

            {/* Middle Stats */}
            <div className="my-4 space-y-3 pt-3 border-t border-[#f0f0f0]">
              {/* Daily Audience with Visual Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#86868b] flex items-center gap-1 font-normal">
                    <Users className="w-3.5 h-3.5 text-[#0066cc]" />
                    당일 관객
                  </span>
                  <strong className="text-[#1d1d1f] font-semibold">{formatNumber(movie.audiCnt)}명</strong>
                </div>
                <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0066cc] h-full rounded-full transition-all duration-300"
                    style={{ width: `${audiPercent}%` }}
                  />
                </div>
              </div>

              {/* Cumulative Audience & Sales Share */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#f5f5f7] p-2.5 rounded-xl border border-[#e0e0e0]">
                <div>
                  <span className="text-[#86868b] text-[11px] block font-normal">누적 관객</span>
                  <strong className="text-[#1d1d1f] font-medium">{formatNumber(movie.audiAcc)}명</strong>
                </div>
                <div>
                  <span className="text-[#86868b] text-[11px] block font-normal">매출 점유율</span>
                  <strong className="text-[#0066cc] font-semibold">{movie.salesShare}%</strong>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#0066cc] font-normal group-hover:text-[#0071e3] transition border-t border-[#f0f0f0]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                상세 &amp; AI 포인트
              </span>
              <ChevronRight className="w-4 h-4 text-[#0066cc] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
