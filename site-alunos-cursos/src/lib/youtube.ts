export async function getYoutubeVideoDuration(videoId: string): Promise<number> {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return 0;
    }

    const html = await response.text();
    const match = html.match(/"lengthSeconds":"(\d+)"/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching YouTube duration:', error);
    return 0;
  }
}
