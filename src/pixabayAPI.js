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
  #page = 1;
  #totalHits = 0;
  #q = '';

  fetchImages = async () => {
    try {
      const { data } = await axiosInstance.get('', {
        params: {
          q: this.#q,
          page: this.#page,
        },
      });

      const { totalHits } = data;
      this.#totalHits = totalHits;

      return data;
    } catch (error) {
      throw new Error(`API Error in fetch: ${error.message}`);
    }
  };

  setSearchQuery = q => {
    this.#q = q;
  };

  incrementPage = () => {
    this.#page++;
  };

  reset = () => {
    this.#page = 1;
    this.#totalHits = 0;
    this.#q = '';
  };

  isFirstPage = () => {
    return this.#page === 1;
  };

  isLastPage = () => {
    return this.#page > this.#totalHits / PER_PAGE;
  };
}

export { PixabayAPI };
