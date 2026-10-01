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
      <div className="py-16 text-center bg-[#121420] border-2 border-slate-700 text-slate-400">
        <Film className="w-12 h-12 mx-auto mb-3 text-[#8400FF]" />
        <p className="text-base font-black text-white">조건에 해당하는 영화 박스오피스 결과가 없습니다.</p>
      </div>
    );
  }

  const renderRankChange = (item: DailyBoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-black bg-[#8400FF] text-white uppercase">
          NEW
        </span>
      );
    }

    const inten = parseInt(item.rankInten, 10);
    if (inten > 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-black text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          {inten}
        </span>
      );
    } else if (inten < 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-black text-rose-400">
          <TrendingDown className="w-3 h-3" />
          {Math.abs(inten)}
        </span>
      );
    }

    return (
      <span className="text-xs text-slate-500 flex items-center justify-center font-bold">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case '1':
        return 'bg-[#8400FF] text-white font-impact border border-white';
      case '2':
        return 'bg-white text-slate-950 font-impact';
      case '3':
        return 'bg-amber-500 text-slate-950 font-impact';
      default:
        return 'bg-[#0b0d14] text-slate-300 border border-slate-700 font-impact';
    }
  };

  return (
    <div className="bg-[#121420] border-2 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-[#0b0d14] text-slate-400 font-black uppercase text-[11px] tracking-wider border-b-2 border-slate-700">
            <tr>
              <th className="py-3.5 px-4 text-center w-16">순위</th>
              <th className="py-3.5 px-2 text-center w-16">변동</th>
              <th className="py-3.5 px-4 font-black">영화명</th>
              <th className="py-3.5 px-3 text-center">개봉일</th>
              <th className="py-3.5 px-4 text-right">당일 관객수</th>
              <th className="py-3.5 px-4 text-right">누적 관객수</th>
              <th className="py-3.5 px-4 text-right hidden lg:table-cell">당일 매출액</th>
              <th className="py-3.5 px-3 text-center">매출 점유율</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">스크린 / 상영수</th>
              <th className="py-3.5 px-4 text-center">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {movies.map((movie) => (
              <tr
                key={movie.movieCd}
                onClick={() => onSelectMovie(movie)}
                className="hover:bg-[#1c1f30] transition cursor-pointer group"
              >
                {/* Rank */}
                <td className="py-3.5 px-4 text-center font-bold">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-sm ${getRankBadgeClass(
                      movie.rank
                    )}`}
                  >
                    {movie.rank}
                  </span>
                </td>

                {/* Rank Change */}
                <td className="py-3.5 px-2 text-center">{renderRankChange(movie)}</td>

                {/* Movie Title */}
                <td className="py-3.5 px-4 font-black text-white group-hover:text-[#a855f7] transition">
                  <span className="line-clamp-1">{movie.movieNm}</span>
                </td>

                {/* Open Date */}
                <td className="py-3.5 px-3 text-center text-slate-400 font-impact text-xs tracking-wider">
                  {movie.openDt || '-'}
                </td>

                {/* Daily Audience */}
                <td className="py-3.5 px-4 text-right font-impact text-base tracking-wider text-white">
                  {formatNumber(movie.audiCnt)}명
                </td>

                {/* Cumulative Audience */}
                <td className="py-3.5 px-4 text-right text-[#a855f7] font-impact text-base tracking-wider">
                  {formatNumber(movie.audiAcc)}명
                </td>

                {/* Daily Sales */}
                <td className="py-3.5 px-4 text-right text-slate-300 font-black hidden lg:table-cell">
                  {formatKoreanSales(movie.salesAmt)}
                </td>

                {/* Sales Share */}
                <td className="py-3.5 px-3 text-center font-impact text-base tracking-wider text-white">
                  {movie.salesShare}%
                </td>

                {/* Screens / Shows */}
                <td className="py-3.5 px-4 text-center font-impact text-xs text-slate-400 hidden md:table-cell">
                  {formatNumber(movie.scrnCnt)}관 / {formatNumber(movie.showCnt)}회
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-center">
                  <button className="p-1.5 bg-[#0b0d14] group-hover:bg-[#8400FF] group-hover:text-white text-slate-400 border border-slate-700 transition">
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
