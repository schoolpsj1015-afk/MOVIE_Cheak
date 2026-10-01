import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Get KOBIS API Key from env (never exposed to client)
const getKobisApiKey = () => {
  return process.env.KOBIS_API_KEY || 'cbc4884c5d1dfa61bae79060737a661a';
};

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini client:', err);
  }
}

// 1. Daily Box Office Proxy Endpoint
app.get('/api/boxoffice', async (req, res) => {
  try {
    const { targetDt, multiType, repNationCd } = req.query;

    if (!targetDt || typeof targetDt !== 'string' || !/^\d{8}$/.test(targetDt)) {
      return res.status(400).json({
        error: '유효한 YYYYMMDD 형식의 targetDt 날짜 파라미터가 필요합니다.',
      });
    }

    const apiKey = getKobisApiKey();
    let url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${targetDt}`;

    if (multiType) {
      url += `&multiMlbftCd=${encodeURIComponent(String(multiType))}`;
    }
    if (repNationCd) {
      url += `&repNationCd=${encodeURIComponent(String(repNationCd))}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`KOBIS API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching boxoffice:', error);
    return res.status(500).json({
      error: '박스오피스 데이터를 불러오는데 실패했습니다.',
      details: error?.message || String(error),
    });
  }
});

// 2. Movie Detail Info Proxy Endpoint
app.get('/api/movie-info', async (req, res) => {
  try {
    const { movieCd } = req.query;

    if (!movieCd || typeof movieCd !== 'string') {
      return res.status(400).json({
        error: 'movieCd 파라미터가 필요합니다.',
      });
    }

    const apiKey = getKobisApiKey();
    const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCd}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`KOBIS API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching movie info:', error);
    return res.status(500).json({
      error: '영화 상세 정보를 불러오는데 실패했습니다.',
      details: error?.message || String(error),
    });
  }
});

// 3. AI Movie Insights / Summary Endpoint
app.post('/api/movie-ai-insight', async (req, res) => {
  try {
    const { movieNm, directors, actors, genres, openDt, rank, audiAcc } = req.body;

    if (!movieNm) {
      return res.status(400).json({ error: 'movieNm 이 필요합니다.' });
    }

    if (!aiClient || !process.env.GEMINI_API_KEY) {
      return res.json({
        overview: `${movieNm}은(는) ${openDt || '최근'} 개봉하여 현재 박스오피스 ${rank || '상위'}위를 기록중인 영화입니다.`,
        highlights: ['관객들의 높은 관심을 모으고 있는 작품', '화제의 연출 및 배우진 출연'],
        recommendationReason: '박스오피스 상위권 인기 영화로 극장에서 볼만한 영화입니다.',
        targetAudience: '영화 팬 및 주말 극장 방문객',
      });
    }

    const prompt = `
영화 정보:
- 제목: ${movieNm}
- 감독: ${directors || '정보 없음'}
- 주요 출연: ${actors || '정보 없음'}
- 장르: ${genres || '정보 없음'}
- 개봉일: ${openDt || '정보 없음'}
- 현재 박스오피스 순위: ${rank || '정보 없음'}위
- 누적 관객수: ${audiAcc ? Number(audiAcc).toLocaleString() : '정보 없음'}명

위 영화 정보를 바탕으로 한국어로 친절하고 매력적인 핵심 관람 포인트 요약을 JSON 형식으로 작성해줘.
응답은 반드시 아래 JSON 구조만 출력해줘:
{
  "overview": "영화 줄거리 및 매력 포인트 요약 (2~3문장)",
  "highlights": ["핵심 관람 포인트 1", "핵심 관람 포인트 2", "핵심 관람 포인트 3"],
  "recommendationReason": "이 영화를 추천하는 이유 (1~2문장)",
  "targetAudience": "이 영화를 특히 추천하는 관객층 (예: SF/액션 팬, 커플, 가족 등)"
}
`;

    const aiRes = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = aiRes.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.json({
      overview: '영화 상세 AI 정보를 불러오지 못했습니다. 기본 데이터로 제공됩니다.',
      highlights: ['인기 영화 작품', '박스오피스 상위 집계'],
      recommendationReason: '영화관 및 온라인 VOD 화제작입니다.',
      targetAudience: '영화 관람객 전체',
    });
  }
});

// Setup Vite or Serve Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KOBIS 일일 박스오피스 | 영화 순위 &amp; 상세 정보</title>
    <meta name="description" content="KOBIS 영화관입장권통합전산망 API 기반 일일 박스오피스 순위 및 실시간 상세 영화 정보 조회" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  </head>
  <body class="bg-slate-900 text-slate-100 min-h-screen antialiased selection:bg-rose-500 selection:text-white font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
