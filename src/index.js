import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import Notiflix from 'notiflix';

import { FetchAPI } from './fetchAPI';

import { imagesMarkup } from './templates';

const element = {
  input: document.querySelector('.search-form'),
  loadmoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const per_page = 40;
let page = 1;
let gallery = null;
const api = new FetchAPI();
let searchQuery = 'black';

fetchAndShow(searchQuery);

function fetchAndShow() {
  element.loadmoreButton.classList.add('hidden');

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
          element.loadmoreButton.classList.remove('hidden');
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
  element.gallery.insertAdjacentHTML('beforeend', galleryItemsHtml);
  if (!gallery) {
    gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    gallery.refresh();
    const { height: cardHeight } =
      element.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

element.loadmoreButton.addEventListener('click', fetchAndShow);

element.input.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  if (searchQuery) {
    page = 1;
    if (gallery) {
      gallery.destroy();
      gallery = null;
    }
    element.gallery.innerHTML = '';
    fetchAndShow();
  }
}
