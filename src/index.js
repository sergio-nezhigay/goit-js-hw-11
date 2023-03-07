import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import Notiflix from 'notiflix';

import { FetchAPI } from './fetchAPI';

import { galleryItems } from './gallery-items';
import { imagesMarkup } from './templates';

const galleryEl = document.querySelector('.gallery');
const galleryItemsHtml = imagesMarkup(galleryItems);

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const BASE_URL = 'https://pixabay.com/api/?';

const api = new FetchAPI();
testfunc();

function testfunc() {
  const searchQuery = 'yellow';
  api
    .fetchImages(searchQuery)
    .then(({ hits, total }) => showImages(hits, total));
}

function showImages(images, total) {
  const galleryItemsHtml = imagesMarkup(images);
  console.log('🚀 ~ file: index.js:35 ~ showImages ~ images:', images);
  galleryEl.innerHTML = galleryItemsHtml;
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
// const element = {
//   input: document.querySelector('#search-form'),
// };

// element.input.addEventListener('submit', onSubmit);
// function onSubmit(e) {
//   e.preventDefault();
//   const searchQuery = e.target.elements.searchQuery.value.trim();
//   console.log(searchQuery);
//   api
//     .fetchImages(searchQuery)
//     .then(({ hits, total }) => showImages(hits, total));
// }
