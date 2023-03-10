import 'simplelightbox/dist/simple-lightbox.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { FetchAPI } from './fetchAPI';
import { imagesMarkup } from './templates';

const element = {
  input: document.querySelector('.search-form'),
  loadmoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  deleteSearchButton: document.querySelector('.search-form__button--delete'),
};

const per_page = 40;
let page = 1;
let gallery = null;
let searchQuery;
const api = new FetchAPI();

async function fetchAndShow() {
  try {
    const { hits = [], totalHits = 0 } = await api.fetchImages({
      searchQuery,
      page,
      per_page,
    });

    if (hits.length) {
      showImages(hits);
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
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (e) {
    console.log('Error in app: ', e);
  }
}

// function showImages(images) {
//   const galleryItemsHtml = imagesMarkup(images);
//   element.gallery.insertAdjacentHTML('beforeend', galleryItemsHtml);
//   if (!gallery) {
//     gallery = new SimpleLightbox('.gallery a', {
//       captionsData: 'alt',
//       captionDelay: 250,
//     });
//   } else {
//     gallery.refresh();
//     const { height: cardHeight } =
//       element.gallery.firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });
//   }
// }

element.loadmoreButton.addEventListener('click', () => fetchAndShow());

element.input.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  ({
    searchQuery: { value: searchQuery },
  } = e.target.elements);
  if (searchQuery) {
    clearGallery();
    fetchAndShow();
  }
}

function clearGallery() {
  page = 1;
  if (gallery) {
    gallery.destroy();
    gallery = null;
    element.gallery.innerHTML = '';
  }
  element.loadmoreButton.classList.add('hidden');
}

element.deleteSearchButton.addEventListener('click', onDeleteSearchButton);

function onDeleteSearchButton() {
  element.input.reset();
  clearGallery();
  element.deleteSearchButton.classList.add('hidden');
}

element.input.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
  if (e.target.value.length > 0)
    element.deleteSearchButton.classList.remove('hidden');
  else element.deleteSearchButton.classList.add('hidden');
}

const options = {
  rootMargin: '0px',
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      page++;
      fetchAndShow();
    }
  });
}, options);

observer.observe(element.loadmoreButton);

function showImages(images) {
  const galleryItemsHtml = imagesMarkup(images);
  element.gallery.insertAdjacentHTML('beforeend', galleryItemsHtml);
  if (gallery) {
    gallery.refresh();
  } else {
    gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}
