import axios from 'axios';

const API_KEY = '34178122-6f2f44cafc8883bb29b8df8c2';
const BASE_URL = 'https://pixabay.com/api';

class FetchAPI {
  constructor() {
    this.params = new URLSearchParams({
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      pretty: true,
    });
  }

  async fetchImages({ searchQuery, page, per_page }) {
    try {
      console.log('fetchImages...');
      this.params.set('q', searchQuery);
      this.params.set('page', page);
      this.params.set('per_page', per_page);
      const url = new URL(BASE_URL);
      url.search = this.params;

      let res = await axios.get(url);

      return res.data;
    } catch (error) {
      throw new Error(`API Error in fetch: ${error.message}`);
    }
  }
}

export { FetchAPI };
