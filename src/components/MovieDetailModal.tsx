import React, { useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  Film,
  Calendar,
  Clock,
  User,
  Users,
  Globe,
  Award,
  Building,
  Youtube,
  Search,
  CheckCircle2,
  TrendingUp,
  Ticket,
  Loader2,
  BarChart2,
} from 'lucide-react';
import { DailyBoxOfficeItem, MovieInfoDetail, AiMovieSummary } from '../types/kobis';
import { fetchMovieDetail, fetchAiMovieInsight } from '../services/kobisService';
import { formatNumber, formatKoreanSales } from '../utils/date';

interface MovieDetailModalProps {
  movie: DailyBoxOfficeItem | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  const [detail, setDetail] = useState<MovieInfoDetail | null>(null);
  const [aiInsight, setAiInsight] = useState<AiMovieSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'STATS' | 'AI'>('INFO');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movie) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setDetail(null);
    setAiInsight(null);

    fetchMovieDetail(movie.movieCd)
      .then((res) => {
        if (!isMounted) return;
        const info = res.movieInfoResult?.movieInfo;
        setDetail(info || null);
        setLoading(false);

        setAiLoading(true);
        fetchAiMovieInsight(movie, info)
          .then((aiData) => {
            if (isMounted) {
              setAiInsight(aiData);
              setAiLoading(false);
            }
          })
          .catch((err) => {
            console.error('AI Insight Error:', err);
            if (isMounted) setAiLoading(false);
          });
      })
      .catch((err) => {
        console.error('Fetch Movie Detail Error:', err);
        if (isMounted) {
          setError('영화 상세 정보를 불러오지 못했습니다.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movie]);

  if (!movie) return null;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.movieNm + ' 예고편')}`;
  const naverSearchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent('영화 ' + movie.movieNm)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-none animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#0b0d14] border-2 border-[#8400FF] my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-[#121420] p-6 sm:p-8 border-b-2 border-[#8400FF]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#0b0d14] hover:bg-[#8400FF] text-white transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Rank Badge */}
            <div className="w-12 h-12 bg-[#8400FF] text-white font-impact text-3xl border-2 border-white flex items-center justify-center shrink-0">
              #{movie.rank}
            </div>

            {/* Movie Title Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {movie.movieNm}
                </h2>
                {movie.rankOldAndNew === 'NEW' && (
                  <span className="px-2.5 py-0.5 text-xs font-black bg-[#8400FF] text-white border border-white uppercase">
                    NEW
                  </span>
                )}
              </div>
              {detail?.movieNmEn && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">{detail.movieNmEn}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-slate-300 font-black mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8400FF]" />
                  개봉일: {movie.openDt}
                </span>
                {detail?.showTm && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8400FF]" />
                    상영시간: {detail.showTm}분
                  </span>
                )}
                {detail?.audits?.[0]?.watchGradeNm && (
                  <span className="px-2 py-0.5 bg-[#0b0d14] border border-slate-700 text-white font-black">
                    {detail.audits[0].watchGradeNm}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t-2 border-slate-800">
            <button
              onClick={() => setActiveTab('INFO')}
              className={`px-4 py-2 text-xs sm:text-sm font-black transition flex items-center gap-1.5 border-2 ${
                activeTab === 'INFO'
                  ? 'bg-[#8400FF] border-white text-white'
                  : 'bg-[#0b0d14] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              기본 정보
            </button>
            <button
              onClick={() => setActiveTab('STATS')}
              className={`px-4 py-2 text-xs sm:text-sm font-black transition flex items-center gap-1.5 border-2 ${
                activeTab === 'STATS'
                  ? 'bg-[#8400FF] border-white text-white'
                  : 'bg-[#0b0d14] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              박스오피스 통계
            </button>
            <button
              onClick={() => setActiveTab('AI')}
              className={`px-4 py-2 text-xs sm:text-sm font-black transition flex items-center gap-1.5 border-2 ${
                activeTab === 'AI'
                  ? 'bg-[#8400FF] border-white text-white font-black'
                  : 'bg-[#0b0d14] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI 관람 포인트
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#8400FF]" />
              <span className="text-sm font-black text-white">영화 상세 정보를 불러오는 중입니다...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-950 border border-rose-500 text-rose-300 text-center text-sm font-black">
              {error}
            </div>
          ) : (
            <>
              {/* TAB 1: 영화 기본 정보 */}
              {activeTab === 'INFO' && detail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-[#121420] border-2 border-slate-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">감독</span>
                        <span className="text-white font-black">
                          {detail.directors.map((d) => d.peopleNm).join(', ') || '정보 없음'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">출연진</span>
                        <span className="text-white font-black">
                          {detail.actors.length > 0
                            ? detail.actors
                                .slice(0, 8)
                                .map((a) => a.peopleNm + (a.cast ? ` (${a.cast}역)` : ''))
                                .join(', ')
                            : '정보 없음'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Film className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">장르</span>
                        <span className="text-white font-black">
                          {detail.genres.map((g) => g.genreNm).join(', ') || '정보 없음'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#121420] border-2 border-slate-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">제작 국가 / 년도</span>
                        <span className="text-white font-black">
                          {detail.nations.map((n) => n.nationNm).join(', ')} ({detail.prdtYear}년)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">제작/배급사</span>
                        <span className="text-white font-black">
                          {detail.companys
                            .slice(0, 3)
                            .map((c) => `${c.companyNm} (${c.companyPartNm})`)
                            .join(', ') || '정보 없음'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-black">관람 등급</span>
                        <span className="text-white font-black">
                          {detail.audits?.[0]?.watchGradeNm || '등급 정보 없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 박스오피스 수치 성과 */}
              {activeTab === 'STATS' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-[#121420] border-2 border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-black block">일일 관객수</span>
                      <strong className="text-xl sm:text-2xl text-white font-impact tracking-wider block mt-1">
                        {formatNumber(movie.audiCnt)}명
                      </strong>
                    </div>

                    <div className="p-4 bg-[#121420] border-2 border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-black block">누적 관객수</span>
                      <strong className="text-xl sm:text-2xl text-[#a855f7] font-impact tracking-wider block mt-1">
                        {formatNumber(movie.audiAcc)}명
                      </strong>
                    </div>

                    <div className="p-4 bg-[#121420] border-2 border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-black block">매출액 점유율</span>
                      <strong className="text-xl sm:text-2xl text-white font-impact tracking-wider block mt-1">
                        {movie.salesShare}%
                      </strong>
                    </div>

                    <div className="p-4 bg-[#121420] border-2 border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-black block">스크린 / 상영수</span>
                      <strong className="text-xl sm:text-2xl text-slate-200 font-impact tracking-wider block mt-1">
                        {formatNumber(movie.scrnCnt)}관
                      </strong>
                    </div>
                  </div>

                  <div className="p-4 bg-[#121420] border-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 font-black">
                      <Ticket className="w-5 h-5 text-[#8400FF]" />
                      <span className="text-slate-300">당일 매출액:</span>
                      <strong className="text-white font-impact text-base tracking-wider">{formatKoreanSales(movie.salesAmt)}</strong>
                    </div>
                    <div className="flex items-center gap-2 font-black">
                      <TrendingUp className="w-5 h-5 text-[#8400FF]" />
                      <span className="text-slate-300">누적 매출액:</span>
                      <strong className="text-white font-impact text-base tracking-wider">{formatKoreanSales(movie.salesAcc)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Gemini AI 관람 포인트 */}
              {activeTab === 'AI' && (
                <div className="space-y-4">
                  {aiLoading ? (
                    <div className="py-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Sparkles className="w-6 h-6 animate-spin text-[#8400FF]" />
                      <span className="text-xs font-black text-white">Gemini AI 관람 포인트 분석 중...</span>
                    </div>
                  ) : aiInsight ? (
                    <div className="space-y-4">
                      {/* Overview */}
                      <div className="p-4 bg-[#121420] border-2 border-[#8400FF]">
                        <h4 className="text-xs font-black text-[#a855f7] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <Sparkles className="w-4 h-4" />
                          AI 영화 요약
                        </h4>
                        <p className="text-sm text-slate-200 font-black leading-relaxed">{aiInsight.overview}</p>
                      </div>

                      {/* Highlights */}
                      <div className="p-4 bg-[#121420] border-2 border-slate-800">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">
                          핵심 관람 포인트 3가지
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-black">
                          {aiInsight.highlights?.map((hl, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#8400FF] shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Target Audience & Recommendation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#121420] border border-slate-800">
                          <span className="text-slate-400 font-black block mb-1">추천 이유</span>
                          <p className="text-slate-200 font-black">{aiInsight.recommendationReason}</p>
                        </div>
                        <div className="p-3 bg-[#121420] border border-slate-800">
                          <span className="text-slate-400 font-black block mb-1">추천 관객층</span>
                          <p className="text-slate-200 font-black">{aiInsight.targetAudience}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-6 font-black">
                      AI 관람 포인트를 생성하지 못했습니다.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* External Links */}
          <div className="pt-4 border-t-2 border-slate-800 flex flex-wrap items-center justify-end gap-2">
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider border border-white transition"
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube 예고편</span>
            </a>
            <a
              href={naverSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#8400FF] hover:bg-[#7000DB] text-white text-xs font-black uppercase tracking-wider border border-white transition"
            >
              <Search className="w-4 h-4" />
              <span>네이버 영화 정보</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
