import axios from 'axios';

const API_KEY = '34178122-6f2f44cafc8883bb29b8df8c2';
const BASE_URL = 'https://pixabay.com/api';
const PER_PAGE = 40;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: PER_PAGE,
    safesearch: true,
    pretty: true,
  },
});

class PixabayAPI {
  constructor() {
    this._page = 1;
    this._totalHits = 0;
    this._q = '';
  }

  async fetchImages() {
    try {
      const res = await axiosInstance.get('', {
        params: {
          q: this._q,
          page: this._page,
        },
      });

      this._totalHits = res.data?.totalHits;
      return res.data;
    } catch (error) {
      throw new Error(`API Error in fetch: ${error.message}`);
    }
  }

  set searchQuery(q) {
    this._q = q;
  }

  incrementPage() {
    this._page++;
  }

  reset() {
    this._page = 1;
    this._totalHits = 0;
    this._q = '';
  }

  isFirstPage() {
    return this._page === 1;
  }

  isLastPage() {
    return this._page > this._totalHits / PER_PAGE;
  }
}

export { PixabayAPI };
