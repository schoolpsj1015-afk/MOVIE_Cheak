import {
  DailyBoxOfficeResponse,
  MovieInfoResponse,
  AiMovieSummary,
  DailyBoxOfficeItem,
  MovieInfoDetail,
} from '../types/kobis';

const FALLBACK_KOBIS_KEY = 'cbc4884c5d1dfa61bae79060737a661a';

/**
 * Service to fetch box office and movie details.
 * Tries relative proxy endpoint `/api/*` first (for full-stack Express / Vercel Serverless).
 * If 404 occurs (e.g., deployed as a purely static site on Vercel/Netlify),
 * falls back to fetching directly from KOBIS Open API endpoints.
 */

export async function fetchDailyBoxOffice(
  targetDt: string,
  options?: { multiType?: string; repNationCd?: string }
): Promise<DailyBoxOfficeResponse> {
  const params = new URLSearchParams({ targetDt });
  if (options?.multiType) params.append('multiType', options.multiType);
  if (options?.repNationCd) params.append('repNationCd', options.repNationCd);

  try {
    const response = await fetch(`/api/boxoffice?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      if (!data.faultInfo) return data;
    }

    // If 404 or backend proxy not present (e.g. static Vercel host), fallback to direct KOBIS API
    if (response.status === 404 || !response.ok) {
      console.warn(`Proxy endpoint returned ${response.status}. Falling back to direct KOBIS API call.`);
      return await fetchDirectDailyBoxOffice(targetDt, options);
    }

    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch box office data (${response.status})`);
  } catch (error) {
    console.warn('Proxy fetch failed, trying direct KOBIS API:', error);
    return await fetchDirectDailyBoxOffice(targetDt, options);
  }
}

async function fetchDirectDailyBoxOffice(
  targetDt: string,
  options?: { multiType?: string; repNationCd?: string }
): Promise<DailyBoxOfficeResponse> {
  let url = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${FALLBACK_KOBIS_KEY}&targetDt=${targetDt}`;

  if (options?.multiType) {
    url += `&multiMlbftCd=${encodeURIComponent(options.multiType)}`;
  }
  if (options?.repNationCd) {
    url += `&repNationCd=${encodeURIComponent(options.repNationCd)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`KOBIS API HTTP 오류: ${response.status}`);
  }

  const data = await response.json();
  if (data.faultInfo) {
    throw new Error(`KOBIS API 오류: ${data.faultInfo.message || 'API 호출 실패'}`);
  }

  return data;
}

export async function fetchMovieDetail(movieCd: string): Promise<MovieInfoResponse> {
  try {
    const response = await fetch(`/api/movie-info?movieCd=${encodeURIComponent(movieCd)}`);
    if (response.ok) {
      const data = await response.json();
      if (!data.faultInfo) return data;
    }

    if (response.status === 404 || !response.ok) {
      console.warn(`Proxy endpoint returned ${response.status}. Falling back to direct KOBIS movie info.`);
      return await fetchDirectMovieDetail(movieCd);
    }

    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch movie info (${response.status})`);
  } catch (error) {
    console.warn('Proxy fetch failed, trying direct KOBIS movie info:', error);
    return await fetchDirectMovieDetail(movieCd);
  }
}

async function fetchDirectMovieDetail(movieCd: string): Promise<MovieInfoResponse> {
  const url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${FALLBACK_KOBIS_KEY}&movieCd=${encodeURIComponent(movieCd)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`KOBIS API HTTP 오류: ${response.status}`);
  }

  const data = await response.json();
  if (data.faultInfo) {
    throw new Error(`KOBIS API 오류: ${data.faultInfo.message || 'API 호출 실패'}`);
  }

  return data;
}

export async function fetchAiMovieInsight(
  boxOfficeItem: DailyBoxOfficeItem,
  detailInfo?: MovieInfoDetail
): Promise<AiMovieSummary> {
  const directors = detailInfo?.directors.map((d) => d.peopleNm).join(', ') || '';
  const actors = detailInfo?.actors.slice(0, 5).map((a) => a.peopleNm).join(', ') || '';
  const genres = detailInfo?.genres.map((g) => g.genreNm).join(', ') || '';

  try {
    const response = await fetch('/api/movie-ai-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieNm: boxOfficeItem.movieNm,
        directors,
        actors,
        genres,
        openDt: boxOfficeItem.openDt,
        rank: boxOfficeItem.rank,
        audiAcc: boxOfficeItem.audiAcc,
      }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('AI insight endpoint error, using fallback format:', err);
  }

  // Local fallback if AI API endpoint returns 404 or fails
  return {
    movieCd: boxOfficeItem.movieCd,
    movieNm: boxOfficeItem.movieNm,
    overview: `${boxOfficeItem.movieNm}은(는) ${boxOfficeItem.openDt || '최근'} 개봉하여 현재 일일 박스오피스 ${boxOfficeItem.rank}위를 기록하고 있는 화제작입니다.`,
    highlights: [
      `현재 박스오피스 ${boxOfficeItem.rank}위 달성`,
      `누적 관객수 ${Number(boxOfficeItem.audiAcc).toLocaleString()}명 돌파`,
      `당일 매출 점유율 ${boxOfficeItem.salesShare}% 기록`,
    ],
    recommendationReason: '현재 가장 많은 주목을 받는 극장 상영작 중 하나로 관람 가치가 높습니다.',
    targetAudience: genres ? `${genres} 장르 선호 관객 및 극장 방문객` : '영화 팬 및 극장 방문객',
  };
}
