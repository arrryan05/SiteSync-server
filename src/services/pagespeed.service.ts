import axios from 'axios';
import { config } from '../config';

export async function fetchPageSpeedInsights(url: string): Promise<any> {
  try {
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&category=performance&key=${config.pageSpeedApiKey}`;

    const response = await axios.get(pageSpeedUrl);
    return response.data;
  } catch (error: any) {
    console.error('PageSpeed Insights Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch performance data');
  }
}
