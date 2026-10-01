export interface DailyBoxOfficeItem {
  rnum: string;
  rank: string;
  rankInten: string;
  rankOldAndNew: 'OLD' | 'NEW';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface BoxOfficeResult {
  boxofficeType: string;
  showRange: string;
  dailyBoxOfficeList: DailyBoxOfficeItem[];
}

export interface DailyBoxOfficeResponse {
  boxOfficeResult: BoxOfficeResult;
}

export interface MovieInfoNation {
  nationNm: string;
}

export interface MovieInfoGenre {
  genreNm: string;
}

export interface MovieInfoDirector {
  peopleNm: string;
  peopleNmEn?: string;
}

export interface MovieInfoActor {
  peopleNm: string;
  peopleNmEn?: string;
  cast?: string;
}

export interface MovieInfoShowType {
  showTypeGroupNm: string;
  showTypeNm: string;
}

export interface MovieInfoCompany {
  companyCd: string;
  companyNm: string;
  companyNmEn?: string;
  companyPartNm: string;
}

export interface MovieInfoAudit {
  auditNo: string;
  watchGradeNm: string;
}

export interface MovieInfoStaff {
  peopleNm: string;
  peopleNmEn?: string;
  staffRoleNm: string;
}

export interface MovieInfoDetail {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg: string;
  showTm: string;
  prdtYear: string;
  openDt: string;
  prdtStatNm: string;
  typeNm: string;
  nations: MovieInfoNation[];
  genres: MovieInfoGenre[];
  directors: MovieInfoDirector[];
  actors: MovieInfoActor[];
  showTypes: MovieInfoShowType[];
  companys: MovieInfoCompany[];
  audits: MovieInfoAudit[];
  staffs: MovieInfoStaff[];
}

export interface MovieInfoResponse {
  movieInfoResult: {
    movieInfo: MovieInfoDetail;
    source?: string;
  };
}

export interface AiMovieSummary {
  movieCd: string;
  movieNm: string;
  overview: string;
  highlights: string[];
  recommendationReason: string;
  targetAudience: string;
}

export interface BoxOfficeFilterOptions {
  multiType: 'ALL' | 'COMMERCIAL' | 'INDIE'; // KOBIS multiType: 'K' / 'F' or multiMlbftCd
  repNation: 'ALL' | 'DOMESTIC' | 'FOREIGN';
  searchQuery: string;
  sortBy: 'RANK' | 'AUDI' | 'SALES_SHARE' | 'OPEN_DT';
}
