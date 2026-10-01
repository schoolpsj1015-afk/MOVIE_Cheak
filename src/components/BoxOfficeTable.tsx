import React from 'react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatKoreanSales } from '../utils/date';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Film } from 'lucide-react';

interface BoxOfficeTableProps {
  movies: DailyBoxOfficeItem[];
  onSelectMovie: (movie: DailyBoxOfficeItem) => void;
}

export const BoxOfficeTable: React.FC<BoxOfficeTableProps> = ({ movies, onSelectMovie }) => {
  if (movies.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-[#e0e0e0] rounded-2xl text-[#86868b]">
        <Film className="w-12 h-12 mx-auto mb-3 text-[#0066cc]/40" />
        <p className="text-base font-semibold text-[#1d1d1f]">조건에 해당하는 영화 박스오피스 결과가 없습니다.</p>
      </div>
    );
  }

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#0066cc] text-white rounded-full">
          NEW
        </span>
      );
    }

    const inten = parseInt(item.rankInten, 10);
    if (inten > 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-[#137333]">
          <TrendingUp className="w-3 h-3" />
          {inten}
        </span>
      );
    } else if (inten < 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-semibold text-[#c5221f]">
          <TrendingDown className="w-3 h-3" />
          {Math.abs(inten)}
        </span>
      );
    }

    return (
      <span className="text-xs text-[#86868b] flex items-center justify-center">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case '1':
        return 'bg-[#0066cc] text-white font-semibold';
      case '2':
      case '3':
        return 'bg-[#1d1d1f] text-white font-semibold';
      default:
        return 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0] font-medium';
    }
  };

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#1d1d1f]">
          <thead className="bg-[#f5f5f7] text-[#86868b] font-semibold uppercase text-[11px] tracking-tight border-b border-[#e0e0e0]">
            <tr>
              <th className="py-3.5 px-4 text-center w-16">순위</th>
              <th className="py-3.5 px-2 text-center w-16">변동</th>
              <th className="py-3.5 px-4 font-semibold">영화명</th>
              <th className="py-3.5 px-3 text-center">개봉일</th>
              <th className="py-3.5 px-4 text-right">당일 관객수</th>
              <th className="py-3.5 px-4 text-right">누적 관객수</th>
              <th className="py-3.5 px-4 text-right hidden lg:table-cell">당일 매출액</th>
              <th className="py-3.5 px-3 text-center">매출 점유율</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">스크린 / 상영수</th>
              <th className="py-3.5 px-4 text-center">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {movies.map((movie) => (
              <tr
                key={movie.movieCd}
                onClick={() => onSelectMovie(movie)}
                className="hover:bg-[#fafafc] transition-colors cursor-pointer group active:bg-[#f5f5f7]"
              >
                {/* Rank */}
                <td className="py-3.5 px-4 text-center font-bold">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${getRankBadgeClass(
                      movie.rank
                    )}`}
                  >
                    {movie.rank}
                  </span>
                </td>

                {/* Rank Change */}
                <td className="py-3.5 px-2 text-center">{renderRankChange(movie)}</td>

                {/* Movie Title */}
                <td className="py-3.5 px-4 font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors font-display">
                  <span className="line-clamp-1">{movie.movieNm}</span>
                </td>

                {/* Open Date */}
                <td className="py-3.5 px-3 text-center text-[#86868b] text-xs font-normal">
                  {movie.openDt || '-'}
                </td>

                {/* Daily Audience */}
                <td className="py-3.5 px-4 text-right font-semibold text-[#1d1d1f]">
                  {formatNumber(movie.audiCnt)}명
                </td>

                {/* Cumulative Audience */}
                <td className="py-3.5 px-4 text-right text-[#0066cc] font-medium">
                  {formatNumber(movie.audiAcc)}명
                </td>

                {/* Daily Sales */}
                <td className="py-3.5 px-4 text-right text-[#515154] hidden lg:table-cell font-normal">
                  {formatKoreanSales(movie.salesAmt)}
                </td>

                {/* Sales Share */}
                <td className="py-3.5 px-3 text-center font-semibold text-[#0066cc]">
                  {movie.salesShare}%
                </td>

                {/* Screens / Shows */}
                <td className="py-3.5 px-4 text-center text-xs text-[#86868b] hidden md:table-cell font-normal">
                  {formatNumber(movie.scrnCnt)}관 / {formatNumber(movie.showCnt)}회
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1 rounded-full bg-[#f5f5f7] group-hover:bg-[#0066cc] group-hover:text-white text-[#86868b] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
