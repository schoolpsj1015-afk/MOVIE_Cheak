import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  try {
    const { movieNm, directors, actors, genres, openDt, rank, audiAcc } = req.body || {};

    if (!movieNm) {
      return res.status(400).json({ error: 'movieNm 이 필요합니다.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        overview: `${movieNm}은(는) ${openDt || '최근'} 개봉하여 현재 박스오피스 ${rank || '상위'}위를 기록중인 영화입니다.`,
        highlights: ['관객들의 높은 관심을 모으고 있는 작품', '화제의 연출 및 배우진 출연'],
        recommendationReason: '박스오피스 상위권 인기 영화로 극장에서 볼만한 영화입니다.',
        targetAudience: '영화 팬 및 주말 극장 방문객',
      });
    }

    const aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.status(200).json({
      overview: '영화 상세 AI 정보를 불러오지 못했습니다. 기본 데이터로 제공됩니다.',
      highlights: ['인기 영화 작품', '박스오피스 상위 집계'],
      recommendationReason: '영화관 및 온라인 VOD 화제작입니다.',
      targetAudience: '영화 관람객 전체',
    });
  }
}
