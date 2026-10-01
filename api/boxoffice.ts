export default async function handler(req: any, res: any) {
  try {
    const { targetDt, multiType, repNationCd } = req.query || {};

    if (!targetDt || typeof targetDt !== 'string' || !/^\d{8}$/.test(targetDt)) {
      return res.status(400).json({
        error: '유효한 YYYYMMDD 형식의 targetDt 날짜 파라미터가 필요합니다.',
      });
    }

    const apiKey = process.env.KOBIS_API_KEY || 'cbc4884c5d1dfa61bae79060737a661a';
    let url = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${targetDt}`;

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
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching boxoffice:', error);
    return res.status(500).json({
      error: '박스오피스 데이터를 불러오는데 실패했습니다.',
      details: error?.message || String(error),
    });
  }
}
