import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DateSelector } from './components/DateSelector';
import { FilterBar } from './components/FilterBar';
import { BoxOfficeCardGrid } from './components/BoxOfficeCardGrid';
import { BoxOfficeTable } from './components/BoxOfficeTable';
import { BoxOfficeStats } from './components/BoxOfficeStats';
import { MovieDetailModal } from './components/MovieDetailModal';
import { DailyBoxOfficeItem, BoxOfficeFilterOptions } from './types/kobis';
import { fetchDailyBoxOffice } from './services/kobisService';
import { getYesterdayString, formatToKobisDate, formatKoreanDate } from './utils/date';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getYesterdayString());
  const [movies, setMovies] = useState<DailyBoxOfficeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<DailyBoxOfficeItem | null>(null);

  const [filters, setFilters] = useState<BoxOfficeFilterOptions>({
    multiType: 'ALL',
    repNation: 'ALL',
    searchQuery: '',
    sortBy: 'RANK',
  });

  const loadBoxOfficeData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const kobisDate = formatToKobisDate(selectedDate);

      let multiTypeParam: string | undefined = undefined;
      if (filters.multiType === 'COMMERCIAL') multiTypeParam = 'N';
      if (filters.multiType === 'INDIE') multiTypeParam = 'Y';

      let repNationParam: string | undefined = undefined;
      if (filters.repNation === 'DOMESTIC') repNationParam = 'K';
      if (filters.repNation === 'FOREIGN') repNationParam = 'F';

      const response = await fetchDailyBoxOffice(kobisDate, {
        multiType: multiTypeParam,
        repNationCd: repNationParam,
      });

      const list = response.boxOfficeResult?.dailyBoxOfficeList || [];
      setMovies(list);
    } catch (err: any) {
      console.error('Failed to load box office:', err);
      setError(err?.message || '박스오피스 데이터를 가져오지 못했습니다.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoxOfficeData();
  }, [selectedDate, filters.multiType, filters.repNation]);

  const handleFilterChange = (updated: Partial<BoxOfficeFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.trim().toLowerCase();
      result = result.filter((m) => m.movieNm.toLowerCase().includes(query));
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'AUDI') {
        return (parseInt(b.audiCnt, 10) || 0) - (parseInt(a.audiCnt, 10) || 0);
      }
      if (filters.sortBy === 'SALES_SHARE') {
        return (parseFloat(b.salesShare) || 0) - (parseFloat(a.salesShare) || 0);
      }
      if (filters.sortBy === 'OPEN_DT') {
        return (b.openDt || '').localeCompare(a.openDt || '');
      }
      return (parseInt(a.rank, 10) || 0) - (parseInt(b.rank, 10) || 0);
    });

    return result;
  }, [movies, filters.searchQuery, filters.sortBy]);

  const handleExportCsv = () => {
    if (movies.length === 0) return;

    const headers = [
      '순위',
      '영화명',
      '개봉일',
      '당일관객수',
      '누적관객수',
      '당일매출액',
      '누적매출액',
      '매출점유율',
      '스크린수',
      '상영횟수',
    ];

    const rows = movies.map((m) => [
      m.rank,
      `"${m.movieNm.replace(/"/g, '""')}"`,
      m.openDt || '',
      m.audiCnt,
      m.audiAcc,
      m.salesAmt,
      m.salesAcc,
      `${m.salesShare}%`,
      m.scrnCnt,
      m.showCnt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `박스오피스_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 flex flex-col font-sans pb-16">
      {/* Header / Navbar */}
      <Navbar
        selectedDate={selectedDate}
        onRefresh={loadBoxOfficeData}
        onExportCsv={handleExportCsv}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Date Selector Section */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={(newDate) => setSelectedDate(newDate)}
          isLoading={isLoading}
        />

        {/* Box Office Summary Visual Chart/Stats */}
        {!isLoading && !error && movies.length > 0 && <BoxOfficeStats movies={movies} />}

        {/* Filter and View Mode Switch Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          totalCount={filteredAndSortedMovies.length}
        />

        {/* Main Content Area */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-[#121420] border-2 border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin text-[#8400FF]" />
            <p className="text-base font-black text-white">
              {formatKoreanDate(selectedDate)} 박스오피스를 불러오는 중입니다...
            </p>
            <p className="text-xs font-black text-slate-400">KOBIS 영진위 서버와 통신 중</p>
          </div>
        ) : error ? (
          <div className="py-16 px-6 bg-[#121420] border-2 border-rose-600 text-center space-y-4 max-w-xl mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <div>
              <h3 className="text-lg font-black text-white">데이터 조회 실패</h3>
              <p className="text-sm font-black text-rose-400 mt-1">{error}</p>
            </div>
            <button
              onClick={loadBoxOfficeData}
              className="px-4 py-2 bg-[#8400FF] hover:bg-[#7000DB] text-white border border-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
          </div>
        ) : viewMode === 'GRID' ? (
          <BoxOfficeCardGrid
            movies={filteredAndSortedMovies}
            onSelectMovie={(m) => setSelectedMovieForDetail(m)}
          />
        ) : (
          <BoxOfficeTable
            movies={filteredAndSortedMovies}
            onSelectMovie={(m) => setSelectedMovieForDetail(m)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t-2 border-slate-800 py-8 text-center text-xs font-black text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KOBIS 일일 박스오피스. 영화관입장권통합전산망 API 연동.</p>
          <p className="text-slate-400">
            주 색상: <span className="text-[#8400FF] font-impact text-sm">#8400FF</span> &bull; 폰트: <span className="font-impact text-sm">IMPACT</span> &amp; 한국어 <span className="font-black text-white">BLACK (900)</span>
          </p>
        </div>
      </footer>

      {/* Movie Detail Modal */}
      {selectedMovieForDetail && (
        <MovieDetailModal
          movie={selectedMovieForDetail}
          onClose={() => setSelectedMovieForDetail(null)}
        />
      )}
    </div>
  );
}
