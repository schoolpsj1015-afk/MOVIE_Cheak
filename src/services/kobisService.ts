import {
  DailyBoxOfficeResponse,
  MovieInfoResponse,
  AiMovieSummary,
  DailyBoxOfficeItem,
  MovieInfoDetail,
} from '../types/kobis';

/**
 * Service to fetch box office and movie details via the server proxy endpoints.
 */

export async function fetchDailyBoxOffice(
  targetDt: string,
  options?: { multiType?: string; repNationCd?: string }
): Promise<DailyBoxOfficeResponse> {
  const params = new URLSearchParams({ targetDt });
  if (options?.multiType) params.append('multiType', options.multiType);
  if (options?.repNationCd) params.append('repNationCd', options.repNationCd);

  const response = await fetch(`/api/boxoffice?${params.toString()}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch box office data (${response.status})`);
  }

  const data = await response.json();
  if (data.faultInfo) {
    throw new Error(`KOBIS API Error: ${data.faultInfo.message || 'API call failed'}`);
  }
  return data;
}

export async function fetchMovieDetail(movieCd: string): Promise<MovieInfoResponse> {
  const response = await fetch(`/api/movie-info?movieCd=${encodeURIComponent(movieCd)}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch movie info (${response.status})`);
  }

  const data = await response.json();
  if (data.faultInfo) {
    throw new Error(`KOBIS API Error: ${data.faultInfo.message || 'API call failed'}`);
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

  if (!response.ok) {
    throw new Error('Failed to generate AI insight');
  }

  return response.json();
}
