import React from 'react';
import { Search, ArrowUpDown, LayoutGrid, Table } from 'lucide-react';
import { BoxOfficeFilterOptions } from '../types/kobis';

interface FilterBarProps {
  filters: BoxOfficeFilterOptions;
  onFilterChange: (updated: Partial<BoxOfficeFilterOptions>) => void;
  viewMode: 'TABLE' | 'GRID';
  onViewModeChange: (mode: 'TABLE' | 'GRID') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left: Search input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="영화 제목 검색..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[#1d1d1f] text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:bg-white placeholder-[#86868b] transition"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-normal text-[#86868b] hover:text-[#1d1d1f]"
          >
            초기화
          </button>
        )}
      </div>

      {/* Middle: Filters & Sorting */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* MultiType Filter (Commercial vs Indie) */}
        <div className="flex items-center bg-[#f5f5f7] p-1 rounded-full border border-[#e0e0e0] text-xs font-normal">
          <button
            onClick={() => onFilterChange({ multiType: 'ALL' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.multiType === 'ALL'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => onFilterChange({ multiType: 'COMMERCIAL' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.multiType === 'COMMERCIAL'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            상업
          </button>
          <button
            onClick={() => onFilterChange({ multiType: 'INDIE' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.multiType === 'INDIE'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            다양성
          </button>
        </div>

        {/* Nation Filter (Domestic vs Foreign) */}
        <div className="flex items-center bg-[#f5f5f7] p-1 rounded-full border border-[#e0e0e0] text-xs font-normal">
          <button
            onClick={() => onFilterChange({ repNation: 'ALL' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.repNation === 'ALL'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => onFilterChange({ repNation: 'DOMESTIC' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.repNation === 'DOMESTIC'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            한국
          </button>
          <button
            onClick={() => onFilterChange({ repNation: 'FOREIGN' })}
            className={`px-3 py-1 rounded-full transition active:scale-95 ${
              filters.repNation === 'FOREIGN'
                ? 'bg-[#0066cc] text-white font-medium shadow-sm'
                : 'text-[#515154] hover:text-[#1d1d1f]'
            }`}
          >
            외국
          </button>
        </div>

        {/* Sort select */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="appearance-none pl-3 pr-8 py-1.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[#1d1d1f] text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#0066cc]"
          >
            <option value="RANK">순위순</option>
            <option value="AUDI">관객수 높은순</option>
            <option value="SALES_SHARE">점유율 높은순</option>
            <option value="OPEN_DT">최신 개봉일순</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#0066cc] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right: View mode toggle & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-[#f0f0f0]">
        <span className="text-xs font-normal text-[#86868b]">
          총 <strong className="text-[#1d1d1f] font-semibold">{totalCount}</strong>개 작품
        </span>

        <div className="flex items-center bg-[#f5f5f7] p-1 rounded-full border border-[#e0e0e0]">
          <button
            onClick={() => onViewModeChange('GRID')}
            className={`p-1.5 rounded-full transition active:scale-95 ${
              viewMode === 'GRID' ? 'bg-white text-[#0066cc] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
            title="카드 그리드 뷰"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('TABLE')}
            className={`p-1.5 rounded-full transition active:scale-95 ${
              viewMode === 'TABLE' ? 'bg-white text-[#0066cc] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
            title="테이블 리스트 뷰"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
