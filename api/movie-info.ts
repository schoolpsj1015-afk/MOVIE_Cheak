export default async function handler(req: any, res: any) {
  try {
    const { movieCd } = req.query || {};

    if (!movieCd || typeof movieCd !== 'string') {
      return res.status(400).json({
        error: 'movieCd 파라미터가 필요합니다.',
      });
    }

    const apiKey = process.env.KOBIS_API_KEY || 'cbc4884c5d1dfa61bae79060737a661a';
    const url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCd}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`KOBIS API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching movie info:', error);
    return res.status(500).json({
      error: '영화 상세 정보를 불러오는데 실패했습니다.',
      details: error?.message || String(error),
    });
  }
}
