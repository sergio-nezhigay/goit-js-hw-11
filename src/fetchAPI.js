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

  fetchImages(name) {
    this.params.s = name;
    const url = new URL(BASE_URL);
    url.search = this.params;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
}

export { FetchAPI };
