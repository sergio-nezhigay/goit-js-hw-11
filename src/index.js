import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import Notiflix from 'notiflix';

import { FetchAPI } from './fetchAPI';

import { imagesMarkup } from './templates';

const loadmoreButtonEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
const per_page = 40;
let lightBox;

const api = new FetchAPI();
fetchAndShow();

function fetchAndShow() {
  const searchQuery = 'black';
  loadmoreButtonEl.classList.add('hidden');
  api
    .fetchImages({ searchQuery, page, per_page })
    .then(({ hits, totalHits }) => {
      showImages(hits);
      if (!hits.length) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        if (page === 1) {
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        if (page++ <= totalHits / per_page) {
          loadmoreButtonEl.classList.remove('hidden');
        } else {
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    });
}

function showImages(images) {
  const galleryItemsHtml = imagesMarkup(images);
  galleryEl.insertAdjacentHTML('beforeend', galleryItemsHtml);
  if (!lightBox) {
    lightBox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightBox.refresh();
    const { height: cardHeight } =
      galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

loadmoreButtonEl.addEventListener('click', fetchAndShow);

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
