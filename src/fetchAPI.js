import axios from 'axios';

const API_KEY = '34178122-6f2f44cafc8883bb29b8df8c2';
const BASE_URL = 'https://pixabay.com/api';

const tmp =
  'https://pixabay.com/api?key=34178122-6f2f44cafc8883bb29b8df8c2&image_type=photo&orientation=horizontal&safesearch=true&pretty=true&q=red&page=2&per_page=40';

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
      this.params.set('q', searchQuery);
      this.params.set('page', page);
      this.params.set('per_page', per_page);
      const url = new URL(BASE_URL);
      url.search = this.params;
      let res = await axios.get(tmp);
      return res.data;
    } catch (error) {
      throw new Error(`API Error in fetch: ${error.message}`);
    }
  }
}

export { FetchAPI };
